import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Plot from "react-plotly.js";
import styled from "styled-components";
import { GlassCard } from "./DesignSystem";
import { FaMap, FaChartPie, FaChartLine, FaSync } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";

// Enhanced Styled Components
const DashboardContainer = styled(motion.div)`
  padding: 40px;
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

const MainTitle = styled.h1`
  font-size: 3.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

const SubTitle = styled.p`
  color: #cbd5e1;
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const EnhancedGlassCard = styled(GlassCard)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 20px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
`;

const CardTitle = styled.h3`
  color: #e0f2fe;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #cbd5e1;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(34, 211, 238, 0.3);
  border-top: 4px solid #22d3ee;
  border-radius: 50%;
  margin-bottom: 20px;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top: 4px solid #3b82f6;
    animation: spin 1.5s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled(motion.div)`
  text-align: center;
  padding: 60px 40px;
  color: #ef4444;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 600;
`;

const EnhancedTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
  
  th {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2));
    color: #e0f2fe;
    padding: 16px;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid rgba(34, 211, 238, 0.3);
  }
  
  td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
    transition: all 0.3s ease;
  }
  
  tr:hover td {
    background: rgba(34, 211, 238, 0.05);
    color: #ffffff;
    transform: translateX(4px);
  }
`;

const TopBlocksList = styled(motion.ol)`
  list-style: none;
  counter-reset: block-counter;
  padding: 0;
  margin: 0;
`;

const BlockItem = styled(motion.li)`
  counter-increment: block-counter;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #22d3ee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &::before {
    content: counter(block-counter);
    background: linear-gradient(135deg, #22d3ee, #3b82f6);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-right: 12px;
  }
  
  &:hover {
    background: rgba(34, 211, 238, 0.1);
    transform: translateX(8px);
  }
`;

const BlockName = styled.span`
  color: #e0f2fe;
  font-weight: 600;
  flex: 1;
`;

const BlockValue = styled.span`
  color: #ef4444;
  font-weight: 800;
  font-size: 1.1rem;
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

export default function HolisticView() {
  const [pieData, setPieData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);

    // Fetch all data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [pieRes, trendRes, barRes, geoRes] = await Promise.all([
          fetch("http://localhost:8000/dashboard/pie"),
          fetch("http://localhost:8000/dashboard/trend"),
          fetch("http://localhost:8000/dashboard/bar"),
          fetch("http://localhost:8000/dashboard/map")
        ]);

        const [pieData, trendData, barData, geoData] = await Promise.all([
          pieRes.json(),
          trendRes.json(),
          barRes.json(),
          geoRes.json()
        ]);

        // Process pie data
        const labels = [...new Set(pieData.map(item => item.categorization))];
        const values = labels.map(label => 
          pieData.filter(item => item.categorization === label)
              .reduce((sum, item) => sum + parseInt(item.count), 0)
        );
        setPieData({ labels, values });

        // Process trend data
        const processedTrendData = {
          data: [
            {
              x: trendData.map(item => item.year),
              y: trendData.map(item => parseFloat(item.recharge) || 0),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Recharge',
              line: { color: '#10b981', width: 4 },
              marker: { size: 8, color: '#10b981' }
            },
            {
              x: trendData.map(item => item.year),
              y: trendData.map(item => parseFloat(item.extraction) || 0),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Extraction',
              line: { color: '#ef4444', width: 4 },
              marker: { size: 8, color: '#ef4444' }
            }
          ]
        };
        setTrendData(processedTrendData);

        // Process bar data
        if (barData && barData.length > 0) {
          const processedBarData = {
            names: barData.map(item => `${item.block}, ${item.state}`),
            values: barData.map(item => parseFloat(item.stage_of_ground_water_extraction_pct) || 0)
          };
          setBarData(processedBarData);
        }

        // Process geo data
        setGeoData(geoData);

        setLoading(false);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardContainer
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
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </FloatingParticles>

        <LoadingContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Spinner />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '1.5rem', color: '#22d3ee', marginBottom: 8 }}>
              Loading Groundwater Intelligence
            </div>
            <div style={{ color: '#cbd5e1' }}>
              Analyzing nationwide groundwater patterns and trends...
            </div>
          </motion.div>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>⚠️</div>
          <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: 16 }}>
            Dashboard Unavailable
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
            {error}. Please check your connection and try again.
          </div>
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
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
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
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
        <MainTitle>Groundwater Intelligence Dashboard</MainTitle>
        <SubTitle>
          Real-time nationwide insights across groundwater categories, trends, hotspots, and safety metrics
        </SubTitle>
      </HeaderSection>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatsGrid>
          <StatCard whileHover={{ scale: 1.05, y: -5 }}>
            <StatValue>28</StatValue>
            <StatLabel>Total States Analyzed</StatLabel>
          </StatCard>
          <StatCard whileHover={{ scale: 1.05, y: -5 }}>
            <StatValue>9155</StatValue>
            <StatLabel>Blocks Monitored</StatLabel>
          </StatCard>
          <StatCard whileHover={{ scale: 1.05, y: -5 }}>
            <StatValue>148</StatValue>
            <StatLabel>Data Points</StatLabel>
          </StatCard>
        </StatsGrid>
      </motion.div>

      <GridContainer>
        {/* Pie Chart Card */}
        <AnimatePresence>
          <EnhancedGlassCard
            key="pie-chart"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <CardHeader>
              <CardIcon>
                <FaChartPie />
              </CardIcon>
              <CardTitle>Groundwater Categories Distribution</CardTitle>
            </CardHeader>
            {pieData && (
              <Plot
                data={[{
                  type: "pie",
                  labels: pieData.labels,
                  values: pieData.values,
                  marker: { 
                    colors: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
                  },
                  hole: 0.4,
                  textinfo: 'label+percent',
                  hoverinfo: 'label+value+percent',
                }]}
                layout={{
                  paper_bgcolor: "rgba(0,0,0,0)",
                  plot_bgcolor: "rgba(0,0,0,0)",
                  font: { color: '#e0f2fe' },
                  showlegend: true,
                  legend: {
                    font: { color: '#cbd5e1' }
                  }
                }}
                style={{ width: "100%", height: "400px" }}
              />
            )}
          </EnhancedGlassCard>
        </AnimatePresence>

        {/* Trend Chart Card */}
        <AnimatePresence>
          <EnhancedGlassCard
            key="trend-chart"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <CardHeader>
              <CardIcon>
                <FaChartLine />
              </CardIcon>
              <CardTitle>Recharge vs Extraction Trends</CardTitle>
            </CardHeader>
            {trendData && (
              <Plot
                data={trendData.data}
                layout={{
                  paper_bgcolor: "rgba(0,0,0,0)",
                  plot_bgcolor: "rgba(0,0,0,0)",
                  font: { color: '#e0f2fe' },
                  xaxis: { 
                    title: { text: "Year", font: { color: '#cbd5e1' } },
                    gridcolor: 'rgba(255,255,255,0.1)'
                  },
                  yaxis: { 
                    title: { text: "Volume (ham)", font: { color: '#cbd5e1' } },
                    gridcolor: 'rgba(255,255,255,0.1)'
                  },
                  legend: {
                    font: { color: '#cbd5e1' },
                    orientation: 'h'
                  }
                }}
                style={{ width: "100%", height: "400px" }}
              />
            )}
          </EnhancedGlassCard>
        </AnimatePresence>

        {/* Top Blocks Card */}
        <AnimatePresence>
          <EnhancedGlassCard
            key="top-blocks"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <CardHeader>
              <CardIcon>
                <IoWaterOutline />
              </CardIcon>
              <CardTitle>Top Extraction Zones</CardTitle>
            </CardHeader>
            {barData && barData.names && barData.names.length > 0 ? (
              <TopBlocksList>
                {barData.names
                  .map((name, idx) => ({
                    name,
                    value: barData.values[idx]
                  }))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 8)
                  .map((item, idx) => (
                    <BlockItem
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <BlockName>{item.name}</BlockName>
                      <BlockValue>{item.value.toFixed(1)}%</BlockValue>
                    </BlockItem>
                  ))}
              </TopBlocksList>
            ) : (
              <div style={{ 
                padding: "40px", 
                textAlign: "center",
                color: "#cbd5e1",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px"
              }}>
                <FaSync size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <div>No extraction data available for the current period</div>
              </div>
            )}
          </EnhancedGlassCard>
        </AnimatePresence>

        {/* State-wise Data Card */}
        <AnimatePresence>
          <EnhancedGlassCard
            key="state-data"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <CardHeader>
              <CardIcon>
                <FaMap />
              </CardIcon>
              <CardTitle>State-wise Groundwater Status</CardTitle>
            </CardHeader>
            {geoData && (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <EnhancedTable>
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Safe Blocks (%)</th>
                      <th>Total Blocks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td style={{ fontWeight: 600, color: '#e0f2fe' }}>{item.state}</td>
                        <td style={{ 
                          color: item.percent_safe > 70 ? '#10b981' : item.percent_safe > 40 ? '#f59e0b' : '#ef4444',
                          fontWeight: 700 
                        }}>
                          {item.percent_safe != null ? item.percent_safe.toFixed(1) + '%' : 'N/A'}
                        </td>
                        <td>{item.total_blocks}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </EnhancedTable>
              </div>
            )}
          </EnhancedGlassCard>
        </AnimatePresence>
      </GridContainer>
    </DashboardContainer>
  );
}
