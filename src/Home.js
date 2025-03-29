import React, { useEffect, useState } from "react"; 
import axios from "axios";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:5000/posts")
            .then(res => {
                setPosts(res.data);                                                                          
            })
            .catch(err => {
                console.error("Error fetching posts:", err);
            });
    }, []);

    const likePost = (post_id) => {
        axios.post(`http://localhost:5000/like/${post_id}`)
            .then(response => {
                console.log("Post liked successfully:", response.data);
                setPosts(posts.map(p => 
                    p.id === post_id ? { ...p, likes: p.likes + 1 } : p
                ));
            })
            .catch(error => {
                console.log("Error liking post:", error);
            });
    };

    return (
        <div className="home-container">
            
            <button onClick={() => navigate("/upload")}>Upload Post</button> 
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div className="post-card" key={post.id}>
                        <div className="post-header">
                            <img src="/images/profile.jpg" alt="" className="profile-logo"/>
                            <span className="username">{post.username}</span>  {/* Display the actual username */}
                        </div>
                        <img src={`http://localhost:5000/uploads/${post.image_url}`} alt="Post" className="post-image" />
                        <p>Likes: {post.likes}</p>
                        <div className="post-actions">
                            <button className="like-button" onClick={() => likePost(post.id)}>
                                ❤️ Like
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
}

export default Home;
