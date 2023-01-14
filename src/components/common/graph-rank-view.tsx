import G6 from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGraphByCommunity } from '../../api/graph';
import { setEmbeddingGraph, setFocusGraphs } from '../../store/features/graph-slice';
import "../style/graph-rank-view.less";
import * as d3 from 'd3';

type GraphRankViewProps = {
    distance: number,
    graphId: number
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {distance, graphId} = props;
    const graphRef:LegacyRef<HTMLDivElement> = createRef();
    const { focusGraphs } = useSelector((store: any)=>store.graph);
    const dispatch = useDispatch();

    const graphRankViewClickHandle = () => {
        dispatch(setEmbeddingGraph({embeddingGraph: graphId}));
        if(!focusGraphs.includes(graphId)){
            dispatch(setFocusGraphs({focusGraphs: [...focusGraphs,graphId]}));
        }
    }    

    useEffect(()=>{
        setTimeout(()=>{
            initGraphRankView();
        },500);
    },[graphId]);

    const initGraphRankView = () => {
        if(graphId != null){
            getGraphByCommunity({community:graphId}).then((res)=>{
                const data = res.data;
                if(graphRef.current != null){
                    const container = graphRef.current;
                    d3.select(container).selectChildren().remove();
                    const graphView = new G6.Graph({
                        container: container,
                        fitView: true,
                        fitViewPadding: 20,
                        layout: {
                            type: 'force',
                            workerEnabled: true, 
                        },
                    });
                    graphView.data(data);
                    graphView.render();
                }else{
                    console.log(graphRef.current);
                }
            });
        }
    }

    return (
        <div className='graph-rank-view-container' style={{width:'100%', height:'20vh'}}>
            <div className='graph-rank-view-title'>
                <span>distance: {distance.toFixed(2)} </span>|
                <span style={{marginLeft:"0.2vw"}}>community: {graphId}</span>
            </div>
            <div className='graph-rank-view-content' onClick={graphRankViewClickHandle}>
                <div ref={graphRef} style={{width:'100%', height:'100%', overflow:'hidden'}}></div>
            </div>
       </div>);
};

export default GraphRankView    