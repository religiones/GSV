import G6 from '@antv/g6';
import React, { createRef, LegacyRef, useEffect } from 'react';
import { getGraphByCommunity } from '../../api/graph';
import { Community } from '../@types/communi-list';
import "../style/graph-rank-view.less";

type GraphRankViewProps = {
    distance: number,
    graph: Community
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {distance, graph} = props;
    const graphRef:LegacyRef<HTMLDivElement> = createRef();
    useEffect(()=>{
        initGraphRankView();
    },[graph]);

    const initGraphRankView = () => {
        if(graph != null){
            getGraphByCommunity({community:graph.id}).then((res)=>{
                const data = res.data;
                if(graphRef.current != undefined){
                    const container = graphRef.current;
                    container.removeChild;
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
                <span style={{marginLeft:"0.2vw"}}>community: {graph.id}</span>
            </div>
            <div className='graph-rank-view-content'>
                <div ref={graphRef} style={{width:'100%', height:'100%', overflow:'hidden'}}></div>
            </div>
       </div>);
};

export default GraphRankView    