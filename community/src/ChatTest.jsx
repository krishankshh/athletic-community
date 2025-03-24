import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Initialize the global socket using the current domain
const socket = io(window.location.origin, {
  transports: ["polling"],
  upgrade: false,
  allowUpgrades: false,
});

export default function ChatTest() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    console.log("Current origin:", window.location.origin);

    socket.on("connect", () => {
      console.log("Connected to chat server:", socket.id);
    });

    socket.on("chat message", (msg) => {
      console.log("Received chat message:", msg);
      setChat((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });

    // No disconnect in cleanup so that the global socket persists
    return () => {
      // Optionally clean up event listeners
      socket.off("connect");
      socket.off("chat message");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Emitting chat message:", message);
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Chat System Test</h2>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "300px" }}
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: "20px", textAlign: "left", margin: "0 auto", width: "80%" }}>
        <h3>Chat Log:</h3>
        <ul>
          {chat.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
