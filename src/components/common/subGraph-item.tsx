import { Button, Col, Row } from 'antd';
import React from 'react';

type SubGraphItemType = {
    name: string,
    nodeNum: number,
    community: number,
    nodes: string[]
}

const SubGraphItem: React.FC<SubGraphItemType> = (props) => {
    const { name, nodeNum, community, nodes } = props;

    return (
        <div style={{width:'100%', height:'10%', borderBottom:"1px solid #ddd"}}>
            <Row style={{height:"100%"}}>
                <Col span={4} className="subGraphItem">{name}</Col>
                <Col span={4} className="subGraphItem">{community}</Col>
                <Col span={8} className="subGraphItem">{nodeNum}</Col>
                <Col span={8} className="subGraphItem" style={{paddingTop:"1.2%"}}>
                    <Button style={{marginRight:"2%"}}> Nodes </Button>
                    <Button type="primary" danger> Delete </Button>
                </Col>
            </Row>
       </div>);
};

export default SubGraphItem