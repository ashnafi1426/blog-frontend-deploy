import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile, changePassword } from "../services/userService";
import { getFollowers, getFollowing, unfollowUser } from "../services/followService";
import { 
  FaUser, FaLock, FaBell, FaUsers, FaUserMinus, FaCheck, 
  FaCamera, FaSave, FaSignOutAlt, FaTrash
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, followersData, followingData] = await Promise.all([
          getUserProfile(userId, token),
          getFollowers(userId, token).catch(() => []),
          getFollowing(userId, token).catch(() => [])
        ]);

        setProfile(user);
        setDisplayName(user?.display_name || "");
        setUsername(user?.username || "");
        setBio(user?.bio || "");
        setAvatar(user?.avatar || "");
        setEmail(user?.email || "");
        setFollowers(followersData || []);
        setFollowing(followingData || []);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  const handleSaveProfile = async () => {
    console.log("=== SETTINGS SAVE PROFILE CLICKED ===");
    setSaving(true);
    try {
      const profileData = {
        display_name: displayName,
        username,
        bio,
        avatar
      };
      
      console.log("Settings - userId:", userId);
      console.log("Settings - profileData:", JSON.stringify(profileData));
      console.log("Settings - token exists:", !!token);
      
      const result = await updateUserProfile(userId, profileData, token);
      console.log("Settings - result:", result);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Settings - error:", err);
      alert(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      await changePassword(userId, currentPassword, newPassword, token);
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.message || "Failed to change password");
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await unfollowUser(targetUserId, token);
      setFollowing(following.filter(f => f.user_id !== targetUserId));
    } catch (err) {
      alert("Failed to unfollow");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "followers", label: `Followers (${followers.length})`, icon: FaUsers },
    { id: "following", label: `Following (${following.length})`, icon: FaUsers },
    { id: "notifications", label: "Notifications", icon: FaBell },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your profile details</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-gray-200"
                      />
                      <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition">
                        <FaCamera size={14} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                      <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="flex">
                      <span className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">{bio.length}/160 characters</p>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {saving ? "Saving..." : <><FaSave size={14} /> Save Changes</>}
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1 text-green-600">
                        <FaCheck size={14} /> Saved successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-200">
                    <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                      <FaTrash size={14} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Followers Tab */}
            {activeTab === "followers" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Your Followers</h2>
                  <p className="text-sm text-gray-500">{followers.length} people follow you</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {followers.length === 0 ? (
                    <div className="p-8 text-center">
                      <FaUsers className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500">No followers yet</p>
                      <p className="text-sm text-gray-400">Share your stories to gain followers</p>
                    </div>
                  ) : (
                    followers.map((follower) => (
                      <div key={follower.user_id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <img
                            src={follower.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.username}`}
                            alt={follower.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{follower.display_name || follower.username}</p>
                            <p className="text-sm text-gray-500">@{follower.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/profile/${follower.user_id}`)}
                          className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition"
                        >
                          View Profile
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Following Tab */}
            {activeTab === "following" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">People You Follow</h2>
                  <p className="text-sm text-gray-500">You follow {following.length} people</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {following.length === 0 ? (
                    <div className="p-8 text-center">
                      <FaUsers className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500">Not following anyone yet</p>
                      <p className="text-sm text-gray-400">Discover writers to follow</p>
                    </div>
                  ) : (
                    following.map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.display_name || user.username}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnfollow(user.user_id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition"
                        >
                          <FaUserMinus size={14} />
                          Unfollow
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Email notifications for new followers", checked: true },
                    { label: "Email notifications for comments", checked: true },
                    { label: "Email notifications for claps", checked: false },
                    { label: "Weekly digest email", checked: true },
                    { label: "Push notifications", checked: false },
                  ].map((item, index) => (
                    <label key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <span className="text-gray-700">{item.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                  ))}
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
