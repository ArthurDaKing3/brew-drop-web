import { createRoot } from "react-dom/client";

/**
 * Muestra un SweetAlert2 con un componente React dentro.
 * @param {JSX.Element} component - El componente React que quieres mostrar.
 * @param {object} options - Opciones de SweetAlert2 (sin html).
 * @param {function} callbackFunction - Función a ejecutar al confirmar el modal.
 */
export async function showSwalWithComponent(component, options = {}, callbackFunction = () => {}) {

  let root;
  const container = document.createElement("div");

  const swalResponse = await
  Swal.fire({
    ...options,
    html: container, // nuestro contenedor React
    didOpen: () => {
      root = createRoot(container);
      root.render(component);
    },
    willClose: () => {
      if (root) {
        setTimeout(() => {
          root.unmount();
        }, 0);
      }
      // root.unmount();
    },
  });

  if(swalResponse.isConfirmed) {
    callbackFunction();
  }
}
