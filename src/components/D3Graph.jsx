// src/components/D3Graph.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function D3Graph() {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    // Listen for d3Data events from console-monkey-patch / Strudel .log()
    useEffect(() => {
        function handle(event) {
            const arr = event.detail || [];
            // Copy into state so React/D3 can re-render
            setData([...arr]);
        }

        document.addEventListener("d3Data", handle);
        return () => document.removeEventListener("d3Data", handle);
    }, []);

    // Draw/update graph whenever data changes
    useEffect(() => {
        const svgEl = svgRef.current;
        if (!svgEl) return;

        const svg = d3.select(svgEl);
        const width = svgEl.clientWidth || 320;
        const height = svgEl.clientHeight || 160;

        svg.attr("viewBox", `0 0 ${width} ${height}`);
        svg.selectAll("*").remove();

        if (!data.length) return;

        const margin = { top: 10, right: 10, bottom: 20, left: 30 };

        const x = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data))
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x((d, i) => x(i))
            .y((d) => y(d))
            .curve(d3.curveMonotoneX);

        // Line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#22d3ee")
            .attr("stroke-width", 2)
            .attr("d", line);

        // X axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
            .selectAll("text")
            .attr("fill", "#9ca3af");

        // Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(4))
            .selectAll("text")
            .attr("fill", "#9ca3af");

    }, [data]);

    return (
        <div className="visualizer-wrapper mt-3">
            <div className="visualizer-grid">
                <svg ref={svgRef} className="visualizer-canvas d3-graph" />
            </div>
        </div>
    );
}
