import { Col, Row } from 'antd';
import * as d3 from 'd3';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphEmbeddingByCommunity } from '../api/graph';

const GraphEmbedding: React.FC<{}> = () => {
    const {embeddingGraph} = useSelector((store: any)=>store.graph);
    const matrixRef:LegacyRef<SVGSVGElement> = createRef();
    const scatterRef:LegacyRef<SVGSVGElement> = createRef();
    useEffect(()=>{
        if(embeddingGraph != undefined){
            getGraphEmbeddingByCommunity({community:embeddingGraph}).then(res=>{
                const { embedding, pos, id } = res.data; 
                initMatrix(embedding);
                initScatter(pos);
            })
        }
    },[embeddingGraph]);

    const initScatter = (pos: any) => {
        const svg = d3.select(scatterRef?.current);
        const height = document.getElementById("scatter")?.clientHeight;
        const width = document.getElementById("scatter")?.clientWidth;
        const margin = {left: 20, top: 10, right: 10 , bottom: 20};
        svg.selectChildren().remove();
        const xMin = d3.min(pos, (node:number[])=>node[0]);
        const xMax = d3.max(pos, (node: number[])=>node[0]);
        const yMin = d3.min(pos, (node:number[])=>node[1]);
        const yMax = d3.max(pos, (node: number[])=>node[1]);
        const xScale = d3.scaleLinear()
            .domain([xMin as number, xMax as number])
            .rangeRound([margin.left, width as number - margin.right]);
        const yScale = d3.scaleLinear()
            .domain([yMin as number, yMax as number])
            .rangeRound([height as number - margin.bottom, margin.top]);
        const xAxis = svg.append('g')
            .call(d3.axisBottom(xScale))
            .attr("transform", `translate(0,${(height as number-margin.bottom)})`);
        const yAxis = svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5))
            .attr("transform", `translate(${margin.left},0)`);
        const radius = 4;
        const color = "#26c0c7";
        const stroke = "#0f7d89";
        svg.append('g')
            .selectAll('circle')
            .data(pos)
            .join('circle')
            .attr('cx', (d: any)=>xScale(d[0]))
            .attr('cy', (d: any)=>yScale(d[1]))
            .attr('r', radius)
            .attr('fill', color)
            .attr('stroke', stroke)
            .attr('opacity', 0.5);
        
    }

    const initMatrix = (embedding: any) => {

    }

    return (
        <div style={{width:'100%', height:'100%'}}>
            <Row style={{width:"100%", height:"100%"}}>
                <Col span={16}>
                    <div style={{padding:"0.5vw", width:"100%", height:"100%", boxSizing:"border-box"}}>
                        <svg ref={matrixRef} id='matrix' width={"100%"} height={"100%"}></svg>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{padding:"0.5vw", width:"100%", height:"100%", boxSizing:"border-box"}}>
                        <svg ref={scatterRef} id='scatter' width={"100%"} height={"100%"}></svg>
                    </div>
                </Col>
            </Row>
       </div>);
};

export default GraphEmbedding