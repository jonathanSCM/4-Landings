# Landing ProShop · Software para fábricas

Página estática (HTML/CSS/JS) en `site/`, servida con nginx. Ruta prevista: `/software-fabricas`.
Textos exactos de "Contenidos de conversión" v1.0, sección 2 (anuncio AD 2 de verticales).

## Cómo funciona el formulario
No hay CRM: el formulario valida los datos y abre WhatsApp con el mensaje ya armado
(nombre, empresa, actividad, necesidad, origen de campaña y una referencia).

## Despliegue en Coolify
Build Pack: Dockerfile · Puerto: 8080 · Health check: `/healthz`.
Dominio: `landing_fabricas.proshop.lat` (ojo: con guion bajo puede fallar el certificado HTTPS).

## Antes de publicar (en `site/index.html`, objeto `CONFIG`)
- `whatsapp`: confirmar +51 900 534 161.
- `gtmId`: ID del contenedor de GTM.
- Confirmar `https://proshop.lat/privacidad` y la autorización del caso Santa Isabel.

## Editar textos
Todo el contenido está en `site/index.html` (mismo diseño que landing-mineria).

## Prueba local
```bash
docker build -t landing-fabrica .
docker run --rm -p 8080:8080 landing-fabrica
```
o sin Docker: `python -m http.server 8090 --directory site`
