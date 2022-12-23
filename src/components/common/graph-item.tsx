import { Col, Row } from 'antd';
import React, { createRef, LegacyRef, useEffect, useRef, useState } from 'react';
import { Community } from '../@types/communi-list';
import { SetState } from '../@types/graph-view';
import "../style/graph-item.less";
import * as d3 from 'd3'
type GraphItemProps = {
    width?: number|string,
    height?: number|string,
    isTarget?: boolean,
    graph?: Community,
    target?: Community|null,
    setTarget?: SetState<Community|null>
}

const GraphItem: React.FC<GraphItemProps> = (props) => {
    const { width, height, isTarget, graph, setTarget, target} = props;
    const [initGraph, setInitGraph] = useState<Community|undefined>(graph);
    const nodeNumRef:LegacyRef<SVGSVGElement> = createRef();
    useEffect(()=>{
        if(target!=null){
            setInitGraph(target);
        }
    },[target]);

    const setTargetHandle = () => {
        if(isTarget === false){
            setTarget(initGraph);
        }
    }

    useEffect(()=>{
        initNodeNum();
    },[initGraph]);

    const initNodeNum = () => {
        const svg = d3.select(nodeNumRef?.current);
        const data: number|undefined = initGraph?.node_num;
        console.log(data);
        
        const min = 0, max = 3000;
        const normalize = d3.scaleLinear().domain([min, max]).range([0, 1]); // linear
        svg.append('rect')
            .datum(data)
            .attr('width', '100%')
            .attr('height', '60%')
            .attr('y','20%')
            .attr('fill',(d: any, i: any)=>{
                return d3.interpolateRgb('#2a71ae','#b82d35')(normalize(d));
            });
        svg.append('text')
            .datum(data)
            .style('fill','#fff')
            .style('font-weight', 500)
            .style('font-size','1rem')
            .attr('x',"25%")
            .attr('y',"62%")
            .text((d: any)=>`${d?.toString()} nodes`);
    }

    return (
        <div onClick={setTargetHandle} className='item' style={{width: typeof(width) === 'string'?width:`${width}%`, height:typeof(height) === 'string'?height:`${height}%`}}>
            <Row style={{height:"100%", width:"100%"}} justify="center" align="middle">
                <Col span={4} style={{height:"100%"}}>
                    <p className='graph-item-title'>{initGraph?.id}</p>
                </Col>
                <Col span={8} style={{height:"100%"}}>
                    <svg ref={nodeNumRef} id='node-num' width={"100%"} height={"100%"}></svg>
                </Col>
                <Col span={12} style={{height:"100%"}}>
                    <svg id='graph-info' width={"100%"} height={"100%"}></svg>
                </Col>
            </Row>
       </div>);
};

export default GraphItem