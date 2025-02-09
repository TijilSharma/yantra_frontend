import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./UploadData.css";

const UploadData = ({ setFileUploaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backendURL = "https://predictivemain.onrender.com";

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      setError("");

      try {
        // Upload file
        const uploadResponse = await axios.post(`${backendURL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("File uploaded:", uploadResponse.data.filename);

        // Fetch processed data
        const dataResponse = await axios.get(`${backendURL}/load-data`);
        const { filename, original_data, final_data_RUL, final_data_ANA } = dataResponse.data;

        console.log("Received latest file:", filename);
        
        // ✅ Log original_data in console instead of showing table
        console.log("Original Data:", original_data);

        if (final_data_RUL) {
          console.log("Received final_data_RUL:", final_data_RUL);
        }

        if (final_data_ANA) {
          console.log("Received final_data_ANA:", final_data_ANA);
        }

        setFileUploaded(true); // Indicate successful upload
      } catch (err) {
        console.error("Error processing file:", err);
        setError("File processing failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".txt",
  });

  return (
    <div className="upload-container">
      <h2>Upload Data</h2>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop a .txt file or click to upload</p>}
      </div>

      {loading && <p>Processing...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UploadData;

















