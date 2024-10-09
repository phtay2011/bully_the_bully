// components/ProfileCreation.js
import React, { useState } from "react";

function ProfileCreation({ onCreateProfile, categories }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && category) {
      onCreateProfile(name, category, image);
      setName("");
      setCategory("");
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Bully Name"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">🧠 Where do you flex your brain cells?</option>
        {Object.entries(categories).map(([key, value]) => (
          <option key={key} value={value}>
            {value}
          </option>
        ))}
      </select>
      <input
        // disabled
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && <img src={image} alt="Preview" style={{ maxWidth: "200px" }} />}
      <button className="btn" type="submit">
        Create Profile
      </button>
    </form>
  );
}

export default ProfileCreation;
