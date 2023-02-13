import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CombineNodes } from './@types/graph-view';
import SubGraphItem from './common/subGraph-item';
import "./style/subgraph.less";

const SubGraphView: React.FC<{}> = () => {
    const {combineNodesList, combineNodes, deleteNodes} = useSelector((store: any)=>store.graph);

    useEffect(()=>{
        console.log(combineNodesList);
        
    }, [combineNodesList])

    return (
        <div style={{width:'100%', height:'100%', boxSizing:"border-box"}}>
            <Row style={{height:"10%", borderBottom:"1px solid #ddd"}}>
                <Col span={4} className="subGraphTitle">Name</Col>
                <Col span={4} className="subGraphTitle">Community</Col>
                <Col span={8} className="subGraphTitle">NodeNum</Col>
                <Col span={8} className="subGraphTitle">Options</Col>
            </Row>
            {combineNodesList.length==0?<></>:combineNodesList.map((combine:CombineNodes, id: number)=>{
                return (<SubGraphItem key={id} combineNodes={combine}></SubGraphItem>)
            })}
    </div>);
};

export default SubGraphView