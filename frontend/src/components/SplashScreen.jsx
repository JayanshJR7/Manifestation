import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManifestationSVG from "./ManifestationSVG";
import { manifestationPaths } from "./ManifestationPath";
import { SignaturePath } from "./SignaturePath";

const SplashScreen = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 3100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999] gap-10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Manifestation text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <ManifestationSVG
              color="#D4AF37"
              paths={manifestationPaths}
              viewBox="0 0 1440 320"
              className="w-[90%] max-w-[1100px] h-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
            />
          </motion.div>

          {/* Signature with "Manifested by" */}
          <motion.div
            className="flex flex-col items-center mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-[#D4AF37] font-light text-xl tracking-wide mb-3 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]">
              Manifested by
            </p>

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1314 500" // extra height so it's never cut
              className="w-[400px] md:w-[600px] h-auto"
            >
              {SignaturePath.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 2,
                    delay: 1.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
