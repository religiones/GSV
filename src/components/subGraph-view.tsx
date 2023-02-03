import { Button, Row } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const SubGraphView: React.FC<{}> = () => {
    const {combineNodesList, combineNodes} = useSelector((store: any)=>store.graph);

    useEffect(()=>{
        console.log(combineNodesList);
        
    }, [combineNodesList])

    return (
        <div style={{width:'100%', height:'100%'}}>
            
       </div>);
};

export default SubGraphView