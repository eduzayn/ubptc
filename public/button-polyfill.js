// Polyfill para o componente Button
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    if (!window.Button) {
      console.log("Adicionando polyfill para Button");
      // Importar o Button do React se disponível
      try {
        const React = window.React;
        window.Button = function Button(props) {
          return React.createElement(
            "button",
            {
              className:
                props.className ||
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
              onClick: props.onClick,
              type: props.type || "button",
              disabled: props.disabled,
            },
            props.children,
          );
        };
      } catch (e) {
        console.error("Erro ao criar polyfill para Button:", e);
      }
    }
  });
}
