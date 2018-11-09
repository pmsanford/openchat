import React from "react";
const CloseButton = ({ id, on_click }) => (
    <button type="button" className="close" onClick={on_click}>
        <span id={id}>&times;</span>
    </button>
);
export default CloseButton;