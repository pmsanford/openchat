import React from "react";
import PropTypes from "prop-types";
const ChannelInput = ({ channel, input_change, on_add, on_key }) => (
    <div className="input-group">
        <input type="text" id="new_chan" className="form-control" onKeyPress={on_key} placeholder="New channel" onChange={input_change} value={channel} />
        <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={on_add}>Add</button>
        </div>
    </div>
);
ChannelInput.propTypes = {
    channel: PropTypes.string,
    on_add: PropTypes.func
};
export default ChannelInput;