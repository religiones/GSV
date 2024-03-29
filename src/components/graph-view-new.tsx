import React, { createRef, LegacyRef, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGraphByCommunity } from '../api/graph';
import * as d3 from 'd3';
import "./style/graph-view.less";
import { Attrtion } from './@types/communi-list';
import { setSelectNodes, setSubGraph } from '../store/features/graph-slice';
import { Switch } from 'antd';
import { cloneDeep, uniq } from 'lodash';

const GraphViewNew: React.FC<{}> = () => {
    const colorArray = ['#f49c84','#099EDA','#FEE301','#ABB7BD','#F4801F','#D6C223',
    '#D75D73','#E0592B', '#58B7B3', '#68bb8c','#3F3B6C','#CF0A0A'];
    const band = ['porn','gambling','fraud','drug','gun','hacker','trading','pay','other'];
    // const scaleBand = d3.scaleOrdinal().domain(band).range(colorArray);
    const edgeColor = "#ABB7BD";
    const minNodeSize = 5;
    const maxNodeSize = 10;
    const dispatch = useDispatch();
    const { currentCommunity } = useSelector((store: any)=>store.communityList);
    const { combineNodes, selectNodes, deleteNodes, isCombine } = useSelector((store: any)=>store.graph);
    const graphRef:LegacyRef<SVGSVGElement> = createRef();
    const [graphData, setGraphData] = useState<any>(null);
    const [isMultiple, setIsMultiple] = useState<boolean>(false);
    const multipleRef = useRef<boolean>(isMultiple);
    const selectNodesRef = useRef<Array<string>>(selectNodes);
    useEffect(()=>{
        // render graph
        if(currentCommunity != null){
            getGraphByCommunity({community: currentCommunity.id}).then(res=>{
                const data = res.data;
                setGraphData(data);
                dispatch(setSubGraph({subGraph:{name:currentCommunity?.id,data:cloneDeep(data)}}));
                initGraph(data);
            });
        }
    },[currentCommunity?.id]);

    useEffect(()=>{
        multipleRef.current = isMultiple;
    }, [isMultiple]);

    useEffect(()=>{
        selectNodesRef.current = selectNodes;
    }, [selectNodes])

    useEffect(()=>{
        if(isCombine["flag"] == true){
            const links: any[] = [...graphData["edges"]];
            const nodes: any[] = [...graphData["nodes"]];
            const nodesId = isCombine["target"]["nodes"];

            // compute source & target
            let similarityLinks: any[] = [];
            let similarityNodes: any[] = [];
            let excludeNodes: any[] = [];
            links.forEach((link:any)=>{
                const source = link.source.id;
                const target = link.target.id;
                if(nodesId.includes(source)){
                    similarityLinks.push(link);
                    if(excludeNodes.findIndex(item=>item.id == target) == -1){
                        excludeNodes.push(link.target);
                    }
                }
                if(nodesId.includes(target)){
                    similarityLinks.push(link);
                    if(excludeNodes.findIndex(item=>item.id == source) == -1){
                        excludeNodes.push(link.source);
                    }
                }
            });
            nodes.forEach((node: any)=>{
                if(nodesId.includes(node.id)){
                    similarityNodes.push(node);
                }
            });
            // data clean
            similarityLinks.forEach((link:any)=>{
                links.splice(links.indexOf(link), 1);
            });
            similarityNodes.forEach((node:any)=>{
                nodes.splice(nodes.indexOf(node), 1);
            });
            console.log(similarityNodes, similarityLinks, excludeNodes)
            // add virtual node & edge
            // initGraph({nodes: similarityNodes, edges: similarityLinks});
            // let virtualGraph = combineGraph(excludeNodes, isCombine.combineId);
            let resultGraph = {nodes: uniq([...similarityNodes, ...excludeNodes]), edges: uniq([...similarityLinks])};
            initGraph(resultGraph);
            setGraphData(resultGraph);
            dispatch(setSubGraph({subGraph:{name:currentCommunity?.id,data:cloneDeep(resultGraph)}}));
        }
    },[isCombine]);

    useEffect(()=>{
        if(combineNodes != undefined){
            const nodesId = combineNodes["combine"]["nodes"];
            d3.selectAll(".nodes").attr("stroke","grey");
            nodesId.forEach((nodes: string)=>{
                if(!selectNodesRef.current.includes(nodes)){
                    d3.select(`#${nodes}`).attr("stroke","red");
                }else{
                    d3.select(`#${nodes}`).attr("stroke","#301E67");
                }
            });
        }
    },[combineNodes])

    const initGraph = (data: any) => {
        if(graphRef.current != null){
            const attrList: Attrtion[] = data["nodes"].map((node:any)=>{
                if(node["donutAttrs"] != undefined){
                    return node["donutAttrs"]
                }else{
                    return {
                        porn: 0,
                        gambling: 0,
                        fraud: 0,
                        drug: 0,
                        gun: 0,
                        hacker: 0,
                        trading: 0,
                        pay: 0
                    };
                }
            });
            const min: number = 0;
            const max: number = d3.max(attrList.map((attr:Attrtion)=>d3.sum(Object.values(attr)))) as number;
            const radiusScale = d3.scaleLinear().domain([min, max]).range([minNodeSize, maxNodeSize]);
            const zoom = d3.zoom().scaleExtent([-8, 8]).on('zoom', function (current){
                zoomed(current.transform);
                current.sourceEvent.stopPropagation();
            }).on("start", function (event) {
                event.sourceEvent.stopPropagation();
            }).on("end", function (event) {
                event.sourceEvent.stopPropagation();
            });
            const svg = d3.select(graphRef.current);
            svg.selectChildren().remove();
            const graphContainer = svg.append("g");
            //@ts-ignore
            svg.call(zoom);
            const container = document.getElementById("graph-container");
            const width = container?.clientWidth as number;
            const height = container?.clientHeight as number;
            // svg.attr("viewBox",`${-width/2} ${-height*0.5} ${width} ${height}`);
            // define arrow
            // 创建图例
            const legendGroup = svg.append("g")
                .attr("class","legend")
                .attr("transform",`translate(${width-30},50)`);
            legendGroup.selectAll("rect")
                .data(band)
                .join("rect")
                .attr("width",20)
                .attr("height",10)
                .attr("x",-10)
                .attr("y",(d:any,i:number)=>`${i*22}`)
                .attr("fill",(d:any, i: number)=>{
                    return colorArray[i];
                })
            legendGroup.selectAll("text")
                .data(band)
                .join("text")
                .text((d)=>d)
                .attr("x", -20)
                .attr("y", (d:any, i:number)=>`${i*22+10}`)
                .attr("text-anchor","end")
            svg.append('defs').append('marker')
            .attr("id",'arrowhead')
            .attr('viewBox','-0 -5 10 10')
            .attr('refX',15) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY',-0.5)
            .attr('orient','auto')
            .attr('markerWidth',6)
            .attr('markerHeight',6)
            .attr('xoverflow','visible')
            .append('path')
            .attr('d', "M0,-5L10,0L0,5")
            .attr('fill', '#999')
            .style('stroke','none');

            const simulation = d3.forceSimulation()
                .force("link",d3.forceLink().id(function(d:any){return d.id;}))
                .force("charge",d3.forceManyBody().strength(()=>{return -80})
                .distanceMax(550))
                .force("center",d3.forceCenter(width/2, height/2));
            const link = graphContainer.append("g")
                .attr("class","links")
                .selectAll("line")
                .data(data.edges)
                .enter()
                .append("line")
                .attr("stroke",edgeColor)
                .attr('marker-end','url(#arrowhead)');

            const node = graphContainer.append('g')
                .attr("stroke","grey")
                .attr("stroke-opacity",0.5)
                .attr("stroke-width", 2)
                .selectAll('g')
                .data(data.nodes)
                .join('g')
                .attr("id", (d: any)=>d.id)
                .attr("class", "nodes")
                .on("contextmenu", function(e){
                    e.preventDefault();
                })
                .on("mouseup", function(e){
                    if (!e) e=window.event;
                    // 右键事件
                })
                .on("click",function(e){
                    const data = e.target.__data__;
                    const nodeId = data["id"];
                    if(multipleRef.current == false){
                        d3.selectAll(".nodes").attr("stroke","grey");
                        dispatch(setSelectNodes({selectNodes: [nodeId]}));
                    }else{
                        dispatch(setSelectNodes({selectNodes: [...selectNodesRef.current, nodeId]}));
                    }
                    d3.select(this).attr("stroke","red");
                })
                .call(
                //@ts-ignore
                d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
            // 绘制节点
            const cir = node.append('circle')
                    .attr("r", (d: any)=>{
                        if(d["donutAttrs"]!=undefined){
                            return radiusScale(d3.sum(Object.values(d["donutAttrs"])));
                        }else if(d["nodeType"] == "VirtualNode"){
                            return minNodeSize+10;
                        }else
                        {
                            return minNodeSize;
                        }
                    })
                    .attr("fill",(d:any)=>{
                        if(d.nodeType == "Domain"){
                            return "#68bb8c"
                        }else if(d.nodeType == "Cert"){
                            return "#3F3B6C"
                        }else if(d.nodeType == "VirtualNode"){
                            return "#D2C179"
                        }
                        else{
                            return "#CF0A0A"
                        }
                    });
            // 绘制环图
            const arc = d3.arc().innerRadius((d:any)=>{return maxNodeSize;})
                .outerRadius(maxNodeSize*1.4)
            const angle = d3.pie();
            const cycle = node.append("g").attr("class","cycle");
            d3.selectAll(".cycle").each(function(d:any){
                if(d["donutAttrs"] != undefined){
                    if(d3.sum(Object.values(d["donutAttrs"])) != 0){
                        d3.select(this).selectAll("path").data(angle(Object.values(d["donutAttrs"])))
                        .join("path")
                        .attr("class","cycle-path")
                        .attr("d", (d: any)=>arc(d))
                        .attr("fill",(d: any, index: number)=>{
                            return colorArray[index];});
                    }
                }else{
                    d3.select(this).datum([0,0,0,0,0,0,0,0,0]);
                }
            });
            // 绘制标签
            const lable = node.append("text")
                .text((d: any)=>{
                    if(d.nodeType == "VirtualNode"){
                        return d.id;
                    }else{
                        return
                    }
                })
                .attr('text-anchor',"middle")
                .attr('dy','.35em')
            simulation.nodes(data.nodes).on("tick", ticked);      
            // @ts-ignore    
            simulation.force("link")?.links(data.edges);
            function ticked() {
                link.attr("x1", function(d:any) { return d.source.x; })
                    .attr("y1", function(d:any) { return d.source.y; })
                    .attr("x2", function(d:any) { return d.target.x; })
                    .attr("y2", function(d:any) { return d.target.y; });
                cir.attr("cx", function(d:any) { return d.x; })
                    .attr("cy", function(d:any) { return d.y; });
                cycle.attr("transform",function(d:any){
                    if(d.x && d.y){
                        return `translate(${d.x}, ${d.y})`;
                    }else{
                        return "translate(0,0)";
                    }
                });
                lable.attr("x",function(d:any){return d.x})
                    .attr("y",function(d:any){return d.y});
            }
            function dragstarted(d:any) {
                if (!d.active) simulation.alphaTarget(0.3).restart();
                d.subject.fx = d.x;
                d.subject.fy = d.y;
                d.sourceEvent.stopPropagation();
            }
            
            function dragged(d:any) {
                d.subject.fx = d.x;
                d.subject.fy = d.y;
                d.sourceEvent.stopPropagation();
            }
            
            function dragended(d:any) {
                if (!d.active) simulation.alphaTarget(0);
                d.subject.fx = null;
                d.subject.fy = null;
                d.sourceEvent.stopPropagation();
            }

            function zoomed(transform: any) {
                graphContainer.style('transition', 'none')
                graphContainer.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`
            )}
        }else{
            console.log("connot get graph ref");
        }
    }

    const combineGraph = (excludeNodesData: any, combineId: string) => {
        let excludeNodes = excludeNodesData;
        // create virtual Node
        const virtualNode: any = {
            id: combineId,
            nodeType: "VirtualNode"
        }
        // create virtual Node & Edge
        let virtualNodes = [];
        let virtualEdges = [];
        for(let node of excludeNodes){
            let virtualEdge = {
                source: virtualNode,
                target: node
            }
            virtualEdges.push(virtualEdge);
            virtualNodes.push(node);
        }
        return {nodes: [virtualNode, ...virtualNodes], edges: virtualEdges};
    }

    return (
        <div className='graph-wrap'>
            <span id='graph-title'>{`community: ${currentCommunity===null?'null':currentCommunity.id}`}</span>
            <div id="button-group">
                <label className='label'>multiple select</label>
                <Switch style={{marginLeft:"1%"}} onChange={()=>{
                    d3.selectAll(".nodes").attr("stroke","grey");
                    dispatch(setSelectNodes({selectNodes: []}));
                    setIsMultiple((pre:boolean)=>!pre);
                }}/>
            </div>
            <svg ref={graphRef} id='graph-container' style={{width:'100%', height:'100%'}}></svg>
    </div>);
};



export default GraphViewNew