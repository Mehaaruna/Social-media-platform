import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const userId = 1; 

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













