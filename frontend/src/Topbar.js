import React from "react";
import { FaSearch, FaGlobe } from "react-icons/fa";
import { TopbarContainer, Pill } from "./DesignSystem";

export default function Topbar({ language, setLanguage, onSearch, searchValue, setSearchValue }) {
  return (
    <TopbarContainer initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Pill>INGRES Pro</Pill>
        <div style={{ color: '#0e7490', fontWeight: 700 }}>Groundwater Intelligence</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '50%' }}>
        <div className="glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 12 }}>
          <FaSearch size={14} color="#0e7490" />
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
            placeholder="Ask about states, districts, years, recharge, extraction..."
            aria-label="Topbar search"
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: 8, width: '100%', color: '#0f172a' }}
          />
        </div>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12 }}>
          <FaGlobe size={14} color="#0e7490" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#0f172a' }}
          >
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "Hindi" },
              { code: "ta", label: "Tamil" },
              { code: "te", label: "Telugu" },
              { code: "bn", label: "Bengali" },
              { code: "mr", label: "Marathi" },
            ].map(opt => (
              <option key={opt.code} value={opt.code}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </TopbarContainer>
  );
}


