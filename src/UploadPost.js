import React, { useState } from "react";
import axios from "axios";
import "./Upload.css"

const UploadPost = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Get the selected file
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", "1"); // Replace with actual user ID

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












/*import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadPost() {
    const [image, setImage] = useState(null);
    //const [caption, setCaption] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        const user_id = localStorage.getItem("user_id"); // ✅ Get user_id from localStorage
        if (!user_id) {
            alert("User not logged in. Please login first.");
            return;
        }

        if (!image) {
            alert("Please select an image!");
            return;
        }


        //const formData = new FormData();
        const formData = new FormData();
        formData.append("user_id",user_id);  // Ensure this is set
        formData.append("image_url", image);
        //formData.append("file", image);
        //formData.append("user_id", user_id);
        //formData.append("caption", caption);
        //formData.append("username", localStorage.getItem("username")); // Assuming username is stored in localStorage

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                //headers: { "Content-Type": "multipart/form-data" },     
                method: "POST",
                body: formData
            });
            console.log(response.data);

            if (response.status === 201) {
                alert("Image uploaded successfully!");
                navigate("/home"); // Redirect to home page
            } else {
                alert("Error uploading image" + response.data.error);
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading post");
        }
    };


    return (
        <div>
            <h2>Upload Post</h2>
            <form onSubmit={handleUpload} encType="multipart/form-data">
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Upload</button>

            </form>
        </div>
    );
}

export default UploadPost;
*/
