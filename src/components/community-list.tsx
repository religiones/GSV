import React, { createRef, LegacyRef, useEffect } from 'react';
import { getCommunity } from '../api/community';
import { builder, buildNumberColumn, buildStringColumn } from 'lineupjs';
import taggle from 'lineupjs/build/src/ui/taggle';

const CommunityList: React.FC<{}> = () => {
    let lineUp: taggle|null = null
    const container: LegacyRef<HTMLDivElement> = createRef();
    
    useEffect(()=>{
        getCommunity().then(res=>{
            const data = res.data;
            const dataBuilder = builder(data);
            dataBuilder.column(buildStringColumn('id').width(80))
            .column(buildNumberColumn('node_num', [0, NaN]).width(100))
            .column(buildNumberColumn('wrong_num', [0, NaN]).width(100));
            // useRef 获取 dom第一次总是null
            lineUp = dataBuilder.buildTaggle(container.current as HTMLElement);
        })
        console.log(container.current);
        
    },[])



    return (
        <div style={{width:'100%', height:'100%'}}>
            <div ref={container} style={{width:'100%', height:'100%'}}></div>
       </div>);
};

export default CommunityList