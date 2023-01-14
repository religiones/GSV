import { Col, Row } from 'antd';
import * as d3 from 'd3';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphEmbeddingByCommunity } from '../api/graph';

const GraphEmbedding: React.FC<{}> = () => {
    const {embeddingGraph} = useSelector((store: any)=>store.graph);
    const matrixRef:LegacyRef<HTMLCanvasElement> = createRef();
    const scatterRef:LegacyRef<SVGSVGElement> = createRef();
    useEffect(()=>{
        if(embeddingGraph != undefined){
            getGraphEmbeddingByCommunity({community:embeddingGraph}).then(res=>{
                const { embedding, pos, id } = res.data; 
                setTimeout(()=>{
                    initMatrix(embedding);
                    initScatter(pos);
                },200);
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

    const initMatrix = (embedding: number[][]) => {
        const canvas = matrixRef?.current;
        const nodeNum = embedding.length;
        const rectWidth = 4;
        const rectHeight = canvas?.clientHeight as number/128;
        const min = d3.min(embedding,(embedding:number[])=>d3.min(embedding));
        const max = d3.max(embedding, (embedding:number[])=>d3.max(embedding));
        const colorScale = d3.scaleSequential(d3.interpolateBuGn).domain([min as number,max as number]);
        canvas?.setAttribute("width", (nodeNum*rectWidth).toString());
        if(canvas?.getContext){
            const context = canvas.getContext("2d");
            if(context != null){
                context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
                for(let i = 0; i < embedding.length; i++){
                    for(let j = 0; j < embedding[i].length; j++){
                        context.fillStyle = colorScale(embedding[i][j]);
                        context.fillRect(i*rectWidth,j*rectHeight,rectWidth,rectHeight);
                    }
                }
            }
            
        }else{
            console.log("浏览器不支持canvas");
        }
    }

    return (
        <div style={{width:'100%', height:'100%'}}>
            <Row style={{width:"100%", height:"100%"}}>
                <Col span={16}>
                    <div style={{padding:"0.5vw", width:"100%", height:"100%", boxSizing:"border-box", overflowX:"scroll", overflowY:"hidden"}}>
                        <canvas ref={matrixRef} id='matrix' style={{height:"100%"}}></canvas>
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