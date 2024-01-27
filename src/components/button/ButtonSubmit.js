import React from "react";
import "./Button.scss";

export default function ButtonSubmit({ text, className, type, onClick }) {
  return (
    <div className={className}>
      <button className="main-button" type={type} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
