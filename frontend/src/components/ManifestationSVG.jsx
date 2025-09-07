import { motion } from "framer-motion";

const ManifestationSVG = ({ color, paths, viewBox }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    className="w-[600px] h-[250px]"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <defs>
      {/* Blur filter for glow */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {paths.map((d, i) => (
      <g key={i}>
        {/* Glow layer */}
        <motion.path
          d={d}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeOpacity="0.6"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 * i }}
        />
        {/* Main stroke */}
        <motion.path
          d={d}
          stroke={color}
          strokeWidth="4"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 * i }}
        />
      </g>
    ))}
  </motion.svg>
);

export default ManifestationSVG;
