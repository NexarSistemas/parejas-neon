# Parejas Neón

Juego de memoria de Nexar Sistemas: encontrá todas las parejas de símbolos en el menor tiempo y con la menor cantidad de movimientos.

## Funcionalidades

- Tres niveles de dificultad: 6, 8 o 10 parejas.
- Tiempo, movimientos y parejas encontradas durante la partida.
- Récord por nivel guardado en el navegador y sonido opcional.
- Instrucciones de juego y opción para iniciar una nueva partida.

## Uso e instalación

Abrí la dirección publicada en un navegador compatible, elegí un nivel y seleccioná dos fichas para encontrar cada pareja. Para instalar el juego, utilizá la opción «Instalar aplicación» o «Agregar a la pantalla de inicio» del navegador; el nombre y la disponibilidad dependen del dispositivo.

La instalación y el uso offline requieren HTTPS (o localhost). Visitá el juego con conexión al menos una vez y esperá a que se descarguen sus recursos. Después podés abrirlo sin conexión desde el navegador o desde el acceso instalado. Los récords se guardan localmente en el navegador, cuando el almacenamiento está disponible.

## Publicación en GitHub Pages

En la configuración del repositorio, elegí **Pages**, seleccioná la publicación desde una rama y configurá `main` y la carpeta raíz. Una vez publicado, abrí la URL que proporciona GitHub Pages. Las rutas son relativas para funcionar bajo la ruta del repositorio.

Al actualizar los recursos, cambiá la versión de `CACHE` en `sw.js`. El nuevo service worker espera a que se cierren las páginas controladas por la versión anterior antes de activarse; luego elimina las cachés anteriores de Parejas Neón.

Licencia: [MIT](LICENSE).
