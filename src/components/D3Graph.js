import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function D3Graph() {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%");

        function render() {
            const data = window.STRULDEL_LOG || [];

            const width = svgRef.current.clientWidth;
            const height = svgRef.current.clientHeight;

            svg.selectAll("*").remove();

            if (!data.length) return;

            const x = d3.scaleBand()
                .domain(d3.range(data.length))
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([height, 0]);

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", (_, i) => x(i))
                .attr("y", d => y(d))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d))
                .attr("fill", "rgba(0,255,200,0.85)")
                .attr("rx", 3);
        }

        const interval = setInterval(render, 120);
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="visualizer-wrapper">
            <div className="visualizer-grid">
                <svg ref={svgRef} className="d3-graph"></svg>
            </div>
        </div>
    );
}
