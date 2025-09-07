import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";
import ManifestationSVG from "./ManifestationSVG";
import { motion, AnimatePresence } from "framer-motion";
import { manifestationPaths } from "./ManifestationPath.jsx";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const [animating, setAnimating] = useState(false);
  const [overlayTheme, setOverlayTheme] = useState(theme);

  const toggleTheme = () => {
    if (animating) return;
    setOverlayTheme(theme);
    setAnimating(true);

    // switch theme mid-animation
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
    }, 700);

    // finish and clear
    setTimeout(() => {
      setAnimating(false);
    }, 1600);
  };

  const paintColor = overlayTheme === "light" ? "#000" : "#fff";
  const logoColor = overlayTheme === "light" ? "#fff" : "#000";

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={toggleTheme}
        className={`
          relative flex items-center w-20 h-10 rounded-full p-1
          transition-all duration-300 shadow-md
          ${theme === "light" ? "bg-yellow-400" : "bg-gray-800"}
        `}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full
            text-white shadow-lg
            ${theme === "light" ? "bg-white text-yellow-500" : "bg-black text-blue-400"}
          `}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "light" ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun size={18} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      {/* Overlay effect */}
      {animating && (
        <>
          {/* Paint spread */}
          <div
            className="fixed top-0 right-0 w-screen h-screen pointer-events-none z-[9998]"
            style={{
              background: paintColor,
              clipPath: "circle(0% at 100% 0%)",
              animation:
                "paintSpread 0.7s forwards ease-in-out, overlayFade 0.9s 0.7s forwards",
            }}
          />

          {/* SVG manifestation */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
            <ManifestationSVG
              color={logoColor}
              paths={manifestationPaths}
              viewBox="0 0 1368 236" 
            />
          </div>
        </>
      )}

      <style>
        {`
          @keyframes paintSpread {
            to { clip-path: circle(150% at 100% 0%); }
          }
          @keyframes overlayFade {
            to { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ThemeToggle;
