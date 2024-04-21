import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchBar from "./components/SearchBar";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import ConnectionsComponent from "./components/ConnectionsComponent";
import NotConnected from "./components/NotConnected";
import Post from "./pages/Post";
import AllPosts from "./pages/AllPosts";
import AllSkills from "./pages/AllSkills";
import AllEducation from "./pages/AllEducation";
import AllExperience from "./pages/AllExperience";
import Pending from "./components/Pending";
import CreateResume from "./components/CreateResume";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import PostedJobs from "./pages/PostedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import ApplicantsDetails from "./pages/ApplicantsDetails";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/search" element={<SearchBar />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/createResume" element={<CreateResume />} />
        <Route path="/connections/connection" element={<ConnectionsComponent />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/connections/addfriend" element={<NotConnected />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/allPosts/:username/:userId" element={<AllPosts />} />
        <Route path="/allSkills/:username/:userId" element={<AllSkills />}/>
        <Route path="/allEducation/:username/:userId" element={<AllEducation />}/>
        <Route path="/allExperience/:username/:userId" element={<AllExperience />}/>  
        <Route path="/job-portal" element={<Jobs />}/>
        <Route path="/post-job" element={<CreateJob />}/>
        <Route path="/allPostedJobs" element={<PostedJobs/>}/>
        <Route path="/allAppliedJobs" element={<AppliedJobs/>}/>
        <Route path="/applicantDetails/:jobId" element={<ApplicantsDetails/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}