import G6, { Graph } from '@antv/g6';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphByCommunity } from '../api/graph';
import "./style/graph-view.less";



let graph: Graph|null = null;
const GraphView: React.FC<{}> = () => {
    const colorArray = ['#f49c84','#099EDA','#FEE301','#ABB7BD','#F4801F','#D6C223',
    '#D75D73','#E0592B', '#58B7B3', '#68bb8c','#3F3B6C','#CF0A0A'];

    const {currentCommunity} = useSelector((store: any)=>store.communityList);
    useEffect(()=>{
        // render graph
        if(currentCommunity != null){
            initGraph(currentCommunity.id);
        }
    },[currentCommunity?.id]);

    const initGraph = (id: string) => {
        getGraphByCommunity({
            community: id
        }).then((res)=>{
            const data = res.data;
            // minimap plugins
            const minimap = new G6.Minimap({
                size: [100, 100],
                className: 'minimap',
                type: 'delegate',
            });
            if(graph === null){
                // draw legend
                const legendData = {
                    nodes: [{
                        id: 'porn',
                        label: 'porn',
                        order: 0,
                        type:'rect',
                        style: {
                        fill: colorArray[0],
                        }
                    },{
                        id: 'gambling',
                        label: 'gambling',
                        type:'rect',
                        order: 1,
                        style: {
                        fill: colorArray[1],
                        }
                    },{
                        id: 'fraud',
                        label: 'fraud',
                        type:'rect',
                        order: 2,
                        style: {
                        fill: colorArray[2],
                        }
                    },{
                        id: 'drug',
                        label: 'drug',
                        type:'rect',
                        order: 3,
                        style: {
                        fill: colorArray[3],
                        }
                    },{
                        id: 'gun',
                        label: 'gun',
                        type:'rect',
                        order: 4,
                        style: {
                        fill: colorArray[4],
                        }
                    },{
                        id: 'hacker',
                        label: 'hacker',
                        type:'rect',
                        order: 5,
                        style: {
                        fill: colorArray[5],
                        }
                    },{
                        id: 'trading',
                        label: 'trading',
                        type:'rect',
                        order: 6,
                        style: {
                        fill: colorArray[6],
                        }
                    },{
                        id: 'pay',
                        label: 'pay',
                        type:'rect',
                        order: 7,
                        style: {
                        fill: colorArray[7],
                        }
                    },{
                        id: 'other',
                        label: 'other',
                        type:'rect',
                        order: 8,
                        style: {
                        fill: colorArray[8],
                        }
                    }]
                }
                const legend = new G6.Legend({
                    data: legendData,
                    align: 'center',
                    layout: 'horizontal', // vertical
                    position: 'bottom',
                    vertiSep: 8,
                    horiSep: 4,
                    offsetY: -24,
                    padding: [4, 16, 8, 16],
                    containerStyle: {
                        fill: '#eee',
                        lineWidth: 1
                    },
                    title: ' ',
                    titleConfig: {
                    offsetY: -8,
                    },
                });
                graph = new G6.Graph({
                    container: "graph-container",
                    fitView: true,
                    fitViewPadding: 20,
                    minZoom: 0.0001,
                    maxZoom: 20,
                    defaultNode: {
                        type: 'donut',
                        size: 15,
                        style: {
                            lineWidth: 0
                        }
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
                        type: 'force',
                        workerEnabled: true, 
                    },
                    plugins: [minimap, legend]
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