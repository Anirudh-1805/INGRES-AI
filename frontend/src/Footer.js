import React from "react";

export default function Footer() {
  return (
    <div style={{ width: '100%', padding: '14px 20px', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 700 }}>INGRES Pro</div>
      <div style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} Groundwater Intelligence</div>
    </div>
  );
}


