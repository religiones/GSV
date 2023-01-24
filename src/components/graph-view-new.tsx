import React, { createRef, LegacyRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGraphByCommunity } from '../api/graph';
import * as d3 from 'd3';
import "./style/graph-view.less";

const GraphViewNew: React.FC<{}> = () => {
    const colorArray = ['#f49c84','#099EDA','#FEE301','#ABB7BD','#F4801F','#D6C223',
    '#D75D73','#E0592B', '#58B7B3', '#68bb8c','#3F3B6C','#CF0A0A'];
    const edgeColor = "#ABB7BD";
    const nodeSize = 5;
    const {currentCommunity} = useSelector((store: any)=>store.communityList);
    const graphRef:LegacyRef<SVGSVGElement> = createRef();
    useEffect(()=>{
        // render graph
        if(currentCommunity != null){
            initGraph(currentCommunity.id);
        }
    },[currentCommunity?.id, graphRef]);

    const initGraph = (id:number) => {
        getGraphByCommunity({
            community: id
        }).then(res=>{
            const data = res.data;
            console.log(data);
            
            const zoom = d3.zoom().scaleExtent([-8, 8]).on('zoom', function (current){
                zoomed(current.transform)
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
            const simulation = d3.forceSimulation()
                .force("link",d3.forceLink().id(function(d:any){return d.id;}))
                .force("charge",d3.forceManyBody())
                .force("center",d3.forceCenter(width/2, height/2));
            const link = graphContainer.append("g")
                .attr("class","links")
                .selectAll("line")
                .data(data.edges)
                .enter()
                .append("line")
                .attr("stroke",edgeColor);
            const node = graphContainer.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("r", nodeSize)
                .attr("fill",(d:any)=>{
                    if(d.nodeType == "Domain"){
                        return "#68bb8c"
                    }else if(d.nodeType == "Cert"){
                        return "#3F3B6C"
                    }else{
                        return "#CF0A0A"
                    }
                })
                .call(
                //@ts-ignore
                d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
            simulation.nodes(data.nodes).on("tick", ticked);      
            // @ts-ignore    
            simulation.force("link")?.links(data.edges);
            function ticked() {
                link.attr("x1", function(d:any) { return d.source.x; })
                    .attr("y1", function(d:any) { return d.source.y; })
                    .attr("x2", function(d:any) { return d.target.x; })
                    .attr("y2", function(d:any) { return d.target.y; });
                node
                    .attr("cx", function(d:any) { return d.x; })
                    .attr("cy", function(d:any) { return d.y; });
            }
            function dragstarted(d:any) {
                if (!d.active) simulation.alphaTarget(0.3).restart();
                d.subject.fx = d.x;
                d.subject.fy = d.y;
            }
            
            function dragged(d:any) {
                d.subject.fx = d.x;
                d.subject.fy = d.y;
            }
            
            function dragended(d:any) {
                if (!d.active) simulation.alphaTarget(0);
                d.subject.fx = null;
                d.subject.fy = null;
            }

            function zoomed(transform: any) {
                graphContainer.style('transition', 'none')
                graphContainer.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`
            )}
        });
    }

    return (
        <div className='graph-wrap'>
            <span id='graph-title'>{`community: ${currentCommunity===null?'null':currentCommunity.id}`}</span>
            <svg ref={graphRef} id='graph-container' style={{width:'100%', height:'100%'}}></svg>
       </div>);
};



export default GraphViewNew