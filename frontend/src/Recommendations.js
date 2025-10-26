import React from "react";

function getRecommendations(table) {
  if (!table || table.length === 0) return null;
  // Look for stage_of_ground_water_extraction_pct or similar
  const stageCol = Object.keys(table[0]).find(col => /stage.*extraction.*pct/i.test(col));
  if (!stageCol) return null;
  // Use first row for demo (can be extended)
  const stage = table[0][stageCol];
  if (typeof stage !== "number") return null;
  if (stage > 100) {
    return "Over-Exploited: suggest drip irrigation, restrict borewells, recharge structures.";
  } else if (stage >= 70 && stage <= 90) {
    return "Semi-Critical: encourage efficient irrigation and rainwater harvesting.";
  } else if (stage < 70) {
    return "Safe: Maintain current practices, encourage recharge programs.";
  }
  return null;
}

export default function Recommendations({ table }) {
  const rec = getRecommendations(table);
  if (!rec) return null;
  return (
    <div style={{ background: "#e0f2f1", color: "#00796b", padding: "16px", borderRadius: "12px", marginTop: "18px", fontWeight: 500 }}>
      <span>Policy Recommendation: </span>{rec}
    </div>
  );
}
