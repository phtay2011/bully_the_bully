// App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UserRegistration from "./components/UserRegistration";
import ProfileCreation from "./components/ProfileCreation";
import ProfileView from "./components/ProfileView";
import CategoryFilter from "./components/CategoryFilter";
import "./styles/global.css";

const IDOL_CATEGORIES = {
  ALL: "All",
  AJC: "Anglo-Chinese Junior College",
  CJC: "Catholic Junior College",
  DHJC: "Dunman High School (Junior College)",
  RJC: "Raffles Institution (Junior College)",
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const registerUser = (username, email) => {
    setCurrentUser({ username, email });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const rateProfile = (profileName, rating) => {
    setProfiles((prevProfiles) => {
      const profile = prevProfiles[profileName];
      const newRatings = [...profile.ratings, rating];
      const averageRating =
        newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
      return {
        ...prevProfiles,
        [profileName]: {
          ...profile,
          ratings: newRatings,
          averageRating,
        },
      };
    });
  };
  const createProfile = (name, category, image) => {
    if (!profiles[name]) {
      setProfiles((prevProfiles) => ({
        ...prevProfiles,
        [name]: {
          name,
          category,
          image, // This will now be the data URL of the image
          createdBy: currentUser.username,
          information: [],
          ratings: [],
          averageRating: 0,
        },
      }));
    }
  };
  const addInformation = (idolName, content) => {
    setProfiles((prevProfiles) => ({
      ...prevProfiles,
      [idolName]: {
        ...prevProfiles[idolName],
        information: [
          ...prevProfiles[idolName].information,
          { content, addedBy: currentUser.username, upvotes: 0 },
        ],
      },
    }));
  };
  const upvoteInformation = (idolName, infoIndex) => {
    setProfiles((prevProfiles) => ({
      ...prevProfiles,
      [idolName]: {
        ...prevProfiles[idolName],
        information: prevProfiles[idolName].information.map((info, index) =>
          index === infoIndex ? { ...info, upvotes: info.upvotes + 1 } : info
        ),
      },
    }));
  };

  const filteredProfiles = Object.values(profiles).filter(
    (profile) =>
      selectedCategory === "ALL" ||
      profile.category === IDOL_CATEGORIES[selectedCategory]
  );

  return (
    <div className="container">
      <Header user={currentUser} onLogout={logout} />
      {!currentUser ? (
        <UserRegistration onRegister={registerUser} />
      ) : (
        <>
          <div className="card">
            <ProfileCreation
              onCreateProfile={createProfile}
              categories={IDOL_CATEGORIES}
            />
          </div>
          <div className="card">
            <CategoryFilter
              categories={IDOL_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          {filteredProfiles.map((profile) => (
            <div className="card" key={profile.name}>
              <ProfileView
                profile={profile}
                onAddInformation={addInformation}
                onUpvote={upvoteInformation}
                onRate={rateProfile}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
