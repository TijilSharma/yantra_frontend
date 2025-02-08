import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./UploadData.css";

const UploadData = () => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const backendURL = "https://predictivemain.onrender.com";

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      setError("");

      try {
        const uploadResponse = await axios.post(`${backendURL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Upload Response:", uploadResponse.data);

        if (!uploadResponse.data.filename) {
          throw new Error("Invalid upload response from server.");
        }

        setUploadedFile(uploadResponse.data.filename);

        // Step 2: Fetch predictions
        fetchPredictions();
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("File upload failed. Please try again.");
        setLoading(false);
      }
    }
  };

  const fetchPredictions = async () => {
    try {
      const predictResponse = await axios.get(`${backendURL}/load-data`);

      console.log("Prediction Response:", predictResponse.data);

      if (!predictResponse.data.data || !Array.isArray(predictResponse.data.data)) {
        throw new Error("Invalid prediction response from server.");
      }

      const rawData = predictResponse.data.data;

      // Extract column names dynamically
      const dynamicColumns = rawData.length > 0 ? Object.keys(rawData[0]) : [];
      setColumns(dynamicColumns);

      // Convert objects to arrays for table rendering
      const formattedData = rawData.map((item) => dynamicColumns.map((col) => item[col]));

      setTableData(formattedData);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError("Failed to fetch predictions. Please try again.");
    }

    setLoading(false);
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

      {uploadedFile && <p>Uploaded: {uploadedFile}</p>}

      {tableData.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadData;








