import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const userId = 1; // Replace with the logged-in user's ID dynamically

  useEffect(() => {
    axios.get(`http://localhost:5000/profile/${userId}`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="profile-container">
      
      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="profile-post-card">
              <img src={`http://localhost:5000/uploads/${post.image_url}`} alt="Post" className="profile-post-image" />
              <p className="likes">Likes: {post.likes}</p>
            </div>
          ))
        ) : (
          <p>No posts uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;











/*import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Profile() {
    const [posts, setPosts] = useState([]);
    const userId = localStorage.getItem("user_id"); // Get logged-in user ID

    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:5000/user_posts/${userId}`)
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching user posts:", error);
            });
    }, [userId]); // Depend on userId

    return (
        <div>
            <h2>My Uploaded Posts</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {posts.map((post) => (
                    <img
                        key={post.id}
                        src={`http://localhost:5000/uploads/${post.image_url}`}
                        alt="User Post"
                        style={{ width: "200px", margin: "10px", borderRadius: "10px" }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Profile;
*/