# Sistema de Consulta de Inventario Cloud

API HTTP de consulta de inventario desarrollada en JavaScript y desplegada en Cloudflare Workers. La solución integra infraestructura como código mediante Terraform, pruebas automatizadas con Vitest, integración continua con GitHub Actions y mecanismos de monitoreo y seguridad.

El sistema permite consultar información de productos y verificar la disponibilidad del servicio mediante respuestas JSON.

## Características

- API HTTP ejecutada en Cloudflare Workers.
- Consulta de productos almacenados en memoria.
- Respuestas JSON y manejo de códigos HTTP.
- Infraestructura administrada mediante Terraform.
- Seis pruebas automatizadas con Vitest.
- Integración continua mediante GitHub Actions.
- Monitoreo programado cada 15 minutos.
- Métricas y logs mediante Cloudflare Workers Observability.
- Análisis de secretos mediante Gitleaks.

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| JavaScript | Implementación de la API |
| Cloudflare Workers | Ejecución serverless |
| Terraform | Infraestructura como código |
| GitHub Actions | Integración continua y monitoreo |
| Vitest | Pruebas automatizadas |
| Gitleaks | Detección de secretos |
| Workers Observability | Métricas y registros de ejecución |

## API desplegada

El servicio se encuentra disponible en Cloudflare Workers.

### Verificación de disponibilidad

https://sistema-inventario-cloud.fornaiyam24.workers.dev/health

Respuesta HTTP 200:

```json
{
  "status": "OK"
}
```

### Consulta del inventario

https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos

Respuesta HTTP 200:

```json
[
  {
    "id": 1,
    "nombre": "Teclado",
    "stock": 25,
    "disponible": true
  },
  {
    "id": 2,
    "nombre": "Mouse",
    "stock": 40,
    "disponible": true
  },
  {
    "id": 3,
    "nombre": "Monitor",
    "stock": 0,
    "disponible": false
  }
]
```

### Consulta individual

https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos/1

Respuesta HTTP 200:

```json
{
  "id": 1,
  "nombre": "Teclado",
  "stock": 25,
  "disponible": true
}
```

### Producto inexistente

https://sistema-inventario-cloud.fornaiyam24.workers.dev/productos/999

Respuesta HTTP 404:

```json
{
  "error": "Producto no encontrado"
}
```

Esta respuesta indica que el identificador solicitado no corresponde a un producto registrado.

### Ruta no implementada

La dirección base `https://sistema-inventario-cloud.fornaiyam24.workers.dev/` devuelve HTTP 404:

```json
{
  "error": "Ruta no encontrada"
}
```

La ruta raíz no implementa una página web. El servicio funciona mediante endpoints HTTP específicos.

### Métodos no permitidos

La API admite solicitudes GET. Otros métodos, como POST, reciben HTTP 405:

```json
{
  "error": "Método no permitido"
}
```

## Arquitectura

La solución utiliza una arquitectura serverless. Cloudflare Workers recibe las solicitudes HTTPS, procesa las rutas y devuelve las respuestas JSON correspondientes.

Los productos están definidos en un arreglo de JavaScript dentro de `src/index.js`.

La infraestructura se administra mediante Terraform y las validaciones automatizadas se ejecutan mediante GitHub Actions.

La arquitectura detallada se encuentra en [docs/arquitectura.md](docs/arquitectura.md).

## Estructura del proyecto

```text
sistema-inventario-cloud/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── monitoreo.yml
├── docs/
│   ├── arquitectura.md
│   ├── evidencias.md
│   └── informe.md
├── src/
│   └── index.js
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── tests/
│   └── index.test.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Pruebas automatizadas

Las pruebas están implementadas con Vitest en `tests/index.test.js`.

| Caso | Validación |
|---|---|
| TEST-01 | HTTP 200 en `/health` |
| TEST-02 | Listado de productos |
| TEST-03 | Consulta de producto existente |
| TEST-04 | HTTP 404 para producto inexistente |
| TEST-05 | HTTP 405 para método POST |
| TEST-06 | HTTP 404 para ruta desconocida |

Instalación de dependencias:

```bash
npm ci
```

Ejecución de pruebas:

```bash
npm test
```

La suite contiene seis pruebas funcionales.

## Infraestructura como código

Terraform administra la creación y configuración del Worker, la versión del código y el despliegue.

La configuración se encuentra en `terraform/` y utiliza el proveedor de Cloudflare.

La autenticación se realiza mediante la variable de entorno `CLOUDFLARE_API_TOKEN`, sin incorporar el token en los archivos versionados.

El pipeline valida el formato y la configuración Terraform. La aplicación de cambios de infraestructura se realiza por separado desde un entorno autorizado.

## Integración continua

El workflow `.github/workflows/ci.yml` se ejecuta ante cambios en `main` y pull requests dirigidos a esa rama.

Incluye instalación de dependencias, pruebas automatizadas, validación Terraform y análisis de secretos mediante Gitleaks.

## Monitoreo y observabilidad

Cloudflare Workers Observability permite consultar métricas, solicitudes y registros de ejecución.

La configuración habilita logs de invocación y una tasa de muestreo del 100%.

El workflow `.github/workflows/monitoreo.yml` realiza verificaciones programadas cada 15 minutos sobre `/health` y `/productos`.

Las comprobaciones periódicas permiten detectar fallos durante sus ejecuciones, aunque no equivalen a alertas instantáneas.

## Seguridad

Los controles implementados incluyen:

- Permisos mínimos de lectura para GitHub Actions.
- Checkout sin persistencia de credenciales.
- Análisis de secretos con Gitleaks.
- Exclusión de archivos locales sensibles.
- Autenticación mediante variable de entorno.
- Redacción de parámetros de consulta en logs.
- Desactivación de URLs de vista previa.
- Restricción de métodos HTTP.
- Respuestas con `Cache-Control: no-store`.

## Limitaciones

El inventario utiliza datos estáticos en memoria. No dispone de base de datos, autenticación, interfaz gráfica ni operaciones de modificación de productos.

El monitoreo programado complementa las métricas y logs, pero no constituye un sistema completo de alertas en tiempo real.

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Implementación técnica](docs/informe.md)
- [Verificaciones técnicas](docs/evidencias.md)
