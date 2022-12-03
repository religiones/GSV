import G6, { Graph, GraphData, NodeConfig } from '@antv/g6';
import { scaleLinear, min, max } from 'd3';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

let graph: Graph|null = null;
const GraphNeighbor: React.FC<{}> = () => {
    const { currentCommunity, currentCommunityId, communities } = useSelector((store: any) => store.communityList)
    
    useEffect(()=>{
        initGraph(Number(currentCommunityId), currentCommunity.neighbour);
    },[currentCommunityId]);

    const initGraph = (id: number, neighbors: number[]) => {
        let data: GraphData = {
            nodes: [],
            edges: []
        };
        for(const community of communities){
            if(neighbors.includes(community.id)){
                data.nodes?.push({
                    id: community.id.toString(),
                    label: community.id.toString(),
                    node_num : community.node_num
                });
                data.edges?.push({
                    source: id.toString(),
                    target: community.id.toString()
                });
            }
            if(id === community.id){
                data.nodes?.push({
                    id: community.id.toString(),
                    label: community.id.toString(),
                    node_num: community.node_num
                })
            }
        }
        const min_num = min(data["nodes"] as Iterable<NodeConfig>, (node: any)=>{
            return node.node_num;
        });
        const max_num = max(data["nodes"] as Iterable<NodeConfig>, (node: any)=>{
            return node.node_num;
        });
        // d3 scaler
        const linear = scaleLinear().domain([min_num, max_num]).range([10, 100]);
        data["nodes"]?.forEach(node => {
            node.size = linear(node.node_num as number);
        });
        console.log(data);
        
        if(graph === null){
            graph = new G6.Graph({
                container: "neighbor-container",
                fitView: true,
                fitViewPadding: 20,
                minZoom: 0.0001,
                maxZoom: 20,
                defaultNode:{
                    labelCfg: {
                        position: 'bottom',
                    },
                },
                defaultEdge:{
                    style: {
                        endArrow: true
                    }
                },
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
                    edit: ['click-select','brush-select']
                },
                layout: {
                    type: 'circular',
                    workerEnabled: true
                },
            });
            graph.data(data);
            graph.render();
        }else{
            graph.changeData(data);
        }
        
    }

    return (
        <div id='neighbor-container' style={{width:'100%', height:'100%', overflow:'hidden'}}>
       </div>);
};

export default GraphNeighbor