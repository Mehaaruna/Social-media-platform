import React, { useState } from "react";
import axios from "axios";
import "./Upload.css"

const UploadPost = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); 
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", "1"); 
        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.status === 200) {
                setMessage("File uploaded successfully!");
            } else {
                setMessage("Error uploading file.");
            }
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || "Upload failed"));
        }
    };

    return (
        <div className="upload-page">
            <h2>Upload Post</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadPost;

