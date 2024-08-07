// PieChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);    // Ref to access the canvas element
  const chartInstanceRef = useRef(null);  // Ref to store the Chart.js instance

  // Effect hook to initialize or update the chart
  useEffect(() => {

    // Get the 2D rendering context of the canvas
    if (!chartInstanceRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Create a new Chart.js instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut', 
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Pie Chart',
            data: data.values,
            backgroundColor: data.colors,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '48%' 
        },
      });
    } else {
      // If chart instance exists, update the data and re-render
      chartInstanceRef.current.data.datasets[0].data = data.values;
      chartInstanceRef.current.update();
    }
  }, [data]);

  return (
    // <div>
      <canvas ref={chartRef} />
    // </div>
  );
};

export default PieChart;
