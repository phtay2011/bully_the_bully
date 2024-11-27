// components/ProfileView.js
import React, { useState, useEffect } from "react";
import "./ProfileView.css";
import * as api from "../api";

function ProfileView({ profile, onAddInformation, onUpvote, onRate }) {
  const [newInfo, setNewInfo] = useState("");
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [localInformation, setLocalInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInformation = async () => {
      if (!profile || !profile.id) {
        setIsLoading(false);
        return;
      }
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

    loadInformation();
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.id) return;
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
    if (isUpvoting || !profile || !profile.id) return;
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

  const renderImage = () => {
    if (!profile || !profile.image) return null;

    return (
      <img
        src={profile.image}
        alt={profile.name}
        style={{ maxWidth: "200px" }}
      />
    );
  };

  if (isLoading) {
    return <div>Loading profile information...</div>;
  }

  if (!profile) {
    return <div>No profile data available.</div>;
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
        {localInformation && localInformation.length > 0 ? (
          localInformation.map((info) =>
            info && info.content ? (
              <li key={info.id} className="cool-fact-item">
                <span className="cool-fact-text">{info.content}</span>
                <div className="upvote-container">
                  <span className="upvote-count">{info.upvotes || 0}</span>
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
            ) : null
          )
        ) : (
          <li>No tea spills yet!</li>
        )}
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
