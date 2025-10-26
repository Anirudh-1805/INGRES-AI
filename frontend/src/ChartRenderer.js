import React from "react";
import Plot from "react-plotly.js";
import { motion } from "framer-motion";
import styled from "styled-components";

// Enhanced detection function based on your actual database schema
function detectChartType(table) {
  if (!table || table.length === 0) return null;
  
  const columns = Object.keys(table[0]);
  const firstRow = table[0];

  // Priority groundwater metrics from your schema
  const groundwaterMetrics = [
    // Recharge metrics
    'total_annual_ground_water_recharge_ham',
    'recharge_from_rainfall_mon',
    'recharge_from_other_sources_mon',
    'recharge_from_rainfall_nm',
    'recharge_from_other_sources_nm',
    'annual_gw_recharge_total',
    'gw_recharge_total',
    
    // Extraction metrics
    'total_extraction_ham',
    'extraction_total',
    'irrigation_use_ham',
    'industrial_use_ham',
    'domestic_use_ham',
    'extraction_irrigation_total',
    'extraction_industrial_total',
    'extraction_domestic_total',
    
    // Percentage metrics
    'stage_of_ground_water_extraction_pct',
    'stage_extraction_pct_total',
    
    // Availability metrics
    'annual_extractable_ground_water_resource_ham',
    'net_ground_water_availability_for_future_use_ham',
    'annual_extractable_resource_total',
    'net_availability_future_use_total',
    
    // Area metrics
    'total_geographical_area',
    'recharge_worthy_area',
    
    // Rainfall metrics
    'rainfall_mm_total',
    'rainfall_mm_c',
    'rainfall_mm_nc',
    'rainfall_mm_pq'
  ];

  // Dimension columns for X-axis
  const dimensionColumns = [
    'year',
    'state',
    'district',
    'assessment_unit_name',
    'categorization',
    'assessment_unit_type'
  ];

  // Find the best Y-axis column (numeric groundwater data)
  let yColumn = null;
  for (const col of groundwaterMetrics) {
    if (columns.includes(col) && firstRow[col] != null) {
      const sampleValue = firstRow[col];
      if (typeof sampleValue === 'number' || 
          (typeof sampleValue === 'string' && !isNaN(parseFloat(sampleValue)) && parseFloat(sampleValue) !== 0)) {
        yColumn = col;
        break;
      }
    }
  }

  // Fallback: any numeric column that's not an ID
  if (!yColumn) {
    const numericColumns = columns.filter(col => {
      if (col.toLowerCase().includes('id') || col.toLowerCase().includes('code')) return false;
      const sampleValue = firstRow[col];
      return sampleValue != null && (typeof sampleValue === 'number' || 
             (typeof sampleValue === 'string' && !isNaN(parseFloat(sampleValue))));
    });
    if (numericColumns.length > 0) {
      yColumn = numericColumns[0];
    }
  }

  // Find the best X-axis column
  let xColumn = null;
  for (const col of dimensionColumns) {
    if (columns.includes(col) && firstRow[col] != null) {
      xColumn = col;
      break;
    }
  }

  // Fallback: first non-ID column
  if (!xColumn) {
    const nonIdColumns = columns.filter(col => 
      !col.toLowerCase().includes('id') && !col.toLowerCase().includes('code')
    );
    if (nonIdColumns.length > 0) {
      xColumn = nonIdColumns[0];
    } else {
      xColumn = columns[0];
    }
  }

  if (!xColumn || !yColumn) return null;

  // Determine chart type based on data characteristics
  const xValues = table.map(row => row[xColumn]);
  const uniqueXValues = [...new Set(xValues)];
  
  if (xColumn === 'year' || (xColumn.includes('year') && uniqueXValues.length > 3)) {
    return { type: "line", x: xColumn, y: yColumn, subtype: "trend" };
  }
  
  if (uniqueXValues.length <= 8) {
    return { type: "bar", x: xColumn, y: yColumn, subtype: "comparison" };
  }
  
  if (yColumn.includes('pct') || yColumn.includes('percentage')) {
    return { type: "pie", labels: xColumn, values: yColumn, subtype: "distribution" };
  }

  return { type: "bar", x: xColumn, y: yColumn, subtype: "default" };
}

// Styled Components
const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 30px;
  margin: 24px 0;
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
    border-radius: 16px 16px 0 0;
  }
`;

const ChartTitle = styled.h3`
  color: #e0f2fe;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #cbd5e1;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
`;

// Helper function to format column names for display
const formatColumnName = (colName) => {
  return colName
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Ham\b/g, 'HAM')
    .replace(/Mm\b/g, 'mm')
    .replace(/Pct\b/g, '%');
};

// Helper function to get meaningful chart title
const getChartTitle = (chartConfig, table) => {
  const yLabel = formatColumnName(chartConfig.y);
  const xLabel = formatColumnName(chartConfig.x);
  
  if (chartConfig.type === 'line') {
    return `${yLabel} Trends Over ${xLabel}`;
  } else if (chartConfig.type === 'bar') {
    return `${yLabel} by ${xLabel}`;
  } else if (chartConfig.type === 'pie') {
    return `Distribution of ${yLabel} by ${xLabel}`;
  }
  
  return `${yLabel} vs ${xLabel}`;
};

export default function ChartRenderer({ table, showAxisLabels }) {
  const chartConfig = detectChartType(table);
  
  if (!chartConfig) {
    return (
      <ChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NoDataMessage>
          📊 No meaningful groundwater data found for visualization.
          <div style={{ fontSize: '0.9rem', marginTop: 8, opacity: 0.8 }}>
            Try queries like: "show recharge trends by year", "compare extraction by state", 
            "groundwater levels by district"
          </div>
        </NoDataMessage>
      </ChartContainer>
    );
  }

  // Prepare data for plotting with proper numeric conversion
  const xData = table.map(row => {
    const val = row[chartConfig.x];
    // Convert year to number if it's a string year
    if (chartConfig.x === 'year' && typeof val === 'string' && /^\d{4}$/.test(val)) {
      return parseInt(val);
    }
    return val;
  });
  
  const yData = table.map(row => {
    const val = row[chartConfig.y];
    return typeof val === 'number' ? val : parseFloat(val) || 0;
  });

  // Chart configuration
  const layout = {
    title: {
      text: getChartTitle(chartConfig, table),
      font: { color: '#ffffff', size: 16, family: 'Arial' }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(255,255,255,0.05)',
    font: { color: '#e0f2fe' },
    margin: { t: 60, r: 40, b: 80, l: 80 },
    xaxis: {
      title: showAxisLabels ? { 
        text: formatColumnName(chartConfig.x), 
        font: { color: '#cbd5e1', size: 12 } 
      } : undefined,
      gridcolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#cbd5e1', size: 10 },
      tickangle: xData.length > 6 ? -45 : 0
    },
    yaxis: {
      title: showAxisLabels ? { 
        text: formatColumnName(chartConfig.y), 
        font: { color: '#cbd5e1', size: 12 } 
      } : undefined,
      gridcolor: 'rgba(255,255,255,0.1)',
      tickfont: { color: '#cbd5e1', size: 10 }
    },
    legend: {
      font: { color: '#cbd5e1', size: 10 },
      orientation: 'h',
      y: -0.3
    },
    showlegend: chartConfig.type === 'line'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    modeBarButtonsToAdd: ['resetScale2d']
  };

  // Color coding based on metric type
  const getColors = () => {
    if (chartConfig.y.includes('recharge')) {
      return { primary: '#10b981', secondary: 'rgba(16, 185, 129, 0.1)' };
    } else if (chartConfig.y.includes('extraction')) {
      return { primary: '#ef4444', secondary: 'rgba(239, 68, 68, 0.1)' };
    } else if (chartConfig.y.includes('stage') || chartConfig.y.includes('pct')) {
      return { primary: '#f59e0b', secondary: 'rgba(245, 158, 11, 0.1)' };
    } else {
      return { primary: '#3b82f6', secondary: 'rgba(59, 130, 246, 0.1)' };
    }
  };

  const colors = getColors();

  if (chartConfig.type === "line") {
    return (
      <ChartContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartTitle>Groundwater Trend Analysis</ChartTitle>
        <Plot
          data={[{
            x: xData,
            y: yData,
            type: "scatter",
            mode: "lines+markers",
            line: { 
              color: colors.primary,
              width: 4,
              shape: 'spline'
            },
            marker: { 
              color: colors.primary,
              size: 8,
              line: { color: '#ffffff', width: 2 }
            },
            fill: 'tozeroy',
            fillcolor: colors.secondary,
            name: formatColumnName(chartConfig.y)
          }]}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "400px" }}
        />
      </ChartContainer>
    );
  }

  if (chartConfig.type === "bar") {
    return (
      <ChartContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartTitle>Groundwater Comparison</ChartTitle>
        <Plot
          data={[{
            x: xData,
            y: yData,
            type: "bar",
            marker: { 
              color: yData.map(val => {
                // Color bars based on values for extraction percentages
                if (chartConfig.y.includes('extraction') || chartConfig.y.includes('stage')) {
                  if (val > 100) return '#ef4444';    // Critical - red
                  if (val > 80) return '#f59e0b';     // High - orange
                  if (val > 60) return '#eab308';     // Medium - yellow
                  return '#10b981';                   // Safe - green
                }
                return colors.primary;
              }),
              line: { color: '#ffffff', width: 1 }
            },
            text: yData.map(val => val.toFixed(2)),
            textposition: 'auto',
            name: formatColumnName(chartConfig.y)
          }]}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "400px" }}
        />
      </ChartContainer>
    );
  }

  if (chartConfig.type === "pie") {
    return (
      <ChartContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartTitle>Groundwater Distribution</ChartTitle>
        <Plot
          data={[{
            labels: xData,
            values: yData,
            type: "pie",
            hole: 0.4,
            marker: {
              colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']
            },
            textinfo: 'label+percent',
            hoverinfo: 'label+value+percent',
          }]}
          layout={{
            ...layout,
            showlegend: true,
            legend: {
              font: { color: '#cbd5e1' },
              orientation: 'v'
            }
          }}
          config={config}
          style={{ width: "100%", height: "400px" }}
        />
      </ChartContainer>
    );
  }

  // Fallback to bar chart
  return (
    <ChartContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChartTitle>Groundwater Data Visualization</ChartTitle>
      <Plot
        data={[{
          x: xData,
          y: yData,
          type: "bar",
          marker: { color: colors.primary }
        }]}
        layout={layout}
        config={config}
        style={{ width: "100%", height: "400px" }}
      />
    </ChartContainer>
  );
}