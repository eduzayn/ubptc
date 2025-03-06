// Script para corrigir o erro de Button não definido
if (typeof window !== "undefined" && !window.Button) {
  // Criar um componente Button básico se não existir
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
}
