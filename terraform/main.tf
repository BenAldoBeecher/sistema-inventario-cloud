
# Configuración general de Terraform y proveedor de Cloudflare
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.29.0"
    }
  }
}

# El token se obtiene desde la variable de entorno
# CLOUDFLARE_API_TOKEN.
provider "cloudflare" {}

# Recurso principal: Worker de consulta de inventario.
resource "cloudflare_worker" "api_inventario" {
  account_id = var.account_id
  name       = var.nombre_worker

  # Habilita la observabilidad y el registro de invocaciones.
  observability = {
    enabled            = true
    head_sampling_rate = 1

    logs = {
      enabled            = true
      head_sampling_rate = 1
      invocation_logs    = true
    }
  }

  # Habilita el acceso mediante el subdominio workers.dev.
  subdomain = {
    enabled          = true
    previews_enabled = false
  }

  tags = [
    "evaluacion-devops",
    "inventario",
    "api"
  ]
}

# Crea una versión del Worker a partir del código JavaScript.
resource "cloudflare_worker_version" "version_inicial" {
  account_id = var.account_id
  worker_id  = cloudflare_worker.api_inventario.id

  compatibility_date = var.fecha_compatibilidad
  main_module        = "index.js"

  modules = [
    {
      name         = "index.js"
      content_type = "application/javascript+module"
      content_file = "${path.module}/../src/index.js"
    }
  ]
}

# Publica la versión y dirige el 100 % del tráfico hacia ella.
resource "cloudflare_workers_deployment" "despliegue" {
  account_id  = var.account_id
  script_name = cloudflare_worker.api_inventario.name
  strategy    = "percentage"

  versions = [
    {
      version_id = cloudflare_worker_version.version_inicial.id
      percentage = 100
    }
  ]

  annotations = {
    workers_message = "Despliegue inicial de la API de inventario"
  }
}
