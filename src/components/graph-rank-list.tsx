import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Community } from './@types/communi-list';
import GraphRankView from './common/graph-rank-view';

const GraphRankList: React.FC<{}> = () => {
    const {graphRank, graphDistance} = useSelector((store: any)=>store.graph);
    const {selectCommunities} = useSelector((store: any)=>store.communityList);

    const setGraphByRank = ((rank: number)=>{
        return selectCommunities[rank].id;
    });

    // bug: selectCommunities变换 graphDistance/graphRank 不变 且 setGraphByRank会自动调用
    return (
        <div style={{width:'100%', height:'100%', overflowY:"scroll"}}>
            {
                graphDistance.length == selectCommunities.length?graphDistance.map((distance: number, id: number)=>{
                    return <GraphRankView key={id} distance={distance} graphId={setGraphByRank(graphRank[id])}/>;
                }):<></>
            }
       </div>);
};

export default GraphRankList