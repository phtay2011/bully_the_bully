// App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UserRegistration from "./components/UserRegistration";
import ProfileCreation from "./components/ProfileCreation";
import ProfileView from "./components/ProfileView";
import CategoryFilter from "./components/CategoryFilter";
import "./styles/global.css";
import * as api from "./api";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const profilesData = await api.getProfiles();
      const profilesObject = profilesData.reduce((acc, profile) => {
        acc[profile.name] = profile;
        return acc;
      }, {});
      setProfiles(profilesObject);
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const registerUser = async (username, email) => {
    try {
      const user = await api.registerUser(username, email);
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // const rateProfile = (profileName, rating) => {
  //   setProfiles((prevProfiles) => {
  //     const profile = prevProfiles[profileName];
  //     const newRatings = [...profile.ratings, rating];
  //     const averageRating =
  //       newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
  //     return {
  //       ...prevProfiles,
  //       [profileName]: {
  //         ...profile,
  //         ratings: newRatings,
  //         averageRating,
  //       },
  //     };
  //   });
  // };

  const rateProfile = async (profileName, rating) => {
    try {
      await api.rateProfile(profiles[profileName].id, rating, currentUser.id);
      // You might want to update the local state here as well
    } catch (error) {
      console.error("Error rating profile:", error);
    }
  };
  // const createProfile = (name, category, image) => {
  //   if (!profiles[name]) {
  //     setProfiles((prevProfiles) => ({
  //       ...prevProfiles,
  //       [name]: {
  //         name,
  //         category,
  //         image, // This will now be the data URL of the image
  //         createdBy: currentUser.username,
  //         information: [],
  //         ratings: [],
  //         averageRating: 0,
  //       },
  //     }));
  //   }
  // };

  const createProfile = async (name, category, image) => {
    try {
      const newProfile = await api.createProfile(
        name,
        category,
        image,
        currentUser.id
      );
      setProfiles((prevProfiles) => ({
        ...prevProfiles,
        [name]: newProfile,
      }));
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  // const addInformation = (idolName, content) => {
  //   setProfiles((prevProfiles) => ({
  //     ...prevProfiles,
  //     [idolName]: {
  //       ...prevProfiles[idolName],
  //       information: [
  //         ...prevProfiles[idolName].information,
  //         { content, addedBy: currentUser.username, upvotes: 0 },
  //       ],
  //     },
  //   }));
  // };

  const addInformation = async (idolName, content) => {
    try {
      const newInfo = await api.addInformation(
        profiles[idolName].id,
        content,
        currentUser.id
      );
      setProfiles((prevProfiles) => ({
        ...prevProfiles,
        [idolName]: {
          ...prevProfiles[idolName],
          information: [...(prevProfiles[idolName].information || []), newInfo],
        },
      }));
    } catch (error) {
      console.error("Error adding information:", error);
    }
  };

  const upvoteInformation = async (idolName, infoId) => {
    console.log("Upvoting in App.js for:", idolName, infoId);
    try {
      const updatedInfo = await api.upvoteInformation(infoId);
      console.log("Received updated info in App.js:", updatedInfo);
      setProfiles((prevProfiles) => {
        const profile = prevProfiles[idolName];
        if (!profile) {
          console.error(`Profile not found: ${idolName}`);
          return prevProfiles;
        }
        return {
          ...prevProfiles,
          [idolName]: {
            ...profile,
            information: profile.information
              ? profile.information.map((info) =>
                  info.id === updatedInfo.id ? updatedInfo : info
                )
              : [updatedInfo],
          },
        };
      });
      return updatedInfo; // Return the updated info
    } catch (error) {
      console.error("Error upvoting information:", error);
      throw error; // Rethrow the error so it can be caught in ProfileView
    }
  };

  const filteredProfiles = Object.values(profiles).filter((profile) =>
    selectedCategory === "ALL" ? true : profile.category === selectedCategory
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
