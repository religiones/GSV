import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const GraphRankGallery: React.FC<{}> = () => {
    const {focusGraphs} = useSelector((store: any)=>store.graph);
    
    useEffect(()=>{
        console.log(focusGraphs);
        
    },[focusGraphs]);

    return (
        <div style={{width:'100%', height:'100%'}}>
            
       </div>);
};

export default GraphRankGallery