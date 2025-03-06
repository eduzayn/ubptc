// Este arquivo é um polyfill para o componente Button
// Ele será carregado globalmente para garantir que o Button esteja disponível

// Verificar se estamos no navegador
if (typeof window !== "undefined") {
  // Verificar se o React está disponível
  if (typeof React === "undefined") {
    console.error(
      "React não está disponível. O polyfill do Button pode não funcionar corretamente.",
    );
  } else {
    // Definir o componente Button no objeto global window
    window.Button = function Button(props) {
      return React.createElement(
        "button",
        {
          className:
            props.className ||
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
          onClick: props.onClick,
          type: props.type || "button",
          disabled: props.disabled,
        },
        props.children,
      );
    };
    console.log("Button polyfill carregado com sucesso");
  }
}
