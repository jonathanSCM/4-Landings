# Landing ProShop · Software para minería

Página estática (HTML/CSS/JS) en `site/`, servida con nginx.

## Despliegue en Coolify
1. Sube este repositorio a GitHub.
2. En Coolify: **New Resource → Public/Private Repository → Build Pack: Dockerfile**.
3. Puerto expuesto: **8080**. Dominio: el que corresponda (la ruta `/software-mineria` también sirve la página).
4. Health check: `/healthz`.

## Antes de publicar (en `site/index.html`, objeto `CONFIG`)
- `whatsapp`: +51 900 534 161 (número comercial oficial).
- Formulario: sin CRM, abre WhatsApp con el mensaje armado (nombre, empresa, actividad, necesidad, origen y referencia).
- Confirmar `https://proshop.lat/privacidad`.

## Prueba local
```bash
docker build -t landing-mineria .
docker run --rm -p 8080:8080 landing-mineria
```
