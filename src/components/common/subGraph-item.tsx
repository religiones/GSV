import { Button, Col, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCombineNodes, setCombineNodesList, setIsCombine } from '../../store/features/graph-slice';
import { CombineNodes } from '../@types/graph-view';

type SubGraphItem = {
    combineNodes: CombineNodes,
}

const SubGraphItem: React.FC<SubGraphItem> = (props) => {
    const { combineNodesList, deleteNodes } = useSelector((store: any)=>store.graph);
    const { combineNodes } = props;
    const {name, community, nodeNum} = combineNodes;
    const dispatch = useDispatch();

    const onNodesClick = () => {
        dispatch(setIsCombine({isCombine:{flag:true,target:combineNodes["combine"]}}));
    }
    const onDeleteClick = () => {
        let nodes: string[] = [...combineNodes["combine"]["nodes"]];
        let distance: number[] = [...combineNodes["combine"]["distance"]];
        deleteNodes.forEach((node: string)=>{
            const index: number = nodes.indexOf(node);
            nodes.splice(index, 1);
            distance.splice(index, 1);
        });
        dispatch(setCombineNodes({combineNodes: {...combineNodes, combine:{nodes: nodes, distance: distance}}}));
        let arr = [...combineNodesList];
        arr.splice(arr.indexOf(combineNodes), 1, {...combineNodes, nodeNum:nodes.length, combine:{nodes: nodes, distance: distance}});
        dispatch(setCombineNodesList({combineNodesList: arr}));
    }
    return (
        <div style={{width:'100%', height:'10%', borderBottom:"1px solid #ddd"}}>
            <Row style={{height:"100%"}}>
                <Col span={4} className="subGraphItem">{name}</Col>
                <Col span={4} className="subGraphItem">{community}</Col>
                <Col span={8} className="subGraphItem">{nodeNum}</Col>
                <Col span={8} className="subGraphItem" style={{paddingTop:"1.2%"}}>
                    <Button style={{marginRight:"2%"}} onClick={onNodesClick}> Nodes </Button>
                    <Button type="primary" danger onClick={onDeleteClick}> Delete </Button>
                </Col>
            </Row>
    </div>);
};

export default SubGraphItem