import { Button as AntButton } from "antd";

const Button = ({
  children,
  size = "medium",
  fullWidth = false,
  onClick,
  disabled = false,
  style = {},
  ...props
}) => {
  const baseStyle = {
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "10px",
    padding: "8px 20px",
    backgroundColor: "#5048E5",
    color: "#fff",
    border: "1px solid #5048E5",
    width: fullWidth ? "100%" : "auto",
    transition: "background-color 0.2s",
  };

  return (
    <AntButton
      size={size}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...style,
      }}
      {...props}
      className="custom-button"
    >
      {children}
    </AntButton>
  );
};

export default Button;
