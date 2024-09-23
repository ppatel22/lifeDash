import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

function ProductivitySummary() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keypressData, setKeypressData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const fetchProductivityData = async () => {
    try {
      const response = await axios.get('/api/productivity-summary', {
        params: { start_date: startDate, end_date: endDate }
      });
      setKeypressData(response.data.keypress_data);
      setCategoryData(response.data.category_data);
    } catch (error) {
      console.error('Error fetching productivity data:', error);
    }
  };

  useEffect(() => {
    if (keypressData.length > 0) {
      drawLineChart();
    }
  }, [keypressData]);

  useEffect(() => {
    if (Object.keys(categoryData).length > 0) {
      drawPieChart();
    }
  }, [categoryData]);

  const drawLineChart = () => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(lineChartRef.current).selectAll("*").remove();

    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(keypressData, d => new Date(d.timestamp)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(keypressData, d => d.count)])
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.count));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(keypressData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  const drawPieChart = () => {
    const width = 450;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    d3.select(pieChartRef.current).selectAll("*").remove();

    const svg = d3.select(pieChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.value);

    const data_ready = pie(Object.entries(categoryData).map(([key, value]) => ({key, value})));

    svg.selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', d => color(d.data.key))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);
  };

  return (
    <div className="productivity-summary">
      <h2>Productivity Summary</h2>
      <div className="date-inputs">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchProductivityData}>Get Summary</button>
      </div>
      {keypressData.length > 0 && (
        <div className="keypress-chart">
          <h3>Keypresses Over Time</h3>
          <div ref={lineChartRef}></div>
        </div>
      )}
      {Object.keys(categoryData).length > 0 && (
        <div className="category-chart">
          <h3>Category Distribution</h3>
          <div ref={pieChartRef}></div>
        </div>
      )}
    </div>
  );
}

export default ProductivitySummary;