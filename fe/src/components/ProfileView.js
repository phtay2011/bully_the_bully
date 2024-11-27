// components/ProfileView.js
import React, { useState, useEffect } from "react";
import "./ProfileView.css"; // Add this line
import * as api from "../api";

function ProfileView({ profileId, onAddInformation, onUpvote, onRate }) {
  const [newInfo, setNewInfo] = useState("");
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [localInformation, setLocalInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileAndInformation = async () => {
      setIsLoading(true);
      try {
        const profileData = await api.getProfiles(profileId);
        setProfile(profileData[0]);
        const information = await api.getInformation(profileId);
        setLocalInformation(information);
      } catch (error) {
        console.error("Error loading profile or information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndInformation();
  }, [profileId]);

  // const loadInformation = async () => {
  //   console.log("Loading information for profile ID:", profile.id);
  //   setIsLoading(true);
  //   try {
  //     const information = await api.getInformation(profile.id);
  //     console.log("Received information:", information);
  //     setLocalInformation(information);
  //   } catch (error) {
  //     console.error("Error loading information:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newInfo.trim().length < 3) {
      alert("Please enter a fact with at least 3 characters.");
      return;
    }
    if (newInfo.trim()) {
      try {
        const addedInfo = await onAddInformation(profile.id, newInfo);
        setLocalInformation((prevInfo) => [...prevInfo, addedInfo]);
        setNewInfo("");
      } catch (error) {
        console.error("Error adding information:", error);
      }
    }
  };

  const handleLocalUpvote = async (infoId) => {
    if (isUpvoting) return;
    setIsUpvoting(true);
    try {
      const updatedInfo = await onUpvote(profile.id, infoId);
      setLocalInformation((prevInfo) =>
        prevInfo.map((info) =>
          info.id === updatedInfo.id ? updatedInfo : info
        )
      );
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setIsUpvoting(false);
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
        {profile.user_username}
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
        <button className="btn" type="submit">
          Pour it out
        </button>
      </form>
    </div>
  );
}

export default ProfileView;
