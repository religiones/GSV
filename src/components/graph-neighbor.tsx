import G6, { Graph, GraphData, IG6GraphEvent, NodeConfig } from '@antv/g6';
import * as d3 from 'd3';
import React, { createRef, LegacyRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectCommunities } from '../store/features/community-list-slice';
import { Community } from './@types/communi-list';
import "./style/graph-view.less";

let graph: Graph|null = null;
const GraphNeighbor: React.FC<{}> = () => {
    const { currentCommunity, communities, selectCommunities} = useSelector((store: any) => store.communityList);
    const graphRef:LegacyRef<SVGSVGElement> = createRef();
    const dispatch = useDispatch();
    let selectNeighbor:Community[] = [];

    useEffect(()=>{
        // initGraph(currentCommunity.id, currentCommunity.neighbour);
        initNeighborGraph(currentCommunity.id, currentCommunity.neighbour);
    },[currentCommunity.id]);
    

    // const initGraph = (id: number, neighbors: number[]) => {
    //     let data: GraphData = {
    //         nodes: [],
    //         edges: []
    //     };
    //     const selectCommunitiesId = selectCommunities.map((community: Community)=>{
    //         return community.id;
    //     });
        
    //     for(const community of communities){
    //         if(neighbors.includes(community.id)){
    //             if(selectCommunitiesId.includes(community.id)){
    //                 data.nodes?.push({
    //                     id: community.id.toString(),
    //                     label: community.id.toString(),
    //                     node_num : community.node_num,
    //                     style: {
    //                         fill: "#F4801F",
    //                         stroke: '#10A19D'
    //                     }
    //                 });
    //                 data.edges?.push({
    //                     source: id.toString(),
    //                     target: community.id.toString()
    //                 });
    //             }else{
    //                 data.nodes?.push({
    //                     id: community.id.toString(),
    //                     label: community.id.toString(),
    //                     node_num : community.node_num,
    //                     style: {
    //                         fill: "#CFFDE1",
    //                         stroke: '#10A19D'
    //                     }
    //                 });
    //                 data.edges?.push({
    //                     source: id.toString(),
    //                     target: community.id.toString()
    //                 });
    //             }
    //             setNeighborCommunity((prev:Community[])=>{
    //                 return [...prev,community];
    //             });
    //         }
    //         if(id === community.id){
    //             data.nodes?.push({
    //                 id: community.id.toString(),
    //                 label: community.id.toString(),
    //                 node_num: community.node_num,
    //                 style: {
    //                     fill: "#68B984",
    //                     stroke: '#10A19D'
    //                 }
    //             })
    //         }
    //     }
    //     const min_num = min(data["nodes"] as Iterable<NodeConfig>, (node: any)=>{
    //         return node.node_num;
    //     });
    //     const max_num = max(data["nodes"] as Iterable<NodeConfig>, (node: any)=>{
    //         return node.node_num;
    //     });
    //     // d3 scaler
    //     const linear = scaleLinear().domain([min_num, max_num]).range([10, 100]);
    //     data["nodes"]?.forEach(node => {
    //         node.size = linear(node.node_num as number);
    //     });
    //     if(graph === null){
    //         graph = new G6.Graph({
    //             container: "neighbor-container",
    //             fitView: true,
    //             fitViewPadding: 20,
    //             minZoom: 0.0001,
    //             maxZoom: 20,
    //             defaultNode:{
    //                 labelCfg: {
    //                     position: 'bottom',
    //                 },
    //             },
    //             defaultEdge:{
    //                 style: {
    //                     endArrow: true
    //                 }
    //             },
    //             modes: {
    //                 default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    //                 edit: ['click-select','brush-select']
    //             },
    //             layout: {
    //                 type: 'circular',
    //                 workerEnabled: true, // 可选，开启 web-worker
    //                 //gpuEnabled: true, // 可选，开启 GPU 并行计算，G6 4.0 支持
    //             },
    //         });
    //         graph.data(data);
    //         graph.render();
    //     }else{
    //         graph.changeData(data);
    //     }
    // }



    const initNeighborGraph = (id:number, neighbors: number[])=>{
        let neighborCommunity:Community[] = [];
        let currentCommunity:Community|undefined = undefined;
        for(const community of communities){
            if(neighbors.includes(community.id)){
                neighborCommunity.push(community);
            }
            if(id === community.id){
                currentCommunity =community;
            }
        }
        const svg = d3.select(graphRef?.current);
        const container = document.getElementById("neighbor-container");
        const width = container?.clientWidth as number;
        const height = container?.clientHeight as number;
        const padding = 10;
        const innerRadius = 100;
        const outerRadius = Math.min(width,height)/2-padding;
        svg.style("font", "10px sans-serif")
            .attr("viewBox",`${-width/2} ${-height*0.6} ${width} ${height}`);
        svg.selectChildren().remove();
        if(neighborCommunity.length != 0){
            const keys = ["porn","gambling","fraud","drug","gun","hacker","trading","pay","other"];
            const colorArray = ['#f49c84','#099EDA','#FEE301','#ABB7BD','#F4801F','#D6C223','#D75D73','#E0592B', '#58B7B3'];
            const colorScale = d3.scaleOrdinal().domain(keys).range(colorArray);
            const stack = d3.stack().keys(keys);
            const neighborId:string[] = neighborCommunity.map((community:Community)=>String(community.id));
            const xScale = d3.scaleBand().domain(neighborId).range([0,2*Math.PI]).align(0);
            const yScale = d3.scaleSqrt().domain([0, d3.max(neighborCommunity,(d:any)=>d.wrong_num)]).range([innerRadius, outerRadius]);
            const arc = d3.arc()
                .innerRadius((d:any)=>yScale(d[0]))
                .outerRadius((d:any)=>yScale(d[1]))
                .startAngle((d:any)=>xScale(String(d.data.id)) as number)
                .endAngle((d:any)=>xScale(String(d.data.id)) as number + xScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius);

            svg.append("g")
                .selectAll("g")
                .data(stack(neighborCommunity as Iterable<{ [key: string]: number; }>))
                .join("g")
                .attr("fill",(d: any):string=>colorScale(d.key) as string)
                .selectAll("path")
                .data(d=>d)
                .join("path")
                .attr("d", (d:any)=>arc(d));
            const xAxis = (g:any) => g
                .attr("class","xAxis")
                .attr("text-anchor", "middle")
                .call((g:any) => g.selectAll("g")
                .data(neighborCommunity)
                .enter().append("g")
                .attr("transform", (d:any) => `
                rotate(${((xScale(String(d.id)) as number + xScale.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${innerRadius},0)
                `)
                .call((g:any) => g.append("line")
                    .attr("x2", -5)
                    .attr("stroke", "#000"))
                .call((g:any) => g.append("text")
                .attr("transform", "rotate(180)translate(26,3)")
                .text((d:any) => String(d.id))))
                .style("cursor","pointer");
            
            svg.append("g").call(xAxis);
            d3.selectAll("text")
                .on("click",(e)=>{
                    const community = e.target.__data__;
                    if(!selectNeighbor.includes(community)){
                        selectNeighbor.push(e.target.__data__);
                        dispatch(setSelectCommunities({selectCommunities:[...selectCommunities, ...selectNeighbor]}));
                    }
                });
        }
    }

    return (
        <div className='graph-wrap' style={{overflow:'hidden'}}>
            <span id='graph-title'>{`community: ${currentCommunity===null?'null':currentCommunity.id}`}</span>
            <svg id='neighbor-container' ref={graphRef} style={{width:'100%', height:'100%'}}></svg>
        </div>
       );
};

export default GraphNeighbor
