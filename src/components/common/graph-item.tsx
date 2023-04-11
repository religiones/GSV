import { Col, Row } from 'antd';
import React, { createRef, LegacyRef, useEffect, useState } from 'react';
import { Community } from '../@types/communi-list';
import { SetState } from '../@types/graph-view';
import "../style/graph-item.less";
import * as d3 from 'd3'
import { useDispatch, useSelector } from 'react-redux';
import { setCommunity, setSelectCommunities } from '../../store/features/community-list-slice';

type GraphItemProps = {
    width?: number|string,
    height?: number|string,
    isTarget?: boolean,
    graph?: Community,
    target?: Community|null,
    setTarget?: SetState<Community|null>
}

const GraphItem: React.FC<GraphItemProps> = (props) => {
    const { width, height, isTarget, graph, setTarget, target} = props;
    const { selectCommunities} = useSelector((store: any) => store.communityList);
    const [initGraph, setInitGraph] = useState<Community|undefined>(graph);
    const nodeNumRef:LegacyRef<SVGSVGElement> = createRef();
    const graphInfoRef:LegacyRef<SVGSVGElement> = createRef();
    const dispatch = useDispatch();

    useEffect(()=>{
        setInitGraph(graph);
    },[graph]);

    useEffect(()=>{
        if(target!=null){
            setInitGraph(target);
        }
    },[target]);

    // add target
    const setTargetHandle = () => {
        if(isTarget === false){
            setTarget(initGraph);
        }
    }
    // change target view
    const setTargetViewHandle = (e: any) => {
        dispatch(setCommunity({currentCommunity: initGraph}));
    }

    // delete view
    const deleteViewHandle = () => {
        const temp = [...selectCommunities];
        temp.splice(temp.indexOf(initGraph),1);
        dispatch(setSelectCommunities({selectCommunities:[...temp]}));
    }

    useEffect(()=>{
        initNodeNum();
        initGraphInfo();
    },[initGraph]);

    const initNodeNum = () => {
        const svg = d3.select(nodeNumRef?.current);
        svg.selectChildren().remove();
        if(initGraph != undefined){
            const data: number|undefined = initGraph.node_num;
            const min = 0, max = 3000;
            const normalize = d3.scaleLinear().domain([min, max]).range([0, 1]); // linear
            svg.append('rect')
                .datum(data)
                .attr('width', '100%')
                .attr('height', '60%')
                .attr('y','20%')
                .attr('fill',(d: any, i: any)=>{
                    return d3.interpolateRgb('#2a71ae','#b82d35')(normalize(d));
                });
            svg.append('text')
                .datum(data)
                .style('fill','#fff')
                .style('font-weight', 500)
                .style('font-size','1rem')
                .attr('x',"25%")
                .attr('y',"62%")
                .text((d: any)=>`${d?.toString()} nodes`);
        }
    }

    const initGraphInfo = () => {
        const colorArray = ['#f49c84','#099EDA','#FEE301','#ABB7BD','#F4801F','#D6C223','#D75D73','#E0592B', '#58B7B3'];
        const svg = d3.select(graphInfoRef?.current);
        svg.selectChildren().remove();
        if(initGraph != undefined){
            const data = initGraph.wrong_list;
            const sum = d3.sum(data);
            const band = ['porn','gambling','fraud','drug','gun','hacker','trading','pay','other'];
            const cleanData = data.map((d:number, i:number)=>{if(d!=0){return {"name":band[i],"val":d/sum}}}).filter((d)=>{return d!= undefined});
            const scaleBand = d3.scaleBand().domain(band).range([0,9]);
            if(cleanData.length != 0){
                svg.selectAll('rect')
                .data(cleanData)
                .join('rect')
                .attr('width',(d:any)=>`${d.val*100}%`)
                .attr('height','60%')
                .attr('y',"20%")
                .attr('x',(d: any, id: number)=>{
                    if(id!=0){
                        const dataTemp = cleanData.slice(0, id);
                        const dataTempSum = dataTemp.reduce((pre: any, cur:any)=>{return pre+cur.val}, 0);
                        return `${dataTempSum*100}%`;
                    }else{
                        return 0;
                    }
                }).attr('fill',(d: any)=>{
                    return colorArray[scaleBand(d.name) as number];
                });
            }else{
                svg.append('rect')
                .attr('width','100%')
                .attr('height', '60%')
                .attr('y','20%')
                .attr('x', 0)
                .attr('fill','#fff')
            }
        }
    }

    return (
        <div className='item' style={{width: typeof(width) === 'string'?width:`${width}%`, height:typeof(height) === 'string'?height:`${height}%`}}>
            <Row style={{height:"100%", width:"100%"}} justify="center" align="middle">
                <Col span={4} style={{height:"100%"}} onClick={setTargetHandle}>
                    <p className='graph-item-title'>{initGraph?.id}</p>
                </Col>
                <Col className='graph-item-content' span={18} style={{height:"100%"}} onClick={setTargetViewHandle}>
                    <Row style={{height:"100%", width:"100%"}} justify="center" align="middle">
                        <Col span={11} style={{height:"100%"}}>
                            <svg ref={nodeNumRef} id='node-num' width={"100%"} height={"100%"}></svg>
                        </Col>
                        <Col span={12} style={{height:"100%"}}>
                            <svg ref={graphInfoRef} width={"100%"} height={"100%"}></svg>
                        </Col>
                    </Row>
                </Col>
                <Col span={2} style={{height:"100%",paddingTop:"0.8%", cursor:"pointer"}} onClick={deleteViewHandle}>
                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3232" width="32" height="32"><path d="M840 288H688v-56c0-40-32-72-72-72h-208C368 160 336 192 336 232V288h-152c-12.8 0-24 11.2-24 24s11.2 24 24 24h656c12.8 0 24-11.2 24-24s-11.2-24-24-24zM384 288v-56c0-12.8 11.2-24 24-24h208c12.8 0 24 11.2 24 24V288H384zM758.4 384c-12.8 0-24 11.2-24 24v363.2c0 24-19.2 44.8-44.8 44.8H332.8c-24 0-44.8-19.2-44.8-44.8V408c0-12.8-11.2-24-24-24s-24 11.2-24 24v363.2c0 51.2 41.6 92.8 92.8 92.8h358.4c51.2 0 92.8-41.6 92.8-92.8V408c-1.6-12.8-12.8-24-25.6-24z" fill="#db3b3c" p-id="3233"></path><path d="M444.8 744v-336c0-12.8-11.2-24-24-24s-24 11.2-24 24v336c0 12.8 11.2 24 24 24s24-11.2 24-24zM627.2 744v-336c0-12.8-11.2-24-24-24s-24 11.2-24 24v336c0 12.8 11.2 24 24 24s24-11.2 24-24z" fill="#db3b3c" p-id="3234"></path></svg>
                </Col>
            </Row>
       </div>);
};

export default GraphItem