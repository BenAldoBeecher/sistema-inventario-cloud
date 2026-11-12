
import { describe, it, expect } from "vitest";
import worker from "../src/index.js";

describe("API de consulta de inventario", () => {
  it("TEST-01: debe responder HTTP 200 en /health", async () => {
    const request = new Request("http://localhost/health");

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("OK");
  });

  it("TEST-02: debe devolver una lista de productos", async () => {
    const request = new Request("http://localhost/productos");

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    expect(data[0]).toEqual({
      id: 1,
      nombre: "Teclado",
      stock: 25,
      disponible: true,
    });
  });

  it("TEST-03: debe devolver el producto correspondiente a su ID", async () => {
    const request = new Request("http://localhost/productos/1");

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 1,
      nombre: "Teclado",
      stock: 25,
      disponible: true,
    });
  });

  it("TEST-04: debe responder HTTP 404 si el producto no existe", async () => {
    const request = new Request("http://localhost/productos/999");

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Producto no encontrado");
  });

  it("TEST-05: debe rechazar solicitudes POST", async () => {
    const request = new Request("http://localhost/productos", {
      method: "POST",
    });

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET");
    expect(data.error).toBe("Método no permitido");
  });

  it("TEST-06: debe responder HTTP 404 ante una ruta desconocida", async () => {
    const request = new Request("http://localhost/ruta-inexistente");

    const response = await worker.fetch(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Ruta no encontrada");
  });
});
