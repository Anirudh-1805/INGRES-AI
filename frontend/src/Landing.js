import React from "react";
import { motion } from "framer-motion";
import { GlassCard, GradientButton } from "./DesignSystem";
import { 
  FaChartLine, 
  FaComments, 
  FaGlobeAsia, 
  FaCloudDownloadAlt,
  FaShieldAlt,
  FaRocket,
  FaWaveSquare,
  FaBrain,
  FaWater,
  FaMapMarkedAlt
} from "react-icons/fa";
import { IoStatsChart, IoSpeedometer } from "react-icons/io5";

export default function Landing({ onGetStarted }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseGlow = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 20px rgba(14, 116, 144, 0.3)",
      "0 0 40px rgba(14, 116, 144, 0.6)",
      "0 0 20px rgba(14, 116, 144, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const features = [
    {
      icon: <FaBrain />,
      title: 'AI-Powered Insights',
      desc: 'Advanced machine learning algorithms analyze groundwater patterns with unprecedented accuracy.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaWaveSquare />,
      title: 'Real-time Monitoring',
      desc: 'Live data streams from thousands of monitoring stations across the nation.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaMapMarkedAlt />,
      title: 'Interactive Geospatial',
      desc: '3D maps and heatmaps showing groundwater levels and quality trends.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <IoSpeedometer />,
      title: 'Lightning Fast',
      desc: 'Process millions of data points in seconds with our optimized infrastructure.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Enterprise Security',
      desc: 'Enterprise-grade encryption and compliance with global data protection standards.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <FaRocket />,
      title: 'Future Forecasting',
      desc: 'Predict groundwater trends 10 years ahead with high accuracy.',
      color: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 50%, #0a0f2b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(14, 116, 144, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
        animate={floatAnimation}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
        animate={{
          ...floatAnimation,
          y: [0, 30, 0]
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, padding: '60px 40px' }}>
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gap: 60, 
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <motion.div variants={itemVariants}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                padding: '8px 16px',
                borderRadius: 20,
                display: 'inline-block',
                marginBottom: 20,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'white'
              }}
            >
              🚀 NEXT GENERATION PLATFORM
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              style={{ 
                fontSize: '3.5rem', 
                lineHeight: 1.1, 
                margin: 0, 
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                marginBottom: 24
              }}
            >
              Intelligent Groundwater
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Analytics Platform
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              style={{ 
                fontSize: '1.3rem',
                marginTop: 12, 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 640,
                lineHeight: 1.6,
                marginBottom: 40
              }}
            >
              Harness the power of AI to transform groundwater management. 
              Real-time insights, predictive analytics, and comprehensive 
              dashboards for sustainable water resource management.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              style={{ display: 'flex', gap: 20, marginTop: 18, alignItems: 'center' }}
            >
              <GradientButton 
                size="large"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' 
                }} 
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                style={{
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                <FaRocket style={{ marginRight: 8 }} />
                Launch Dashboard
              </GradientButton>
              
              <motion.a 
                href="#features"
                whileHover={{ x: 5 }}
                style={{ 
                  color: '#e0f2fe', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                Watch Demo Video
                <span style={{ fontSize: '1.2rem' }}>🎬</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              style={{ 
                display: 'flex', 
                gap: 40, 
                marginTop: 60,
                padding: 30,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 20,
                backdropFilter: 'blur(10px)'
              }}
            >
              {[
                { number: '10K+', label: 'Monitoring Wells' },
                { number: '95%', label: 'Accuracy Rate' },
                { number: '24/7', label: 'Real-time Data' },
                { number: '4', label: 'AI Models' }
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            variants={itemVariants}
            style={{ position: 'relative' }}
          >
            <motion.div
              animate={pulseGlow}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            
            <GlassCard 
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ 
                padding: 30,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)'
              }} />
              
              <div style={{ 
                height: 300, 
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.3), rgba(139, 92, 246, 0.3))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <FaWater size={80} color="#22d3ee" style={{ opacity: 0.7 }} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    border: '2px dashed rgba(34, 211, 238, 0.3)',
                    borderRadius: '50%'
                  }}
                />
              </div>
              
              <div style={{ 
                marginTop: 20, 
                color: '#22d3ee', 
                fontWeight: 700,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔥
                </motion.div>
                Live AI Analytics Dashboard
              </div>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section id="features" style={{ marginTop: 120 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              padding: '8px 24px',
              borderRadius: 25,
              display: 'inline-block',
              marginBottom: 20,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              ✨ POWERFUL FEATURES
            </div>
            <h2 style={{
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              margin: '10px 0'
            }}>
              Enterprise-Grade Capabilities
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
              Everything you need to master groundwater intelligence in one powerful platform
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 30,
            marginTop: 50
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <GlassCard style={{
                  padding: 30,
                  height: '100%',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${feature.color.split(' ').map(c => c.replace('from-', '').replace('to-', '')).join(', ')})`
                  }} />
                  
                  <div style={{
                    background: `linear-gradient(135deg, ${feature.color})`,
                    width: 60,
                    height: 60,
                    borderRadius: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}>
                    <div style={{ fontSize: 24, color: 'white' }}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    marginBottom: 15
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.6,
                    fontSize: '1rem'
                  }}>
                    {feature.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            marginTop: 120,
            textAlign: 'center',
            padding: '80px 40px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: 40,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
          }} />
          
          <motion.h2
            style={{
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              marginBottom: 20,
              position: 'relative',
              zIndex: 2
            }}
          >
            Ready to Transform Your Water Management?
          </motion.h2>
          
          <motion.p
            style={{
              color: '#cbd5e1',
              fontSize: '1.3rem',
              maxWidth: 600,
              margin: '0 auto 40px',
              position: 'relative',
              zIndex: 2
            }}
          >
            Join thousands of organizations using our platform to make data-driven decisions
          </motion.p>
          
          <GradientButton
            size="large"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            style={{
              padding: '20px 40px',
              fontSize: '1.2rem',
              fontWeight: 600,
              position: 'relative',
              zIndex: 2
            }}
          >
            <FaRocket style={{ marginRight: 10 }} />
            Start Your Free Trial
          </GradientButton>
        </motion.section>
      </div>
    </div>
  );
}