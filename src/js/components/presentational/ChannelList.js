import React from "react";
import PropTypes from "prop-types";
import CloseButton from "./CloseButton";
const ChannelList = ({ channels, delete_channel }) => (
    <ul className="list-group">
        {channels.map((ch) => <li className="list-group-item" key={ch}>#{ch} <CloseButton id={"close_chan_" + ch} on_click={delete_channel} /></li>)}
    </ul>
);
export default ChannelList;