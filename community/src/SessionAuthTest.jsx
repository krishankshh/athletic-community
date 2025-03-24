import { useState } from "react";

export default function SessionAuthTest() {
  // Replace with your Codespace server URL
  const SERVER_URL = "https://crispy-pancake-9w9rw55xgqgh9vvx-5000.app.github.dev";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [response, setResponse] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? `${SERVER_URL}/api/auth/login`
      : `${SERVER_URL}/api/auth/signup`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies for session
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: Could not connect to server.");
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: Could not connect to server.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: Could not connect to server.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>{isLogin ? "Login" : "Signup"} Test (Session Auth)</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        {!isLogin && (
          <>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <br />
          </>
        )}
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <br />
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <br />
        {!isLogin && (
          <>
            <label>Invite Code:</label>
            <input type="text" name="inviteCode" value={formData.inviteCode} onChange={handleChange} required />
            <br />
          </>
        )}
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <br />
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? "Signup" : "Login"}
      </button>
      <br />
      <button onClick={getCurrentUser}>Get Current User</button>
      <br />
      <button onClick={handleLogout}>Logout</button>
      <pre style={{ marginTop: "20px", background: "#f4f4f4", padding: "10px" }}>
        {response}
      </pre>
    </div>
  );
}
