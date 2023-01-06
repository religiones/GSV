import React, { useEffect } from 'react';
import { Community } from '../@types/communi-list';
import "../style/graph-rank-view.less";

type GraphRankViewProps = {
    distance: number,
    graph: Community
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {distance, graph} = props;
    useEffect(()=>{
        console.log(distance, graph);
    })
    return (
        <div className='graph-rank-view-container' style={{width:'100%', height:'20vh'}}>
            <div className='graph-rank-view-title'>
                <span>distance: {distance.toFixed(2)} </span>|
                <span style={{marginLeft:"0.2vw"}}>community: {graph.id}</span>
            </div>
       </div>);
};

export default GraphRankView    