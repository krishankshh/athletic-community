import { useState } from "react";

export default function AdminTest() {
  // Change this to your actual Codespace server URL
  const SERVER_URL = "https://crispy-pancake-9w9rw55xgqgh9vvx-5000.app.github.dev";

  const [adminToken, setAdminToken] = useState("");
  const [response, setResponse] = useState("");

  // For updating roles
  const [updateData, setUpdateData] = useState({
    userId: "",
    newRole: "Member", // default
  });

  // Handle input changes for userId/newRole
  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  // Fetch all users
  const getAllUsers = async () => {
    setResponse("Loading...");
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`, // Must be Admin token
        },
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: Could not connect to server.");
    }
  };

  // Update role
  const updateRole = async () => {
    setResponse("Loading...");
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/update-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
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
      <h2>Admin Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Admin JWT Token:</strong>
        </label>
        <br />
        <input
          type="text"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

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
