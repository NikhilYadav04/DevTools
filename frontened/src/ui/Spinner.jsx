import React from "react";

const Spinner = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 50,
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            animation: "spin 1s linear infinite",
            borderRadius: "50%",
            height: "80px",
            width: "80px",
            border: "10px solid rgba(128, 90, 213, 0.25)",
          }}
        ></div>
        <div
          style={{
            animation: "spin 1s linear infinite",
            borderRadius: "50%",
            height: "80px",
            width: "80px",
            border: "10px solid transparent",
            borderTopColor: "rgb(128, 90, 213)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Spinner;
