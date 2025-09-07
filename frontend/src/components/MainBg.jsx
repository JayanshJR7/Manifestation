"use client";
import { useState, useEffect } from "react";
import { useThemeStore } from "../Store/useThemeStore";

const MainBg = ({ children }) => {
  const { theme } = useThemeStore();
  const [hoveredNode, setHoveredNode] = useState(null);

  // pattern nodes
  const nodes = [
    { id: 1, x: "20%", y: "30%" },
    { id: 2, x: "50%", y: "15%" },
    { id: 3, x: "75%", y: "40%" },
    { id: 4, x: "35%", y: "70%" },
    { id: 5, x: "70%", y: "80%" },
  ];

  // theme-aware styles
  const nodeColor =
    theme === "dark"
      ? "bg-blue-400/80 shadow-blue-500/30"
      : "bg-blue-600/70 shadow-blue-400/40";

  const glowColor = theme === "dark" ? "rgba(96,165,250,0.6)" : "rgba(59,130,246,0.6)";
  const lineColor = theme === "dark" ? "rgba(148,163,184,0.3)" : "rgba(71,85,105,0.25)";

  // calculate connections dynamically
  const getLines = () => {
    let lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        lines.push({ from: nodes[i], to: nodes[j] });
      }
    }
    return lines;
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden transition-colors duration-500
        ${theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-200"
        }`}
    >
      <style jsx>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-floaty {
          animation: floaty 4s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ring {
          position: absolute;
          border-radius: 9999px;
          animation: pulse-ring 1s ease-out forwards;
        }
      `}</style>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${theme === "dark"
              ? "rgba(148,163,184,0.2)"
              : "rgba(71,85,105,0.15)"} 1px, transparent 1px),
            linear-gradient(90deg, ${theme === "dark"
              ? "rgba(148,163,184,0.2)"
              : "rgba(71,85,105,0.15)"} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {getLines().map((line, idx) => (
          <line
            key={idx}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke={lineColor}
            strokeWidth="1"
            className={`transition-opacity duration-500 ${
              hoveredNode &&
              (hoveredNode === line.from.id || hoveredNode === line.to.id)
                ? "opacity-70"
                : "opacity-30"
            }`}
          />
        ))}
      </svg>

      {/* Floating nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute cursor-pointer"
          style={{ left: node.x, top: node.y }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div
            className={`relative w-3 h-3 rounded-full ${nodeColor} shadow-md
              transition-transform duration-300 hover:scale-125 animate-floaty`}
            style={{
              boxShadow:
                hoveredNode === node.id
                  ? `0 0 12px 4px ${glowColor}`
                  : "none",
            }}
          />
        </div>
      ))}

      {/* Accent corners */}
      <div
        className={`absolute top-0 left-0 w-32 h-32 rounded-br-full
          ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-400/20"}`}
      />
      <div
        className={`absolute bottom-0 right-0 w-32 h-32 rounded-tl-full
          ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-400/20"}`}
      />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default MainBg;
