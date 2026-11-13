
# Identificador de la cuenta de Cloudflare.
variable "account_id" {
  description = "Identificador de la cuenta de Cloudflare"
  type        = string

  validation {
    condition     = can(regex("^[a-f0-9]{32}$", var.account_id))
    error_message = "El identificador debe contener 32 caracteres hexadecimales en minúscula."
  }
}

# Nombre que tendrá el Worker en Cloudflare.
variable "nombre_worker" {
  description = "Nombre del Worker de inventario"
  type        = string
  default     = "sistema-inventario-cloud"
}

# Fecha de compatibilidad del entorno de ejecución.
variable "fecha_compatibilidad" {
  description = "Fecha de compatibilidad de Cloudflare Workers"
  type        = string
  default     = "2026-11-12"
}
