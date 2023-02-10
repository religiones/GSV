import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Combine } from './@types/graph-view';
import * as d3 from 'd3';

const NodesDistanceView: React.FC<{}> = () => {
    const {combineNodes} = useSelector((store:any) => store.graph);
    const graphRef:LegacyRef<SVGSVGElement> = createRef();
    const margin = 5;
    const barPadding = 15;
    const barHeight = 30;
    const barColor = "#68bb8c";
    useEffect(()=>{
        if(combineNodes != undefined){
            initGraph(combineNodes["combine"]);
        }
    },[combineNodes]);

    const initGraph = (combine:Combine) => {
        if(graphRef.current != undefined){
            const svg = d3.select(graphRef.current);
            svg.selectChildren().remove();
            const container = document.getElementById("nodes-distance");
            const width = container?.clientWidth as number;
            const height = container?.clientHeight as number;

            svg.attr("viewBox",[0,0,width,height]);
            const min = d3.min(combine["distance"]) as number;
            const max = d3.max(combine["distance"]) as number;
            const normalize = d3.scaleLinear().domain([min, max]).range([0, 1]); // linear
            const {nodes, distance} = combine;
            let data:{label:string, value: number}[] = [];
            for(let i = 0; i < nodes.length; i++){
                data.push({label:nodes[i],value:distance[i]});
            }
            console.log(min,max,width);
            const xScale = d3.scaleLinear().domain([min, max]).range([margin,width-margin]);
            const yScale = d3.scaleBand().domain(nodes).range([height-margin, margin]).padding(0.2);
            const xAxis = (g:any) => g.attr("transform",`translate(0,${height-margin})`)
                .call(d3.axisBottom(xScale).ticks(width/100));
            const yAxis = (g: any) => g.attr("transform",`translate(${margin}, 0)`)
                .call(d3.axisLeft(yScale).tickSizeOuter(0));
            console.log(data);
            svg.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", (d:any)=>xScale(0))
                .attr("y", (d:any)=>yScale(d.label) as number)
                .attr("width", (d:any)=>xScale(d.value)-xScale(0))
                .attr("height", yScale.bandwidth)
                .attr("fill", (d: any)=>{
                    return d3.interpolateRgb('#68bb8c88',barColor)(normalize(d.value));
                })
                .on("click",function(e){
                    const data = e.target.__data__;
                    console.log(data);
                });
        }else{
            console.log("cannot get graph Ref");
        }
    }

    return (
        <div style={{width:'100%', height:'100%'}}>
            <div id="nodes-distance" style={{width:"100%", height:"100%",overflowY:"hidden"}}>
                <svg ref={graphRef}></svg>
            </div>
       </div>);
};

export default NodesDistanceView