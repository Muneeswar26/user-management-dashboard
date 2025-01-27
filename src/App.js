import axios from "axios";
import React, { useEffect, useState } from "react";
import UserForm from "./components/UserForm/UserForm";
import UserList from "./components/UserList/UserList";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (user) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", user);
      setUsers([...users, { ...user, id: response.data.id }]);
    } catch {
      setError("Failed to add user.");
    }
  };

  const updateUser = async (user) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user);
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } catch {
      setError("Failed to update user.");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="app">
      <h1>User Management Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <UserList users={users} onEdit={setSelectedUser} onDelete={deleteUser} />
      <UserForm
        selectedUser={selectedUser}
        onSave={(user) => {
          selectedUser ? updateUser(user) : addUser(user);
          setSelectedUser(null);
        }}
        onCancel={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default App;
