# Implementación Técnica del Sistema de Inventario Cloud

## Descripción de la solución

Se implementó una API de consulta de inventario utilizando JavaScript y Cloudflare Workers.

El servicio permite verificar su disponibilidad, consultar productos y obtener información mediante identificadores.

Las respuestas utilizan JSON y códigos de estado HTTP.

## Funcionalidades implementadas

El sistema incorpora tres endpoints principales:

- `/health`: verificación de disponibilidad.
- `/productos`: consulta del inventario.
- `/productos/{id}`: consulta individual.

También contempla el tratamiento de solicitudes no válidas.

Un producto inexistente devuelve HTTP 404 con el mensaje `Producto no encontrado`.

Una ruta no implementada, incluida `/`, devuelve HTTP 404 con el mensaje `Ruta no encontrada`.

Los métodos distintos de GET se rechazan mediante HTTP 405.

## Infraestructura

La infraestructura se administra mediante Terraform y el proveedor de Cloudflare.

La configuración define el Worker, la versión de código y el despliegue.

También habilita observabilidad y registros de invocación.

El servicio se publica mediante el subdominio `workers.dev`.

## Pruebas automatizadas

Se implementaron seis pruebas funcionales con Vitest.

Estas verifican la disponibilidad, las consultas de productos y el tratamiento de errores HTTP.

La ejecución local de la suite finalizó con seis pruebas aprobadas.

Las mismas pruebas forman parte del pipeline de integración continua.

## Integración continua

GitHub Actions automatiza la instalación de dependencias, ejecución de pruebas, comprobación de formato Terraform, validación de infraestructura y análisis de secretos.

El pipeline se ejecuta ante cambios en `main` y pull requests dirigidos a esa rama.

El despliegue de infraestructura se administra por separado.

## Monitoreo y trazabilidad

Cloudflare Workers Observability permite analizar métricas, rutas, códigos HTTP y registros de ejecución.

El monitoreo programado mediante GitHub Actions verifica los endpoints `/health` y `/productos`.

Los registros y el historial de workflows complementan la trazabilidad del sistema.

## Seguridad

La implementación utiliza permisos de lectura para GitHub Actions, checkout sin persistencia de credenciales y análisis de secretos mediante Gitleaks.

Las credenciales de Cloudflare se gestionan mediante una variable de entorno.

Los archivos locales sensibles y los estados Terraform se excluyen del repositorio.

También se incorporan restricciones de métodos HTTP y controles de configuración de observabilidad.

## Limitaciones

El sistema utiliza datos estáticos y no dispone de persistencia.

No incorpora interfaz gráfica, autenticación ni operaciones de escritura.

El monitoreo programado no reemplaza un sistema de alertas instantáneas.

## Mejoras futuras

La solución podría ampliarse mediante persistencia de datos, autenticación, pruebas de integración adicionales y notificaciones automáticas ante fallos.

## Resultado

La implementación integra una API serverless con infraestructura como código, pruebas automatizadas, integración continua, monitoreo y controles de seguridad.

La organización del repositorio permite mantener separados el código de aplicación, la infraestructura, las pruebas y la documentación.
