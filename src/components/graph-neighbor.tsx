import G6, { Graph, GraphData, NodeConfig } from '@antv/g6';
import { scaleLinear, min, max } from 'd3';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Community } from './@types/communi-list';
import "./style/graph-view.less";

let graph: Graph|null = null;
const GraphNeighbor: React.FC<{}> = () => {
    const { currentCommunity, communities, selectCommunities} = useSelector((store: any) => store.communityList)
    
    useEffect(()=>{
        initGraph(currentCommunity.id, currentCommunity.neighbour);
    },[currentCommunity.id]);


    const initGraph = (id: number, neighbors: number[]) => {
        let data: GraphData = {
            nodes: [],
            edges: []
        };
        const selectCommunitiesId = selectCommunities.map((community: Community)=>{
            return community.id;
        });
        
        for(const community of communities){
            if(neighbors.includes(community.id)){
                if(selectCommunitiesId.includes(community.id)){
                    data.nodes?.push({
                        id: community.id.toString(),
                        label: community.id.toString(),
                        node_num : community.node_num,
                        style: {
                            fill: "#F4801F",
                            stroke: '#10A19D'
                        }
                    });
                    data.edges?.push({
                        source: id.toString(),
                        target: community.id.toString()
                    });
                }else{
                    data.nodes?.push({
                        id: community.id.toString(),
                        label: community.id.toString(),
                        node_num : community.node_num,
                        style: {
                            fill: "#CFFDE1",
                            stroke: '#10A19D'
                        }
                    });
                    data.edges?.push({
                        source: id.toString(),
                        target: community.id.toString()
                    });
                }
                
            }
            if(id === community.id){
                data.nodes?.push({
                    id: community.id.toString(),
                    label: community.id.toString(),
                    node_num: community.node_num,
                    style: {
                        fill: "#68B984",
                        stroke: '#10A19D'
                    }
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
                    workerEnabled: true, // 可选，开启 web-worker
                    //gpuEnabled: true, // 可选，开启 GPU 并行计算，G6 4.0 支持
                },
            });
            graph.data(data);
            graph.render();
        }else{
            graph.changeData(data);
        }
        
    }

    return (
        <div className='graph-wrap'>
            <span id='graph-title'>{`community: ${currentCommunity===null?'null':currentCommunity.id}`}</span>
            <div id='neighbor-container' style={{width:'100%', height:'100%', overflow:'hidden'}}></div>
        </div>
       );
};

export default GraphNeighbor