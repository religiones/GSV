import React, { createRef, LegacyRef, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Combine} from './@types/graph-view';
import * as d3 from 'd3';
import { setDeleteNodes } from '../store/features/graph-slice';

const NodesDistanceView: React.FC<{}> = () => {
    const { combineNodes } = useSelector((store:any) => store.graph);
    const dispatch = useDispatch();
    const graphRef:LegacyRef<SVGSVGElement> = createRef();
    const margin = 5;
    const barColor = "#68bb8c";

    useEffect(()=>{
        if(combineNodes != undefined){
            dispatch(setDeleteNodes({deleteNodes: []}));
            initGraph(combineNodes["combine"]);
        }
        
    },[combineNodes]);



    const initGraph = useCallback((combine:Combine) => {
        if(graphRef.current != undefined){
            const svg = d3.select(graphRef.current);
            svg.selectChildren().remove();
            const container = document.getElementById("nodes-distance");
            const width = container?.clientWidth as number;
            const height = container?.clientHeight as number;
            svg.attr("viewBox",[0,0,width,height]);
            const min = d3.min(combine["distance"]) as number;
            const max = d3.max(combine["distance"]) as number;
            const normalize = d3.scaleLinear().domain([min, max]).range([0, 1]); // linear
            const {nodes, distance} = combine;
            let data:{label:string, value: number}[] = [];
            for(let i = 0; i < nodes.length; i++){
                data.push({label:nodes[i],value:distance[i]});
            }
            console.log(min,max,width);
            const xScale = d3.scaleLinear().domain([min, max]).range([margin,width-margin]);
            const yScale = d3.scaleBand().domain(nodes).range([height-margin, margin]).padding(0.2);
            const xAxis = (g:any) => g.attr("transform",`translate(0,${height-margin})`)
                .call(d3.axisBottom(xScale).ticks(width/100));
            const yAxis = (g: any) => g.attr("transform",`translate(${margin}, 0)`)
                .call(d3.axisLeft(yScale).tickSizeOuter(0));
            svg.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("class","bar")
                .attr("x", (d:any)=>xScale(0))
                .attr("y", (d:any)=>yScale(d.label) as number)
                .attr("width", (d:any)=>xScale(d.value)-xScale(0))
                .attr("height", yScale.bandwidth)
                .attr("fill", (d: any)=>{
                    return d3.interpolateRgb('#68bb8c88',barColor)(normalize(d.value));
                })
                .on("click",function(e){
                    const data = e.target.__data__;
                    d3.select(this).attr("class","selected");
                    console.log(data);
                });
            // brush
            svg.append("g")
                .attr("class", "brush")
                .call(d3.brushY().on("end", function(e){
                    dispatch(setDeleteNodes({deleteNodes: []}));
                    //  更改选取样式
                    d3.select(".selection")
                        .attr("fill","rgba(244,244,244,0.4)")
                    let temp: string[] = []
                    const yList = e.selection;  // [y0, y1] 框选y轴大小值
                    d3.selectAll(".bar")
                        .classed("selected", false)
                        .each(function(d: any){
                            const bar = d3.select(this);
                            const top = Number(bar.attr("y"));
                            const bottom = Number(bar.attr("y"))+yScale.bandwidth();
                            if(yList[0] <= top && bottom <= yList[1]
                                ||yList[0] >= top && yList[0] <= bottom
                                ||yList[1] >= top && yList[1] <= bottom){
                                //  矩阵中线在刷取区间内，更改选中样式并添加删除节点
                                bar.classed("selected", true);
                                temp.push(d.label);
                            }
                    });
                    dispatch(setDeleteNodes({deleteNodes: temp}));
                }));
            
        }else{
            console.log("cannot get graph Ref");
        }
    }, [combineNodes])

    return (
        <div style={{width:'100%', height:'100%'}}>
            <style>
                {
                    `.selected {
                        opacity:0.3;
                    }`
                }
            </style>
            <div id="nodes-distance" style={{width:"100%", height:"100%",overflowY:"hidden"}}>
                <svg ref={graphRef}></svg>
            </div>
    </div>);
};

export default NodesDistanceView