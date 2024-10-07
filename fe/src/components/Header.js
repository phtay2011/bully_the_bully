import React from "react";

function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <h1>🍵 Spill the Tea 🍵</h1>
      {user && (
        <div className="user-info">
          <p>Welcome, {user.username}!</p>
          <p>Phone Number: {user.phoneNumber}</p>
          <button className="btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
