import React from "react";
import PropTypes from "prop-types";
const ChatInput = ({ message, username, channel_key, channels, input_change, handle_send, handle_key }) => (
    <div className="input-group">
        <input type="text" id="username" className="form-control" placeholder="Username" value={username} onChange={input_change} />
        <input type="text" id="message" className="form-control w-50" placeholder="Message" onKeyPress={handle_key} value={message} onChange={input_change} />
        <select className="form-control" id="chkey" value={channel_key} onChange={input_change}>
            {channels.map((ch) => <option key={ch} value={ch}>#{ch}</option>)}
        </select>
        <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={handle_send}>Send</button>
        </div>
    </div>
);
ChatInput.propTypes = {
    message: PropTypes.string,
    channel_key: PropTypes.string,
    handle_send: PropTypes.func
};
export default ChatInput;