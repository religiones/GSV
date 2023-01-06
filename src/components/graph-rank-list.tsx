import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Community } from './@types/communi-list';
import GraphRankView from './common/graph-rank-view';

const GraphRankList: React.FC<{}> = () => {
    const {graphRank, graphDistance} = useSelector((store: any)=>store.graph);
    const {selectCommunities} = useSelector((store: any)=>store.communityList);

    const setGraphByRank = ((rank: number, communities: Community[])=>{
        return communities[rank];
    });

    useEffect(()=>{
        console.log(graphRank);
    },[graphRank]);

    useEffect(()=>{
        console.log(graphDistance);
        
    },[graphDistance]);
    return (
        <div style={{width:'100%', height:'100%', overflowY:"scroll"}}>
            {
                graphDistance.map((distance:number, id: number)=>{
                    return <GraphRankView key={id} distance={distance} graph={setGraphByRank(graphRank[id],selectCommunities)}/>;
                })
            }
       </div>);
};

export default GraphRankList