import React, { useState } from "react";
import AWS from "aws-sdk";

// Configure AWS SDK (you should do this in a separate config file)
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

function ProfileCreation({ onCreateProfile, categories }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && category && imageUrl) {
      onCreateProfile(name, category, imageUrl);
      setName("");
      setCategory("");
      setImage(null);
      setImageUrl("");
      window.location.reload();
    }
  };

  const uploadToS3 = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const params = {
      Bucket: "spill-the-tea",
      Key: fileName,
      Body: file,
      // ACL: "public-read",
    };

    try {
      const { Location } = await s3.upload(params).promise();
      return Location;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadToS3(file);
        setImageUrl(url);
        setImage(URL.createObjectURL(file)); // For preview
      } catch (error) {
        console.error("Error handling image upload:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsUploading(false);
      }
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
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading image...</p>}
      {image && <img src={image} alt="Preview" style={{ maxWidth: "200px" }} />}
      <button className="btn" type="submit" disabled={isUploading || !imageUrl}>
        Create Profile
      </button>
    </form>
  );
}

export default ProfileCreation;
