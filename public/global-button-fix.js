window.Button = function (props) {
  return React.createElement(
    "button",
    {
      className:
        props?.className ||
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
      onClick: props?.onClick,
      type: props?.type || "button",
      disabled: props?.disabled,
    },
    props?.children,
  );
};

console.log("Button global definido com sucesso!");
