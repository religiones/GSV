import G6, { Combo, Graph, ICombo, INode, Item } from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphsByCommunities } from '../api/graph';

let graph: Graph|null = null;
const GraphRankGallery: React.FC<{}> = () => {
    const {focusGraphs} = useSelector((store: any)=>store.graph);
    const graphRef:LegacyRef<HTMLDivElement> = createRef();

    useEffect(()=>{
        setTimeout(()=>{
            initGraphs();
        },500);
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
                if(graphRef.current != null){
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
                            defaultCombo: {
                                comboStateStyles: {
                                    active: {
                                    fill: '#2a71ae',
                                    opacity: 0.5
                                    },
                                },
                                style:{
                                    lineWidth: 5
                                }
                            },
                            modes: {
                                default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'drag-combo'],
                                edit: ['click-select','brush-select']
                            },
                            layout: {
                                type: 'gForce',
                                workerEnabled: true, 
                            },
                        });
                        graph.data(graphData);
                        graph.render();
                    }else{
                        graph.changeData(graphData);
                    }
                    graph.on('afterlayout',()=>{
                        data.forEach(graphData=>{
                            const id = graphData.id[0];
                            const subGraph = graph?.getNodes().filter((node:INode)=>{
                                return (node.getModel()["community"] as number).toString()==id;
                            }).map((node:INode)=>{
                                return node.getModel()["id"]?.toString();
                            })
                            const combos: ICombo[] = graph?.getCombos() as ICombo[];
                            const combosId = combos.map((combo:any)=>{
                                return combo.getID();
                            });
                            if(!combosId.includes( `combo-${id}`)){
                                graph?.createCombo({
                                    id: `combo-${id}`,
                                    label: `combo-${id}`,
                                    labelCfg: {
                                        position: "top",
                                        style: {
                                            fontSize: 24
                                        }
                                    },
                                    type:"circle"
                                },subGraph as string[]);
                            }
                            graph?.on('combo:mouseenter', (evt) => {
                                const { item } = evt;
                                graph?.setItemState(item as Item, 'active', true);
                            });
                            graph?.on('combo:mouseleave', (evt) => {
                                const { item } = evt;
                                graph?.setItemState(item as Item, 'active', false);
                            });
                            graph?.on('combo:click', (evt) => {
                                const { item } = evt;
                                graph?.setItemState(item as Item, 'selected', true);
                            });
                            graph?.on('canvas:click', (evt) => {
                                graph?.getCombos().forEach((combo) => {
                                    graph?.clearItemStates(combo);
                                });
                            });
                        })
                    });
                }else{
                    console.log("connot get graph ref");
                    
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