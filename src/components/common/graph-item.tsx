import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Community } from '../@types/communi-list';
import { SetState } from '../@types/graph-view';
import "../style/graph-item.less";

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

    useEffect(()=>{
        if(target!=null){
            setInitGraph(target)
        }
    },[target]);

    const setTargetHandle = () => {
        if(isTarget === false){
            setTarget(initGraph);
        }
    }

    return (
        <div onClick={setTargetHandle} className='item' style={{width: typeof(width) === 'string'?width:`${width}%`, height:typeof(height) === 'string'?height:`${height}%`}}>
            <Row style={{height:"100%", width:"100%"}} justify="center" align="middle">
                <Col span={4} style={{height:"100%"}}>
                    <p className='graph-item-title'>{initGraph?.id}</p>
                </Col>
                <Col span={8} style={{height:"100%"}}>
                    <svg id='node-edge' width={"100%"} height={"100%"}></svg>
                </Col>
                <Col span={12} style={{height:"100%"}}>
                    <svg id='graph-info' width={"100%"} height={"100%"}></svg>
                </Col>
            </Row>
       </div>);
};

export default GraphItem