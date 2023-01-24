import G6, { GraphData } from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../style/graph-rank-view.less";
import * as d3 from 'd3';

type GraphRankViewProps = {
    name: string,
    data: GraphData
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {name, data} = props;
    const graphRef:LegacyRef<HTMLDivElement> = createRef();
    const { subGraph } = useSelector((store: any)=>store.graph);
    const dispatch = useDispatch();
    const graphRankViewClickHandle = () => {
    }    

    useEffect(()=>{
        initGraphRankView();
    },[name, graphRef]);

    const initGraphRankView = () => {
        const container = graphRef.current as HTMLElement;
        d3.select(container).selectChildren().remove();
        const graph = new G6.Graph({
            container: container,
            fitView: true,
            fitViewPadding: 20,
            layout: {
                type: 'force',
                workerEnabled: true, 
            },
        });
        console.log(data);
        
        graph.data(data);
        graph.render();
    }

    return (
        <div className='graph-rank-view-container' style={{width:'100%', height:'20vh'}}>
            <div className='graph-rank-view-title'>
                <span>name: {name} </span>
            </div>
            <div className='graph-rank-view-content' onClick={graphRankViewClickHandle}>
                <div ref={graphRef} style={{width:'100%', height:'100%', overflow:'hidden'}}></div>
            </div>
       </div>);
};

export default GraphRankView    