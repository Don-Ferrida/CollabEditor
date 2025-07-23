import React from "react";

const FloatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        borderRadius: "50%",
        width: "56px",
        height: "56px",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "24px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      +
    </button>
  );
};

export default FloatButton;
