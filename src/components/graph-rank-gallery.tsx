import G6, { Graph } from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphsByCommunities } from '../api/graph';

let graph: Graph|null = null;
const GraphRankGallery: React.FC<{}> = () => {
    const {focusGraphs} = useSelector((store: any)=>store.graph);
    const graphRef:LegacyRef<HTMLDivElement> = createRef();

    useEffect(()=>{
        initGraphs();
    },[focusGraphs.length]);

    const initGraphs = () => {
        if(focusGraphs.length != 0) {
            getGraphsByCommunities({communities:focusGraphs}).then(res=>{
                console.log(res.data);
                const data:{nodes:any[], edges:any, id:any[]}[] = res.data;
                let graphData: any = {nodes:[], edges: []};
                data.forEach((graph:{nodes:any[], edges:any[], id:any[]}) => {
                    graphData["nodes"].push(...(graph.nodes));
                    graphData["edges"].push(...(graph.edges));
                });
                console.log(graphData);
                
                if(graphRef.current != undefined){
                    const container = graphRef.current;
                    if(graph === null){
                        graph = new G6.Graph({
                            container: container,
                            fitView: true,
                            fitViewPadding: 20,
                            minZoom: 0.0001,
                            maxZoom: 20,
                            defaultNode: {
                                type: 'donut',
                                size: 20,
                                style: {
                                    lineWidth: 0
                                }
                            },
                            defaultEdge: {
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
                        });
                        graph.data(graphData);
                        graph.render();
                    }else{
                        graph.changeData(graphData);
                    }
                }
            });
        }
    }

    return (
        <div style={{width:'100%', height:'100%'}}>
            <div ref={graphRef} style={{width:"100%", height:"100%", overflow:"hidden"}}></div>
       </div>);
};

export default GraphRankGallery