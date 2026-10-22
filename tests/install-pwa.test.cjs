const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(source => source.includes('beforeinstallprompt'));

function setup({ standalone = false, ios = false, media = true } = {}) {
  const handlers = {};
  const button = { hidden: true, addEventListener: (name, callback) => { handlers[name] = callback; } };
  const display = { matches: standalone, addEventListener: (name, callback) => { handlers['media:' + name] = callback; } };
  const window = { addEventListener: (name, callback) => { handlers[name] = callback; } };
  if (media) window.matchMedia = () => display;
  vm.runInNewContext(script, { window, navigator: { standalone: ios }, document: { getElementById: () => button } });
  return { handlers, button, display };
}

function event(outcome = 'dismissed') {
  return { prevented: false, calls: 0, preventDefault() { this.prevented = true; },
    async prompt() { this.calls++; return { outcome }; } };
}

test('el diálogo solo se invoca por clic y el evento se consume al cancelar o aceptar', async () => {
  for (const outcome of ['dismissed', 'accepted']) {
    const { handlers, button } = setup();
    const prompt = event(outcome);
    assert.equal(button.hidden, true);
    handlers.beforeinstallprompt(prompt);
    assert.equal(prompt.prevented, true);
    assert.equal(button.hidden, false);
    assert.equal(prompt.calls, 0);
    await handlers.click();
    assert.equal(prompt.calls, 1);
    assert.equal(button.hidden, true);
    await handlers.click();
    assert.equal(prompt.calls, 1);
    const next = event();
    handlers.beforeinstallprompt(next);
    assert.equal(button.hidden, false);
  }
});

test('modo instalado y appinstalled mantienen oculto el botón', async () => {
  for (const options of [{ standalone: true }, { ios: true }]) {
    const { handlers, button } = setup(options);
    const prompt = event();
    handlers.beforeinstallprompt(prompt);
    assert.equal(button.hidden, true);
    assert.equal(prompt.prevented, false);
  }
  const { handlers, button, display } = setup();
  handlers.beforeinstallprompt(event());
  display.matches = true;
  handlers['media:change']();
  assert.equal(button.hidden, true);
  display.matches = false;
  handlers.beforeinstallprompt(event());
  handlers.appinstalled();
  handlers.beforeinstallprompt(event());
  assert.equal(button.hidden, true);
  await handlers.click();
});

test('ausencia de soporte y errores del diálogo no interrumpen la página', async () => {
  const { handlers, button } = setup({ media: false });
  await handlers.click();
  assert.equal(button.hidden, true);
  const prompt = event();
  prompt.prompt = () => { throw new Error('no disponible'); };
  handlers.beforeinstallprompt(prompt);
  await assert.doesNotReject(handlers.click());
  assert.equal(button.hidden, true);
});
