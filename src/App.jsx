import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import AllPosts from "./components/AllPosts";
import MyPosts from "./components/MyPosts";
import CreatePost from "./components/CreatePost";
import Profile from "./components/Profile.jsx";
import SignIn from "./components/Sign-in.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AllPosts />} />
          <Route path="my-posts" element={<MyPosts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
