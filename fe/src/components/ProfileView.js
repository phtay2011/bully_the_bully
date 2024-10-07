// components/ProfileView.js
import React, { useState, useEffect } from "react";
import "./ProfileView.css"; // Add this line
import * as api from "../api";

function ProfileView({ profile, onAddInformation, onUpvote, onRate }) {
  const [newInfo, setNewInfo] = useState("");
  const [localInformation, setLocalInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInformation();
  }, [profile.id]);

  const loadInformation = async () => {
    setIsLoading(true);
    try {
      const information = await api.getInformation(profile.id);
      setLocalInformation(information);
    } catch (error) {
      console.error("Error loading information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newInfo.trim()) {
      try {
        const newInfoObject = await api.addInformation(
          profile.id,
          newInfo,
          profile.createdBy
        );
        setLocalInformation([...localInformation, newInfoObject]);
        onAddInformation(profile.name, newInfo);
        setNewInfo("");
      } catch (error) {
        console.error("Error adding information:", error);
      }
    }
  };

  const handleLocalUpvote = async (id) => {
    try {
      const updatedInfo = await api.upvoteInformation(id);
      setLocalInformation(
        localInformation.map((info) =>
          info.id === updatedInfo.id ? updatedInfo : info
        )
      );
      onUpvote(profile.name, id);
    } catch (error) {
      console.error("Error upvoting information:", error);
    }
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

  if (isLoading) {
    return <div>Loading profile information...</div>;
  }
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
