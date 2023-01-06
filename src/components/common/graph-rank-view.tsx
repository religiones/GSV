import React from 'react';
import { Community } from '../@types/communi-list';

type GraphRankViewProps = {
    distance: number,
    graph: Community
}

const GraphRankView: React.FC<GraphRankViewProps> = (props) => {
    const {distance, graph} = props;

    return (
        <div style={{width:'100%', height:'8vh'}}>

       </div>);
};

export default GraphRankView    