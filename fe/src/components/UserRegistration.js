import React, { useState } from "react";

function UserRegistration({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, email);
  };

  return (
    <div className="card">
      <h2>Join the Fun!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //   required
        />
        <button className="btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
