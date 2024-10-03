// components/ProfileView.js
import React, { useState } from "react";
import "./ProfileView.css"; // Add this line

function ProfileView({ profile, onAddInformation, onUpvote, onRate }) {
  const [newInfo, setNewInfo] = useState("");
  const [localInformation, setLocalInformation] = useState(
    profile.information || []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newInfo.trim()) {
      const newInfoObject = { text: newInfo, upvotes: 0 };
      setLocalInformation([...localInformation, newInfoObject]);
      onAddInformation(profile.name, newInfo);
      setNewInfo("");
    }
  };

  const handleLocalUpvote = (index) => {
    const updatedInformation = [...localInformation];
    updatedInformation[index].upvotes += 1;
    setLocalInformation(updatedInformation);
    onUpvote(profile.name, index);
  };

  // Function to determine if the image is a base64 string
  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  // Render the image based on whether it's a URL or base64 string
  const renderImage = () => {
    if (!profile.image) return null;

    if (isBase64(profile.image)) {
      return (
        <img
          src={`data:image/jpeg;base64,${profile.image}`}
          alt={profile.name}
          style={{ maxWidth: "200px" }}
        />
      );
    } else {
      return (
        <img
          src={profile.image}
          alt={profile.name}
          style={{ maxWidth: "200px" }}
        />
      );
    }
  };

  return (
    <div className="profile-view">
      <h2>{profile.name}</h2>
      <p>
        <strong>Category: </strong>
        {profile.category}
      </p>
      <p>
        <strong>Created by: </strong>
        {profile.createdBy}
      </p>
      {renderImage()}

      <h3>Cool Facts:</h3>
      <ul>
        {localInformation.map((info, index) => (
          // <li key={index}>
          //   {info.text} (Upvotes: {info.upvotes})
          //   <button onClick={() => handleLocalUpvote(index)}>👍</button>
          // </li>
          <li key={index} className="cool-fact-item">
            <span className="cool-fact-text">{info.text}</span>
            <div className="upvote-container">
              <span className="upvote-count">{info.upvotes}</span>
              <button
                onClick={() => handleLocalUpvote(index)}
                className="upvote-button"
                aria-label="Upvote"
              >
                👍
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newInfo}
          onChange={(e) => setNewInfo(e.target.value)}
          placeholder="Add a cool fact"
        />
        <button class="btn" type="submit">
          Add Fact
        </button>
      </form>
    </div>
  );
}

export default ProfileView;
