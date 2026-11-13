
# Nombre del Worker creado.
output "nombre_worker" {
  description = "Nombre del Worker desplegado"
  value       = cloudflare_worker.api_inventario.name
}

# Dirección pública del Worker.
output "url_api" {
  description = "URL pública de la API de inventario"
  value       = cloudflare_worker.api_inventario.subdomain.url
}
