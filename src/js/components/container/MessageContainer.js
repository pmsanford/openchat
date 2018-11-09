import React, { Component } from "react";
import ReactDOM from "react-dom";
import ChatMessage from "../presentational/ChatMessage"
import Cryptor from "../../lib";
class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages | [],
      channels: props.channels
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.crypt = new Cryptor();
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  // This isn't the right way to do this...
  static getDerivedStateFromProps(props, state) {
    return { messages: props.messages, channels: props.channels };
  }

  render() {
    var { messages } = this.state;
    var rows = [];
    for (var i = 0; i < messages.length; i++) {
      rows.push(<ChatMessage
        key={messages[i].msg_id}
        username={messages[i].username}
        channel={messages[i].channel}
        messagebody={messages[i].payload}
      />);
    }
    rows.push(<div style={{ float: "left", clear: "both" }} key="-1" ref={(el) => { this.messagesEnd = el; }}></div>);
    return rows;
  }
}
export default MessageContainer;

const wrapper = document.getElementById("chat-messages");
wrapper ? ReactDOM.render(<MessageContainer />, wrapper) : false;