import G6 from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getGraphByCommunity } from '../../api/graph';
import { setEmbeddingGraph } from '../../store/features/graph-slice';
import "../style/graph-rank-view.less";
import * as d3 from 'd3';

type GraphRankViewProps = {
    distance: number,
    graphId: number
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {distance, graphId} = props;
    const graphRef:LegacyRef<HTMLDivElement> = createRef();
    const dispatch = useDispatch();

    const graphRankViewClickHandle = () => {
        dispatch(setEmbeddingGraph({embeddingGraph: graphId}));
    }    

    useEffect(()=>{
        initGraphRankView();
    },[graphId]);

    const initGraphRankView = () => {
        if(graphId != null){
            getGraphByCommunity({community:graphId}).then((res)=>{
                const data = res.data;
                if(graphRef.current != undefined){
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