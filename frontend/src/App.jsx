import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FirendsPage"; // ADD THIS LINE
import { userAuthStore } from "./Store/useAuthStore";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./Store/useThemeStore";
import SplashScreen from "./components/SplashScreen"; // 

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();
  const { theme } = useThemeStore();

  // 👇 Splash logic
  const [splashDone, setSplashDone] = useState(() => {
    return sessionStorage.getItem("splashSeen") === "true";
  });

  const handleSplashFinish = () => {
    setSplashDone(true);
    sessionStorage.setItem("splashSeen", "true");
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  // 👇 Show splash if not done yet
  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 👇 Normal auth loading state
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // 👇 Main App content
  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/friends"
          element={authUser ? <FriendsPage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
};

export default App;
