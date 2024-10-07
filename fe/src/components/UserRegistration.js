import React, { useState } from "react";

function UserRegistration({ onRegister }) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, phoneNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setPhoneNumber(value);
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
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          pattern="[0-9]{8,}" // Assumes phone numbers are at least 8 digits
          title="Phone number must be at least 8 digits long"
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
