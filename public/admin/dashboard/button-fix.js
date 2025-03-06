// Polyfill para o componente Button
if (typeof window !== "undefined") {
  if (!window.Button) {
    console.log("Adicionando polyfill para Button");
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
  }
}
