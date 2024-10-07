import React, { useState } from "react";

function UserRegistration({ onRegister }) {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, phoneNumber);
  };

  return (
    <div className="card">
      <h2>🫸 Yeet the Bully</h2>
      <h3>Drop your bully's name and watch it go viral!</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="📛 Drop your name here"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="📱 Slide us your digits (Optional: only if you want to be reached out.)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          pattern="[0-9]{8,}" // Assumes phone numbers are at least 8 digits
          title="Phone number must be at least 8 digits long"
          //   required
        />
        <button className="btn" type="submit">
          Let's Fking GO!
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
