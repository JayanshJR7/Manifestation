  import { useState, useEffect } from 'react';
  import { MessageSquare, Sparkles, Users, Zap } from 'lucide-react';

  const AuthImagePattern = ({ title, subtitle }) => {
    const [activeNodes, setActiveNodes] = useState(new Set());
    const [pulseIndex, setPulseIndex] = useState(0);
    const [connectionLines, setConnectionLines] = useState([]);

    // Network nodes configuration
    const nodes = [
      { id: 1, x: 20, y: 25, size: 'large', delay: 0 },
      { id: 2, x: 70, y: 15, size: 'medium', delay: 1.2 },
      { id: 3, x: 15, y: 60, size: 'small', delay: 2.4 },
      { id: 4, x: 85, y: 45, size: 'medium', delay: 1.8 },
      { id: 5, x: 45, y: 40, size: 'large', delay: 0.6 },
      { id: 6, x: 65, y: 75, size: 'small', delay: 3.0 },
      { id: 7, x: 35, y: 80, size: 'medium', delay: 2.6 },
      { id: 8, x: 80, y: 25, size: 'small', delay: 1.4 },
    ];

    const connections = [
      { from: 1, to: 5 }, { from: 5, to: 2 }, { from: 5, to: 4 },
      { from: 3, to: 7 }, { from: 7, to: 6 }, { from: 4, to: 8 },
      { from: 2, to: 4 }, { from: 1, to: 3 }
    ];

    // Activate nodes in sequence
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveNodes(prev => {
          const newActive = new Set(prev);
          const nodeToActivate = nodes[pulseIndex % nodes.length];
          newActive.add(nodeToActivate.id);
          
          // Remove old active nodes (keep only last 3)
          if (newActive.size > 3) {
            const oldestNode = nodes[(pulseIndex - 3) % nodes.length];
            newActive.delete(oldestNode.id);
          }
          
          return newActive;
        });
        setPulseIndex(prev => prev + 1);
      }, 800);

      return () => clearInterval(interval);
    }, [pulseIndex, nodes]);

    // Generate connection lines with animation
    useEffect(() => {
      const animatedConnections = connections.map((conn, index) => ({
        ...conn,
        delay: index * 0.3,
        active: activeNodes.has(conn.from) || activeNodes.has(conn.to)
      }));
      setConnectionLines(animatedConnections);
    }, [activeNodes]);

    const getNodeSize = (size) => {
      switch (size) {
        case 'large': return 'w-4 h-4';
        case 'medium': return 'w-3 h-3';
        case 'small': return 'w-2 h-2';
        default: return 'w-3 h-3';
      }
    };

    const NetworkNode = ({ node }) => {
      const isActive = activeNodes.has(node.id);
      return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animationDelay: `${node.delay}s`
          }}
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isActive 
                ? 'bg-blue-500/30 animate-ping scale-150' 
                : 'bg-slate-600/20 scale-100'
            }`} />
            
            {/* Main node */}
            <div className={`relative ${getNodeSize(node.size)} rounded-full transition-all duration-700 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50' 
                : 'bg-slate-600/60 group-hover:bg-slate-500/80'
            }`}>
              {/* Inner sparkle */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
              )}
            </div>
            
            {/* Connection indicator */}
            {isActive && (
              <div className="absolute -inset-2 rounded-full border border-blue-400/50 animate-pulse" />
            )}
          </div>
        </div>
      );
    };

    const ConnectionLine = ({ connection }) => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      const isActive = connection.active;
      
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${fromNode.x}%`}
            y1={`${fromNode.y}%`}
            x2={`${toNode.x}%`}
            y2={`${toNode.y}%`}
            stroke={isActive ? "url(#activeGradient)" : "#475569"}
            strokeWidth={isActive ? "2" : "1"}
            strokeOpacity={isActive ? "0.8" : "0.3"}
            className="transition-all duration-700"
            strokeDasharray={isActive ? "none" : "2,2"}
          />
          <defs>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      );
    };

    const FloatingIcon = ({ Icon, position, delay, size = "w-6 h-6" }) => (
      <div
        className="absolute opacity-40 animate-float-gentle"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          animationDelay: `${delay}s`,
        }}
      >
        <div className="p-3 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 hover:bg-slate-600/60 transition-all duration-300">
          <Icon className={`${size} text-slate-400`} />
        </div>
      </div>
    );

    return (
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <style jsx>{`
          @keyframes float-gentle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-float-gentle {
            animation: float-gentle 6s ease-in-out infinite;
          }
        `}</style>
        
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Network visualization */}
        <div className="absolute inset-0">
          {/* Connection lines */}
          {connectionLines.map((connection, index) => (
            <ConnectionLine key={index} connection={connection} />
          ))}
          
          {/* Network nodes */}
          {nodes.map(node => (
            <NetworkNode key={node.id} node={node} />
          ))}
        </div>

        {/* Floating icons */}
        <FloatingIcon 
          Icon={Sparkles} 
          position={{ x: 10, y: 20 }} 
          delay={0} 
        />
        <FloatingIcon 
          Icon={Users} 
          position={{ x: 90, y: 80 }} 
          delay={2} 
        />
        <FloatingIcon 
          Icon={Zap} 
          position={{ x: 85, y: 15 }} 
          delay={4} 
        />

        {/* Central content */}
        <div className="relative z-10 text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <MessageSquare className="w-10 h-10 text-slate-300 relative z-10 group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 border border-slate-500/30 rounded-2xl animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-4xl font-light text-white mb-4 tracking-wide">
            {title}
          </h2>
          
          <p className="text-slate-400 leading-relaxed text-lg mb-8 max-w-sm mx-auto">
            {subtitle}
          </p>
          
          {/* Elegant divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent w-32" />
            <div className="w-2 h-2 bg-slate-600 rounded-full mx-4 animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent w-32" />
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-slate-400">Network Active</span>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full" />
      </div>
    );
  };

  export default AuthImagePattern;