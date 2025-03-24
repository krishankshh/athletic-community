import { useState } from "react";

export default function SessionAdminTest() {
  // Replace with your Codespace server URL
  const SERVER_URL = "https://crispy-pancake-9w9rw55xgqgh9vvx-5000.app.github.dev";
  const [response, setResponse] = useState("");
  const [updateData, setUpdateData] = useState({
    userId: "",
    newRole: "Member",
  });

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`, {
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

  const updateRole = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/update-role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: Could not connect to server.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Admin Test (Session Auth)</h2>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={getAllUsers}>Get All Users</button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Update User Role</h3>
        <label>User ID:</label>
        <br />
        <input
          type="text"
          name="userId"
          value={updateData.userId}
          onChange={handleUpdateChange}
          style={{ width: "300px" }}
        />
        <br />
        <label>New Role:</label>
        <br />
        <select
          name="newRole"
          value={updateData.newRole}
          onChange={handleUpdateChange}
        >
          <option value="Member">Member</option>
          <option value="Verified Trainer">Verified Trainer</option>
          <option value="Verified Dietician">Verified Dietician</option>
          <option value="Admin">Admin</option>
        </select>
        <br />
        <button onClick={updateRole}>Update Role</button>
      </div>
      <pre
        style={{
          marginTop: "20px",
          background: "#f4f4f4",
          padding: "10px",
          textAlign: "left",
          width: "80%",
          margin: "0 auto",
        }}
      >
        {response}
      </pre>
    </div>
  );
}
