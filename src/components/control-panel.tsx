import { Col, InputNumber, Radio, Row, Button} from 'antd';
import Select from 'antd/es/select';
import React, { useState } from 'react';
import { SettingData } from './@types/control-panel';
import "./style/control-panle.less";

const ControlPanel: React.FC<{}> = () => {
    const [settingData, setSettingData] = useState<SettingData|undefined>({
        training_algorithm: 'skip-gram',
        optimize: 'hierachical softmax',
        vector_size: 128,
        window: 5,
        epoch: 3,
        similarity: "KNN (K-Nearest Neighbor)"
    });

    const algorithmOption = [{label:"skip-gram", value:"skip-gram"},{label:"CBOW", value:"CBOW"}];
    const optimizeOption = [{label:"hierachical softmax", value:"hierachical softmax"},{label:"neigative sampling", value:"neigative sampling"}];
    return (
    <div style={{width:'100%', height:'100%', padding:"0.5vw", boxSizing:"border-box"}}>
        <div id="control">
            <Row style={{marginBottom:"0.5vh"}}>
                <p className='control-title'>Train Setting</p>
                <Col span={24}>            
                    <span className='control-title-small'>Train Algorithm</span>
                    <Select defaultValue={"skip-gram"} options={algorithmOption} size={"middle"}></Select>
                    <span className='control-title-small'>Optimize</span>
                    <Select defaultValue={"hierachical softmax"} options={optimizeOption} size={"middle"} style={{width:150}}></Select>
                </Col>
            </Row>
            <Row style={{marginBottom:"0.5vh"}}>
                <Col span={24}>
                    <span className='control-title-small'>vector_size</span>
                    <InputNumber min={1} max={1024} defaultValue={128} style={{width:"3.5vw"}}></InputNumber>
                    <span className='control-title-small'>window</span>
                    <InputNumber min={1} max={100} defaultValue={5} style={{width:"3.5vw"}}></InputNumber>
                    <span className='control-title-small'>epoch</span>
                    <InputNumber min={1} max={100} defaultValue={3} style={{width:"3.5vw"}}></InputNumber>
                </Col>
            </Row>
            <Row style={{marginBottom:"0.5vh"}}>
                <p className='control-title'>Similarity Setting</p>
                <Col span={24}>
                    <Radio.Group defaultValue={"KNN"}>
                        <Radio style={{marginLeft:"1vw"}} value={"KNN"}>KNN (K-Nearest Neighbor)</Radio>
                        <Radio style={{marginLeft:"2vw"}} value={"KDT"}>KDT ( k-Dimension Tree)</Radio>
                    </Radio.Group>
                </Col>
            </Row>
        </div>
        <div id='target-graph'>
            <p className='control-title'>Target Graph</p>
            <div className='graph-list' style={{height:"60%"}}></div>
        </div>
        <div id='select-graph'>
            <p className='control-title'>Select Graph</p>
            <div className='graph-list' style={{height:"80%"}}></div>
        </div>
        <Button className='control-button'>Search Similarity Graph</Button>
    </div>);
};

export default ControlPanel