# Landing ProShop · Software a medida

Página estática (HTML/CSS/JS) en `site/`, servida con nginx. Ruta prevista: `/software-a-medida`.
Textos exactos de "Contenidos de conversión" v1.0, sección 1 (anuncios a decisores 1–3).

## Cómo funciona el formulario
No hay CRM: el formulario valida los datos y abre WhatsApp con el mensaje ya armado
(nombre, empresa, actividad, necesidad, origen de campaña y una referencia).

## Despliegue en Coolify
Build Pack: Dockerfile · Puerto: 8080 · Health check: `/healthz`.
Dominio: `landing-software.proshop.lat`.

## Antes de publicar (en `site/index.html`, objeto `CONFIG`)
- `whatsapp`: +51 900 534 161 (número comercial oficial).
- `gtmId`: ID del contenedor de GTM.
- Confirmar `https://proshop.lat/privacidad` y la autorización del proyectos del portafolio (NOX, Santa Isabel, INMOL, etc.).

## Editar textos
Todo el contenido está en `site/index.html` (misma base que las otras landings).

## Prueba local
```bash
docker build -t landing-software-a-medida .
docker run --rm -p 8080:8080 landing-software-a-medida
```
o sin Docker: `python -m http.server 8097 --directory site`
