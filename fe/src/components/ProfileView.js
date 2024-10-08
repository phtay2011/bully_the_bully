// components/ProfileView.js
import React, { useState, useEffect } from "react";
import "./ProfileView.css"; // Add this line
import * as api from "../api";

function ProfileView({ profile, onAddInformation, onUpvote, onRate }) {
  const [newInfo, setNewInfo] = useState("");
  const [localInformation, setLocalInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);

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
    if (newInfo.trim().length < 3) {
      alert("Please enter a fact with at least 3 characters.");
      return;
    }
    if (newInfo.trim()) {
      try {
        console.log("Adding new info:", newInfo);
        const newInfoObject = await api.addInformation(
          profile.id,
          newInfo,
          profile.createdBy
        );
        console.log("Adding new info:", newInfo);
        setLocalInformation([...localInformation, newInfoObject]);
        console.log("Updated localInformation:", [
          ...localInformation,
          newInfoObject,
        ]);
        onAddInformation(profile.name, newInfo);
        setNewInfo("");
      } catch (error) {
        console.error("Error adding information:", error);
      }
    }
  };

  const handleLocalUpvote = async (id) => {
    console.log("Upvote clicked for id:", id);
    if (isUpvoting) return; // Prevent multiple rapid clicks
    setIsUpvoting(true);
    try {
      // Call onUpvote and wait for it to complete
      const updatedInfo = await onUpvote(profile.name, id);
      console.log("Received updated info:", updatedInfo);

      // Update local state with the result from onUpvote
      setLocalInformation((prevInfo) =>
        prevInfo.map((info) =>
          info.id === updatedInfo.id ? updatedInfo : info
        )
      );
    } catch (error) {
      console.error("Error upvoting information:", error);
    } finally {
      // Use setTimeout to allow a short delay before enabling the button again
      setTimeout(() => setIsUpvoting(false), 500); // 500ms delay
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
        {profile.username}
      </p>
      {renderImage()}

      <h3>Tea spills:</h3>
      <ul>
        {localInformation.map((info) => (
          // <li key={index}>
          //   {info.text} (Upvotes: {info.upvotes})
          //   <button onClick={() => handleLocalUpvote(index)}>👍</button>
          // </li>
          <li key={info.id} className="cool-fact-item">
            <span className="cool-fact-text">{info.content}</span>
            <div className="upvote-container">
              <span className="upvote-count">{info.upvotes}</span>
              <button
                onClick={() => handleLocalUpvote(info.id)}
                className="upvote-button"
                aria-label="Upvote"
                disabled={isUpvoting}
              >
                {isUpvoting ? "◌" : "👍"}
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
          placeholder="Tea kettle's whistling - time to pour"
        />
        <button class="btn" type="submit">
          Pour it out
        </button>
      </form>
    </div>
  );
}

export default ProfileView;
