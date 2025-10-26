import styled from "styled-components";
import { motion } from "framer-motion";

export const theme = {
  colors: {
    primary: "#00bcd4",
    primaryDark: "#00796b",
    accent: "#9c27b0",
    success: "#4caf50",
    danger: "#f44336",
    surface: "rgba(255,255,255,0.7)",
    textPrimary: "#0f172a",
    textSecondary: "#334155"
  },
  radius: {
    sm: "10px",
    md: "16px",
    lg: "24px",
  },
  shadow: {
    sm: "0 6px 20px rgba(2,132,199,0.12)",
    md: "0 10px 40px rgba(2,132,199,0.15)",
    lg: "0 20px 60px rgba(2,132,199,0.25)",
  }
};

export const GlassCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: ${theme.radius.lg};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: ${theme.shadow.md};
`;

export const GradientButton = styled(motion.button)`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: ${theme.colors.primaryDark};
`;

export const TopbarContainer = styled(motion.div)`
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55));
  border-bottom: 1px solid rgba(255,255,255,0.6);
  backdrop-filter: blur(14px);
`;

export const Pill = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 188, 212, 0.12);
  color: ${theme.colors.primaryDark};
  font-weight: 700;
  font-size: 0.8rem;
`;

export const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 28px 28px 40px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;


