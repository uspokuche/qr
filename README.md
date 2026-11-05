# A.H.QR

Micrositio estático para crear códigos QR personalizados dentro de siluetas geométricas (suave, círculo, cuadrado, diamante y corazón), con colores configurables para el QR, el fondo y el borde exterior, relleno personalizable para el corazón, y descarga PNG de alta resolución con fondo transparente fuera de la forma.

## Publicar en GitHub Pages

1. Sube `index.html`, `guia.html`, `privacidad.html`, `contacto.html`, `styles.css`, `app.js`, `README.md` y la carpeta `assets` a la raíz de un repositorio.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**, selecciona `main` y la carpeta `/ (root)`, y guarda.
4. Abre la URL que aparece en GitHub Pages.

No necesita instalación ni compilación. La página puede generar QR sin conexión después de cargarla, porque la biblioteca de QR se incluye en `assets`. El sello de autor usa el logotipo incluido en `assets/angel-henriquez-logo.jpg`.

El texto o enlace del QR se procesa en el navegador y la aplicación no lo envía a un servidor ni lo persiste en almacenamiento del sitio. El alojamiento (por ejemplo, GitHub Pages) puede procesar registros técnicos de las visitas; estos no contienen el contenido del formulario.

El campo del contenido empieza vacío; el botón de descarga permanece desactivado hasta que se genere un QR. El generador avisa si los colores elegidos tienen poco contraste o si el QR es más claro que el fondo. Antes de publicar, prueba el PNG descargado en varios teléfonos, con los colores y formas elegidos y al tamaño real de impresión.

## Antes de publicar

- Comprueba la vista móvil, los enlaces entre páginas, el favicon, la generación local y la descarga en la URL publicada de GitHub Pages.
- La carpeta no incluye un repositorio remoto ni configura GitHub Pages por sí sola: sube los archivos y activa Pages siguiendo los pasos anteriores.
- No hay red publicitaria configurada. La monetización requiere aprobación y código del proveedor, revisar consentimiento y privacidad, y verificar que su integración no pueda leer el contenido introducido en el generador.
- Al tener una URL pública, configura una imagen social de vista previa (Open Graph) con esa URL absoluta; no se incluye aquí una dirección de dominio que todavía no existe.

## Contenido del sitio

- `guia.html`: guía original para elegir el contenido del QR, diseñarlo, probarlo, imprimirlo y escanearlo de forma segura.
- `privacidad.html`: explica el procesamiento local del contenido del QR, los registros técnicos del alojamiento y el estado actual de cookies, analítica y anuncios. Actualízala si cambia cualquiera de esas prácticas.
- `contacto.html`: página de contacto de Angel Henriquez.

La información de privacidad es informativa y no sustituye asesoría jurídica. Revisa los requisitos aplicables en los lugares donde operes y donde se encuentren tus visitantes antes de activar publicidad o herramientas de medición.

## Espacio publicitario

La página incluye un espacio reservado y etiquetado como publicidad, sin anuncios simulados ni solicitudes de anuncios. Un script publicitario integrado en esta página podría acceder técnicamente al contenido del formulario. Antes de añadir una red, diseña y prueba un aislamiento que impida ese acceso; no basta con poner el anuncio en un contenedor separado. Actualiza la política para explicar los datos técnicos que la red sí pueda recopilar y configura el consentimiento requerido. Cuando una red apruebe el sitio y proporcione su código y los identificadores del bloque, integra su código oficial solo después de comprobar el aislamiento. Conserva la etiqueta visible de publicidad, mantén el anuncio separado del botón de descarga y no uses identificadores de prueba en producción ni solicites anuncios para probar clics.
