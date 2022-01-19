
import React from "react";

// Component for word field
function AnswerField(props) {

    // Update input in state
    var handleChange = function handleChange(event) {
        return props.onChange(event.target.value);
    };

    return React.createElement("div", null);
}

export default AnswerField;