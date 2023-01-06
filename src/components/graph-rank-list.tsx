import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const GraphRankList: React.FC<{}> = () => {
    const {graphRank, graphDistance} = useSelector((store: any)=>store.graph);
    useEffect(()=>{
        console.log(graphRank);
        
    },[graphRank]);

    useEffect(()=>{
        console.log(graphDistance);
        
    },[graphDistance]);
    return (
        <div style={{width:'100%', height:'100%', overflowY:"scroll"}}>
            {
                graphRank.map((rank:number, id: number)=>{
                    return (<div key={id}>{rank}</div>);
                })
            }
       </div>);
};

export default GraphRankList