import React from "react";
import EditableField from "../../EditableField";

export default NewField = ({ preamble, onChange, onError }) => (
    <div>
        {preamble}:
        <EditableField
            active={true}
            val={""}
            validateJSON={true}
            onChange={(val) => {
                try {
                    const obj = JSON.parse(val);
                    onChange(obj);
                } catch (e) {
                    onError();
                }
            }}
        />
    </div>
);
