import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "./DesignSystem";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaComments, 
  FaGlobe, 
  FaChartLine, 
  FaPlug, 
  FaRocket,
  FaChevronRight,
  FaBolt
} from "react-icons/fa";
import { 
  IoSparkles, 
  IoPulse, 
  IoAnalytics,
  IoGitNetwork
} from "react-icons/io5";

const SidebarContainer = styled(motion.div)`
  width: 280px;
  background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.6));
  backdrop-filter: blur(18px);
  border-radius: 0 24px 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0;
  position: sticky;
  left: 0;
  top: 0;
  height: 100vh;
  overflow: hidden;
  box-shadow: 4px 0 40px rgba(2, 132, 199, 0.12);
  border-right: 1px solid rgba(255,255,255,0.6);
  z-index: 10;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
  h2 {
    font-size: 1.6rem;
    background: linear-gradient(135deg, ${theme.colors.primaryDark} 0%, #0e7490 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    margin-bottom: 8px;
  }
  p {
    color: #00695c;
    font-size: 0.9rem;
    opacity: 0.8;
    font-weight: 500;
  }
`;

const Option = styled(motion.div)`
  width: 220px;
  background: ${props => props.isSelected 
    ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`
    : 'rgba(255, 255, 255, 0.85)'};
  border-radius: 20px;
  margin-bottom: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  color: ${props => props.isSelected ? '#fff' : theme.colors.primaryDark};
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => props.isSelected 
    ? theme.shadow.md 
    : '0 4px 15px rgba(0, 0, 0, 0.08)'};
  backdrop-filter: blur(10px);
  border: ${props => props.isSelected 
    ? '1px solid rgba(255, 255, 255, 0.3)' 
    : '1px solid rgba(255, 255, 255, 0.5)'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 2;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }
  &:hover::before { left: 100%; }
  &:hover {
    transform: translateX(8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(77, 208, 225, 0.3);
    background: ${props => !props.isSelected && 'rgba(255, 255, 255, 0.95)'};
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3;
  svg { font-size: 1.4rem; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); }
`;

const Badge = styled(motion.span)`
  background: linear-gradient(135deg, #ff4081 0%, #f50057 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 8px;
  z-index: 3;
`;

const FloatingParticles = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Particle = styled.div`
  position: absolute;
  background: rgba(77, 208, 225, 0.3);
  border-radius: 50%;
  animation: floatParticle 8s infinite linear;
  pointer-events: none;
  @keyframes floatParticle {
    0% { transform: translateY(100%) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100%) rotate(360deg); opacity: 0; }
  }
`;

const options = [
  { icon: <FaComments />, label: "Home", badge: "NEW", description: "Start here", iconColor: "#00bcd4" },
  { icon: <FaComments />, label: "AI Chatbot", badge: "NEW", description: "Interactive Assistant", iconColor: "#00bcd4" },
  { icon: <IoAnalytics />, label: "Holistic View", badge: "3D", description: "Data Visualization", iconColor: "#4caf50" },
  { icon: <FaChartLine />, label: "Forecasting", badge: "AI", description: "Predictive Analytics", iconColor: "#ff9800" },  
  { icon: <IoGitNetwork />, label: "API Access", badge: "DEV", description: "Integration Hub", iconColor: "#9c27b0" }
];

function Sidebar({ onSelect, selected }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 12;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4
    }));
    setParticles(newParticles);
  }, []);

  const handleOptionClick = (idx, label) => {
    if (label === "API Access") {
      window.open("http://localhost:8000/docs", "_blank");
    } else {
      onSelect(idx);
    }
  };

  const getIconVariants = {
    hover: { scale: 1.2, rotate: 5, color: "#fff" },
    selected: { scale: 1.1, color: "#fff" },
    default: { scale: 1, color: "#00796b" }
  };

  return (
    <SidebarContainer initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, type: "spring", damping: 15 }}>
      <FloatingParticles>
        {particles.map(particle => (
          <Particle key={particle.id} style={{ width: particle.size, height: particle.size, left: `${particle.left}%`, animationDelay: `${particle.delay}s`, animationDuration: `${particle.duration}s` }} />
        ))}
      </FloatingParticles>

      <ContentWrapper>
        <Header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }} style={{ background: 'linear-gradient(135deg, #4dd0e1, #00bcd4)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 25px rgba(77, 208, 225, 0.4)' }}>
            <FaRocket size={24} color="white" />
          </motion.div>
          <h2>INGRES Pro</h2>
          <p>Groundwater Intelligence</p>
        </Header>

        <AnimatePresence>
          {options.map((opt, idx) => (
            <Option
              key={idx}
              isSelected={selected === idx}
              onClick={() => handleOptionClick(idx, opt.label)}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
              style={{ cursor: 'pointer' }}
            >
              <IconWrapper>
                <motion.div variants={getIconVariants} initial="default" animate={selected === idx ? "selected" : "default"} whileHover="hover" style={{ color: opt.iconColor }}>
                  {opt.icon}
                </motion.div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {opt.label}
                    {opt.badge && (
                      <Badge initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 * idx + 0.5 }}>
                        {opt.badge}
                      </Badge>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: 2, color: selected === idx ? 'rgba(255,255,255,0.9)' : '#00695c' }}>
                    {opt.description}
                  </div>
                </div>
              </IconWrapper>
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: selected === idx ? 1 : 0.5 }} transition={{ type: "spring", stiffness: 500 }}>
                <FaChevronRight size={12} />
              </motion.div>
            </Option>
          ))}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', color: '#00695c', fontSize: '0.8rem' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} style={{ marginBottom: 8 }}>
            <FaBolt color="#ff9800" size={20} />
          </motion.div>
          <div>v2.1.0 • Powered by AI</div>
        </motion.div>
      </ContentWrapper>
    </SidebarContainer>
  );
}

export default Sidebar;
