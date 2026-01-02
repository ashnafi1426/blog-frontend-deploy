import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PostView from "./pages/PostView";
import NewStory from "./pages/NewStory";
import Bookmarks from "./pages/Bookmarks";
import Drafts from "./pages/Drafts";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Topic from "./pages/Topic";
import Notifications from "./pages/Notifications";
import People from "./pages/People";
import NotFound from "./pages/Notfind";
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<PostView />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="topic/:slug" element={<Topic />} />
        <Route path="people" element={<People />} />
      </Route>
      {/* Auth pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private routes */}
      <Route
        element={
          <RequireAuth>
            <PrivateLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-story" element={<NewStory />} />
        <Route path="/edit/:id" element={<NewStory />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
