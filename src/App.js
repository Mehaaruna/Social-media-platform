import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import UploadPost from "./UploadPost";
import "./App.css"
function App() {
  //const [user, setUser] = useState(null);
  return (
    <Router>
      <nav className="navbar">
        <div className="navContainer">
          <Link to="/" className="navLink">Login</Link> 
          <Link to="/home" className="navLink">Home</Link> 
          <Link to="/profile" className="navLink">Profile</Link> 
          <Link to="/upload" className="navLink">Upload</Link>
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<UploadPost />} />

      </Routes>
    </Router>
  );
}

export default App;



