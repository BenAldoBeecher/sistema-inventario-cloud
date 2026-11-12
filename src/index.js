
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Teclado",
    stock: 25,
    disponible: true,
  },
  {
    id: 2,
    nombre: "Mouse",
    stock: 40,
    disponible: true,
  },
  {
    id: 3,
    nombre: "Monitor",
    stock: 0,
    disponible: false,
  },
];

function respuestaJSON(datos, status = 200, headersAdicionales = {}) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headersAdicionales,
    },
  });
}

const worker = {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return respuestaJSON(
        { error: "Método no permitido" },
        405,
        { Allow: "GET" }
      );
    }

    if (url.pathname === "/health") {
      return respuestaJSON({
        status: "OK",
      });
    }

    if (url.pathname === "/productos") {
      return respuestaJSON(PRODUCTOS);
    }

    const coincidencia = url.pathname.match(/^\/productos\/(\d+)$/);

    if (coincidencia) {
      const id = Number(coincidencia[1]);

      const producto = PRODUCTOS.find(
        (item) => item.id === id
      );

      if (!producto) {
        return respuestaJSON(
          { error: "Producto no encontrado" },
          404
        );
      }

      return respuestaJSON(producto);
    }

    return respuestaJSON(
      { error: "Ruta no encontrada" },
      404
    );
  },
};

export default worker;
