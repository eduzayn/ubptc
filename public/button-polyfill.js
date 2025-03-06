// Polyfill para o componente Button
(function () {
  if (typeof window !== "undefined" && !window.Button) {
    console.log("Adicionando polyfill para Button");
    window.Button = function Button(props) {
      return React.createElement(
        "button",
        {
          className:
            props?.className ||
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
          onClick: props?.onClick,
          type: props?.type || "button",
          disabled: props?.disabled,
        },
        props?.children,
      );
    };
    console.log("Button polyfill carregado com sucesso");
  }
})();
