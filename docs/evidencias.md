# Verificaciones Técnicas del Sistema

## API desplegada

La API está publicada en Cloudflare Workers y dispone de endpoints para verificar la disponibilidad y consultar el inventario.

| Verificación | URL | Código esperado |
|---|---|---|
| Disponibilidad | https://sistema-inventario-cloud.fornaiyam24.workers.dev/health | 200 |
| Inventario | https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos | 200 |
| Producto existente | https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos/1 | 200 |
| Producto inexistente | https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos/999 | 404 |
| Ruta raíz | https://sistema-inventario-cloud.fornaiyam24.workers.dev/ | 404 |

Las respuestas HTTP 404 de las dos últimas consultas son comportamientos definidos por la aplicación.

La consulta de un producto inexistente devuelve `Producto no encontrado`.

La ruta raíz devuelve `Ruta no encontrada`.

## Pruebas automatizadas

Archivo: `tests/index.test.js`

Se implementaron seis pruebas mediante Vitest.

Las verificaciones incluyen respuestas exitosas, consultas de productos y tratamiento de solicitudes inválidas.

## Integración continua

Archivo: `.github/workflows/ci.yml`

El pipeline contiene las siguientes verificaciones:

- Instalación de dependencias.
- Pruebas automatizadas.
- Formato Terraform.
- Validación Terraform.
- Análisis de secretos con Gitleaks.

El historial de ejecución se conserva en GitHub Actions.

## Infraestructura como código

Directorio: `terraform/`

La configuración declara el Worker, su versión y el despliegue.

Los archivos de variables permiten separar parámetros de configuración y recursos.

## Monitoreo

Archivo: `.github/workflows/monitoreo.yml`

Frecuencia configurada: cada 15 minutos.

El workflow consulta `/health` y `/productos`, verifica las respuestas HTTP y comprueba el contenido JSON esperado.

## Observabilidad

Cloudflare Workers Observability permite analizar solicitudes, códigos HTTP, rutas y registros de ejecución.

Las respuestas HTTP 404 esperadas pueden aparecer en las métricas del servicio sin representar necesariamente una falla operativa.

## Seguridad

El pipeline utiliza permisos mínimos de lectura y evita conservar credenciales del checkout.

Gitleaks analiza posibles secretos.

El archivo `.gitignore` excluye archivos sensibles y artefactos locales.

Terraform utiliza autenticación mediante variable de entorno.

## Alcance

Las pruebas automatizadas verifican la lógica funcional.

Las comprobaciones programadas verifican disponibilidad durante cada ejecución.

La observabilidad proporciona registros y métricas operacionales.

Estos mecanismos ofrecen diferentes niveles de validación y seguimiento del servicio.
