import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { FaPlay, FaRobot, FaChartLine, FaLightbulb, FaRocket } from "react-icons/fa";
import { IoStatsChart, IoWaterOutline } from "react-icons/io5";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

// Enhanced Styled Components
const PageContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #082f49 50%, #0a0f2b 100%);
  position: relative;
  overflow: hidden;
`;

const HeaderSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
`;

const MainHeader = styled.h1`
  font-size: 3.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

const SubHeader = styled.p`
  color: #cbd5e1;
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ForecastCard = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6);
    border-radius: 24px 24px 0 0;
  }
`;

const InputContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  flex: 1;
  padding: 18px 24px;
  border-radius: 16px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  font-size: 1.1rem;
  margin-right: 16px;
  outline: none;
  color: #fff;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(34, 211, 238, 0.5);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const PredictButton = styled(motion.button)`
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  border: none;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 1.3rem;
  box-shadow: 0 8px 24px rgba(34, 211, 238, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  color: #cbd5e1;
`;

const SimpleLoader = styled.div`
  width: 120px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
  position: relative;
`;

const SimpleLoaderFill = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
`;

const InsightCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 16px;
  padding: 24px;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #22d3ee;
`;

const InsightContent = styled.p`
  color: #e0f2fe;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
`;

const PromptSuggestions = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
`;

const PromptButton = styled(motion.button)`
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  color: #e0f2fe;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(34, 211, 238, 0.2);
    transform: translateY(-2px);
  }
`;

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  margin-top: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FloatingParticles = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(34, 211, 238, 0.6);
  border-radius: 50%;
`;

function Forecasting({ selectedPage, setSelectedPage }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [reason, setReason] = useState("");
  const [particles, setParticles] = useState([]);

  const promptSuggestions = [
    "Forecast groundwater extraction in Karnataka for next 5 years",
    "Predict recharge trends in Maharashtra 2025-2030",
    "Future water level predictions for coastal districts",
    "Estimate extraction rates for Punjab next 3 years",
    "Project groundwater availability for drought-prone areas"
  ];

  React.useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const sendForecast = async (customPrompt = null) => {
    const question = customPrompt || input.trim();
    if (!question) return;
    
    setLoading(true);
    setForecastData(null);
    setReason("");
    
    try {
      const res = await fetch("http://localhost:8000/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.forecast && Array.isArray(data.forecast.data)) {
        setForecastData(data.forecast.data);
        setReason(data.forecast.reason);
      } else {
        setForecastData([]);
        setReason("No forecast data returned. Please try a different query.");
      }
    } catch (err) {
      setForecastData([]);
      setReason("🚨 Error: Could not connect to the forecasting engine. Please try again.");
    }
    setLoading(false);
  };

  // Enhanced chart data preparation
  let chartData = null;
  if (forecastData && forecastData.length > 0) {
    const years = forecastData.map(d => d.year);
    const existing = forecastData.map(d => d.existing ? d.value : null);
    const predicted = forecastData.map(d => d.existing ? null : d.value);
    
    chartData = {
      labels: years,
      datasets: [
        {
          label: "Historical Data",
          data: existing,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.1)",
          borderWidth: 4,
          pointBackgroundColor: "#22d3ee",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4,
        },
        {
          label: "AI Prediction",
          data: predicted,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 4,
          borderDash: [5, 5],
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4,
        }
      ]
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0f2fe',
          font: {
            size: 14,
            weight: '600'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'AI-Powered Groundwater Forecast',
        color: '#ffffff',
        font: {
          size: 18,
          weight: '700'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#22d3ee',
        bodyColor: '#e0f2fe',
        borderColor: '#22d3ee',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: '#cbd5e1',
          font: {
            size: 14,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cbd5e1'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          color: '#cbd5e1',
          font: {
            size: 14,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingParticles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </FloatingParticles>

      <HeaderSection
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MainHeader>AI Forecasting Engine</MainHeader>
        <SubHeader>
          Predict future groundwater trends with advanced machine learning models. 
          Get accurate forecasts and actionable insights.
        </SubHeader>
      </HeaderSection>

      <PromptSuggestions
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {promptSuggestions.map((prompt, index) => (
          <PromptButton
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setInput(prompt);
              sendForecast(prompt);
            }}
          >
            {prompt}
          </PromptButton>
        ))}
      </PromptSuggestions>

      <ForecastCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <InputContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Input
            type="text"
            placeholder="Ask for future predictions... (e.g., Forecast extraction in Karnataka for next 5 years)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendForecast()}
          />
          <PredictButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => sendForecast()}
          >
            <FaRocket />
          </PredictButton>
        </InputContainer>

        <AnimatePresence>
          {loading && (
            <LoadingContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SimpleLoader>
                <SimpleLoaderFill
                  initial={{ x: '-40%' }}
                  animate={{ x: '160%' }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </SimpleLoader>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.3rem', color: '#22d3ee', marginBottom: 8 }}>
                  Generating AI Forecast...
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  Analyzing patterns and predicting future trends
                </div>
              </motion.div>
            </LoadingContainer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {chartData && (
            <ChartContainer
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </ChartContainer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {reason && (
            <InsightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InsightHeader>
                <FaLightbulb size={24} />
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>AI Insight</span>
              </InsightHeader>
              <InsightContent>{reason}</InsightContent>
            </InsightCard>
          )}
        </AnimatePresence>
      </ForecastCard>
    </PageContainer>
  );
}

export default Forecasting;