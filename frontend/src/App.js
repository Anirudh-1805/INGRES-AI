import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaDownload, FaChartBar, FaMagic } from "react-icons/fa";
import { IoSparkles, IoWater, IoStatsChart } from "react-icons/io5";
import Sidebar from "./Sidebar";
import ChartRenderer from "./ChartRenderer";
import { saveAs } from "file-saver";
import Recommendations from "./Recommendations";
import HolisticView from "./HolisticView";
import Forecasting from "./Forecasting";
import Topbar from "./Topbar";
import { GlassCard, PageShell, MainContent, theme } from "./DesignSystem";
import Landing from "./Landing";
import Footer from "./Footer";

// Enhanced Styled Components
const Spinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(34, 211, 238, 0.3);
  border-top: 3px solid #22d3ee;
  border-radius: 50%;
  margin: 24px auto;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top: 3px solid #3b82f6;
    animation: spin 1.5s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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

const TableContainer = styled(motion.div)`
  width: 100%;
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  
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

const StyledTable = styled.table`
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
  }
`;

const ExportButton = styled(motion.button)`
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
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

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #082f49 50%, #0a0f2b 100%);
  overflow: hidden;
  position: relative;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  position: relative;
  z-index: 2;
`;

const Header = styled(motion.h1)`
  font-size: 3.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.5px;
`;

const SubHeader = styled(motion.p)`
  color: #cbd5e1;
  font-size: 1.3rem;
  margin-bottom: 40px;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
`;

const ChatWindow = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  height: 65vh;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  padding: 30px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  overflow-y: auto;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
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

const Bubble = styled(motion.div)`
  max-width: 75%;
  margin-bottom: 20px;
  align-self: ${props => (props.user ? "flex-end" : "flex-start")};
  background: ${props => props.user 
    ? "linear-gradient(135deg, #22d3ee, #3b82f6)" 
    : "rgba(255, 255, 255, 0.1)"};
  color: ${props => props.user ? "#fff" : "#e0f2fe"};
  border-radius: 20px;
  padding: 16px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  border: ${props => props.user ? "none" : "1px solid rgba(34, 211, 238, 0.2)"};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    ${props => props.user ? "right: -8px" : "left: -8px"};
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-${props => props.user ? "left" : "right"}-color: ${props => props.user 
      ? "#3b82f6" 
      : "rgba(255, 255, 255, 0.1)"};
  }
`;

const InputRow = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  font-size: 1.1rem;
  margin-right: 12px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(34, 211, 238, 0.5);
    background: rgba(255, 255, 255, 0.12);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const IconButton = styled(motion.button)`
  background: ${props => props.recognizing 
    ? "linear-gradient(135deg, #ef4444, #dc2626)" 
    : "linear-gradient(135deg, #22d3ee, #3b82f6)"};
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  cursor: pointer;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const PromptSuggestions = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PromptButton = styled(motion.button)`
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 12px;
  padding: 10px 16px;
  color: #e0f2fe;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(34, 211, 238, 0.2);
    transform: translateY(-2px);
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22d3ee;
  font-style: italic;
  margin: 8px 0;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #22d3ee;
  border-radius: 50%;
`;

function App() {
  const [selectedPage, setSelectedPage] = useState(0);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI groundwater assistant. I can help you analyze data, generate charts, and provide insights about groundwater resources across India.", 
      user: false 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState(null);
  const [language, setLanguage] = useState("en");
  const [recognizing, setRecognizing] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [particles, setParticles] = useState([]);
  const chatEndRef = useRef(null);

  const promptSuggestions = [
    "Show groundwater recharge trends in Maharashtra (2018-2024)",
    "Show rainfall total values in Tamilnadu for 2024",
    "Compare extraction rates across top 5 districts",
    "Water quality analysis for coastal regions",    
    "Identify critical zones needing intervention"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
    { code: "bn", label: "Bengali" },
    { code: "mr", label: "Marathi" },
    { code: "gu", label: "Gujarati" },
    { code: "kn", label: "Kannada" },
    { code: "ml", label: "Malayalam" },
    { code: "pa", label: "Punjabi" },
    { code: "or", label: "Odia" },
    { code: "as", label: "Assamese" },
    { code: "ur", label: "Urdu" },
    { code: "sd", label: "Sindhi" },
    { code: "sa", label: "Sanskrit" },
    { code: "ne", label: "Nepali" },
    { code: "kok", label: "Konkani" },
    { code: "mai", label: "Maithili" },
    { code: "ks", label: "Kashmiri" },
    { code: "doi", label: "Dogri" }
  ];

  const getSpeechLangCode = (code) => {
    const map = {
      en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN",
      mr: "mr-IN", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN",
      or: "or-IN", as: "as-IN", ur: "ur-IN", sd: "sd-IN", sa: "sa-IN",
      ne: "ne-NP", kok: "kok-IN", mai: "mai-IN", ks: "ks-IN", doi: "doi-IN"
    };
    return map[code] || "en-IN";
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLangCode(language);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setRecognizing(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setRecognizing(false);
    };
    
    recognition.onerror = (event) => {
      setRecognizing(false);
      alert("Speech recognition error: " + event.error);
    };
    
    recognition.onend = () => {
      setRecognizing(false);
    };
    
    recognition.start();
  };

  const sendMessage = async (customMessage = null) => {
    const question = customMessage || input.trim() || searchValue.trim();
    if (!question) return;
    
    setMessages([...messages, { text: question, user: true }]);
    setLoading(true);
    setInput("");
    setSearchValue("");
    setTable(null);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language })
      });
      const data = await res.json();
      setMessages(msgs => [
        ...msgs,
        { text: data.answer, user: false }
      ]);
      setTable(data.table);
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { text: "🚨 Error: Could not connect to the analytics engine. Please try again.", user: false }
      ]);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (!table || table.length === 0) return;
    
    const cols = Object.keys(table[0]);
    const csvRows = [cols.join(",")].concat(
      table.map(row => cols.map(col => JSON.stringify(row[col] ?? "")).join(","))
    );
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `groundwater_analysis_${new Date().getTime()}.csv`);
  };

  return (
    <Container>
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

      <Sidebar onSelect={setSelectedPage} selected={selectedPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar
          language={language}
          setLanguage={setLanguage}
          onSearch={sendMessage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <Main>
          <AnimatePresence mode="wait">
            {selectedPage === 0 && (
              <Landing onGetStarted={() => setSelectedPage(1)} />
            )}
            
            {selectedPage === 1 && (
              <motion.div
                key="chatbot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: 900 }}
              >
                <Header
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  AI Groundwater Intelligence
                </Header>
                <SubHeader
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Conversational analytics with real-time insights and predictive capabilities
                </SubHeader>

                <PromptSuggestions
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {promptSuggestions.map((prompt, index) => (
                    <PromptButton
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </PromptButton>
                  ))}
                </PromptSuggestions>

                <GlassCard
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(34, 211, 238, 0.3)'
                  }}
                >
                  <ChatWindow>
                    {messages.map((msg, idx) => (
                      <Bubble
                        key={idx}
                        user={msg.user}
                        initial={{ x: msg.user ? 100 : -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          {msg.user ? <FaUser size={14} /> : <FaRobot size={14} />}
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {msg.user ? 'You' : 'AquaAI'}
                          </span>
                        </div>
                        {msg.text}
                      </Bubble>
                    ))}
                    
                    {loading && (
                      <TypingIndicator>
                        <span>AquaAI is analyzing...</span>
                        <Dot animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                        <Dot animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                        <Dot animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                      </TypingIndicator>
                    )}
                    
                    <div ref={chatEndRef} />
                  </ChatWindow>

                  {table && table.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ExportButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportToCSV}
                      >
                        <FaDownload />
                        Export Analysis Data
                      </ExportButton>
                      
                      <TableContainer>
                        <StyledTable>
                          <thead>
                            <tr>
                              {Object.keys(table[0]).map((col, i) => (
                                <th key={i} scope="col">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((val, j) => (
                                  <td key={j}>{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </StyledTable>
                      </TableContainer>
                      
                      <ChartRenderer table={table} showAxisLabels={true} />
                      <Recommendations table={table} />
                    </motion.div>
                  )}
                </GlassCard>

                <InputRow
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <IconButton
                    recognizing={recognizing}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMicClick}
                    disabled={recognizing}
                    title={recognizing ? "Listening..." : "Speak"}
                  >
                    <FaMicrophone />
                  </IconButton>
                  
                  <Input
                    type="text"
                    placeholder="Ask about groundwater data, trends, predictions..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    aria-label="Chat input"
                  />
                  
                  <IconButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendMessage()}
                    aria-label="Send message"
                  >
                    <FaPaperPlane />
                  </IconButton>
                </InputRow>
              </motion.div>
            )}
            
            {selectedPage === 2 && <HolisticView />}
            {selectedPage === 3 && <Forecasting selectedPage={selectedPage} setSelectedPage={setSelectedPage} />}
          </AnimatePresence>
        </Main>
        <Footer />
      </div>
    </Container>
  );
}

export default App;