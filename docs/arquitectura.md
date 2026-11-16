# Arquitectura del Sistema de Inventario Cloud

## Descripción general

El sistema implementa una API HTTP de consulta de inventario mediante una arquitectura serverless basada en Cloudflare Workers.

El servicio procesa solicitudes HTTPS y devuelve información de productos en formato JSON.

Los datos se mantienen en memoria dentro del código JavaScript.

## Componentes

### Cloudflare Workers

Ejecuta la lógica del servicio, identifica las rutas solicitadas y genera las respuestas HTTP.

### Inventario en memoria

El inventario contiene tres productos con identificador, nombre, stock y estado de disponibilidad.

No se utiliza una base de datos externa.

### Terraform

Administra los recursos `cloudflare_worker`, `cloudflare_worker_version` y `cloudflare_workers_deployment`.

La configuración incluye observabilidad, publicación del Worker y despliegue de su versión.

### GitHub Actions

El workflow de integración continua automatiza pruebas, validación Terraform y análisis de secretos.

El workflow de monitoreo comprueba periódicamente la disponibilidad del servicio.

### Workers Observability

Proporciona métricas y registros para analizar las solicitudes y ejecuciones del Worker.

## Flujo de solicitudes

1. El cliente envía una solicitud HTTPS.
2. Cloudflare Workers recibe la petición.
3. El servicio comprueba que el método sea GET.
4. Se identifica la ruta solicitada.
5. Se consulta el inventario en memoria cuando corresponde.
6. Se genera una respuesta JSON con el código HTTP adecuado.

## Tratamiento de rutas

| Solicitud | Resultado |
|---|---|
| GET `/health` | HTTP 200, estado OK |
| GET `/productos` | HTTP 200, listado |
| GET `/productos/1` | HTTP 200, producto |
| GET `/productos/999` | HTTP 404, producto no encontrado |
| GET `/` | HTTP 404, ruta no encontrada |
| POST `/productos` | HTTP 405, método no permitido |

Los errores HTTP 404 forman parte del comportamiento definido para consultas que no encuentran un recurso.

## Automatización

GitHub Actions ejecuta las validaciones de integración continua.

Terraform permite administrar la infraestructura de forma declarativa.

El despliegue mediante Terraform se realiza independientemente del pipeline de validación.

## Monitoreo

Workers Observability registra información operacional del servicio.

GitHub Actions ejecuta comprobaciones programadas sobre `/health` y `/productos` cada 15 minutos.

La combinación de registros y comprobaciones permite analizar el comportamiento de la API e identificar fallos de disponibilidad.

## Consideraciones de diseño

La arquitectura serverless evita administrar servidores propios.

El uso de datos en memoria reduce la complejidad de implementación, aunque limita la persistencia y actualización del inventario.

La separación entre código, infraestructura, pruebas y automatización facilita el mantenimiento y el control de cambios.
