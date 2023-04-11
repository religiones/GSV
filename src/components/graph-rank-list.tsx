import { GraphData } from '@antv/g6';
import React from 'react';
import { useSelector } from 'react-redux';
import { subGraphType } from './@types/graph-view';
import GraphRankView from './common/graph-rank-view';

const GraphRankList: React.FC<{}> = () => {
    const {subGraphList} = useSelector((store: any)=>store.graph);

    // bug: selectCommunities变换 graphDistance/graphRank 不变 且 setGraphByRank会自动调用: 已修复 向组件传对象导致的问题
    return (
        <div style={{width:'100%', height:'100%', overflowY:"scroll"}}>
            {
                subGraphList.map((subGraph:subGraphType, id:number)=>{
                    return (<GraphRankView key={id} name={subGraph.name} data={subGraph.data as GraphData}/>)
                })
            }
       </div>);
};

export default GraphRankList