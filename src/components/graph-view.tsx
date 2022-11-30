import G6, { Graph } from '@antv/g6';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphByCommunity } from '../api/graph';

let graph: Graph|null = null;
const GraphView: React.FC<{}> = () => {
    const {currentCommunity} = useSelector((store: any)=>store.communityList);
    useEffect(()=>{
        // render graph
        initGraph(currentCommunity);
    },[currentCommunity]);

    const initGraph = (id: string) => {
        getGraphByCommunity({
            community: id
        }).then((res)=>{
            const data = res.data;
            console.log(data);
            console.log(graph);
            if(graph === null){
                graph = new G6.Graph({
                    container: "graph-container",
                    layout: {
                        type: 'force',
                        workerEnabled: true, 
                    }
                });
                graph.data(data);
                graph.render();
            }else{
                graph.changeData(data);
            }
        });
    }

    return (
        <div id='graph-container' style={{width:'100%', height:'100%', overflow:'hidden'}}>
       </div>);
};

export default GraphView