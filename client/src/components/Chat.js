import { Card, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function Chat(props) {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    props.socket.on("chat message", (message) => {
      receiveChatMessage(message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const sendChatMessage = (event) => {
    event.preventDefault();
    if (message) {
      props.socket.emit("chat message", {
        gameID: props.gameID,
        username: props.user.username,
        content: message,
      });
      setMessage("");
    }
  };

  const receiveChatMessage = (message) => {
    setChatMessages((originalMessages) => [...originalMessages, message]);
  };

  return (
    <Card>
      <Card.Header>Chat</Card.Header>
      <Card.Body>
        {chatMessages.map((message) => (
          <Card.Text>
            {message.username}:{" "}
            <div className="normal-text">{message.content}</div>
          </Card.Text>
        ))}
        <Form onChange={handleChange} onSubmit={sendChatMessage}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Send a message"
              value={message}
            ></Form.Control>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
