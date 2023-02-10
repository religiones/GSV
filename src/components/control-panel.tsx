import { Col, InputNumber, Radio, Row, Button, Slider, Modal, Select, Input } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSimilarityNodes } from '../api/graph';
import { setCombineNodes, setCombineNodesList } from '../store/features/graph-slice';
import { Community } from './@types/communi-list';
import { SettingData } from './@types/control-panel';
import { CombineNodes } from './@types/graph-view';
import GraphItem from './common/graph-item';
import "./style/control-panle.less";

const ControlPanel: React.FC<{}> = () => {
    const [settingData, setSettingData] = useState<SettingData>({
        training_algorithm: 'skip-gram',
        optimize: 'hierachical softmax',
        vector_size: 128,
        window: 5,
        epoch: 3,
        similarity: "KNN"
    });
    const dispatch = useDispatch();
    const algorithmOption = [{label:"skip-gram", value:"skip-gram"},{label:"CBOW", value:"CBOW"}];
    const optimizeOption = [{label:"hierachical softmax", value:"hierachical softmax"},{label:"neigative sampling", value:"neigative sampling"}];
    const { selectCommunities, currentCommunity } = useSelector((store: any) => store.communityList);
    const { selectNode, combineNodesList } = useSelector((store: any) => store.graph);
    const [sliderData, setSliderData] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [combineNodesName, setCombineNodesName] = useState<string>("");

    const okHandle = () => {
        if(selectNode != undefined && currentCommunity != null && sliderData != 0){
            getSimilarityNodes({nodes:[selectNode], community: currentCommunity.id, k: sliderData, modelCfg: settingData}).then(res=>{
                const {nodesId, distance} = res.data;
                const combineNodes: CombineNodes = {
                    name: combineNodesName,
                    nodeNum: nodesId.length,
                    community: currentCommunity.id,
                    combine: {
                        nodes: nodesId,
                        distance: distance
                    }
                }
                dispatch(setCombineNodes({combineNodes: combineNodes}));
                dispatch(setCombineNodesList({combineNodesList: [...combineNodesList, combineNodes]}));
                setIsModalOpen(false);
            });
        }else{
            console.log(selectNode,currentCommunity,sliderData);
        }
    }

    const searchSimilarityNodes = () => {
        setIsModalOpen(true);
    }

    return (
    <div style={{width:'100%', height:'100%', padding:"0.5vw", boxSizing:"border-box"}}>
        <div id="control">
            <Row style={{marginBottom:"0.5vh"}}>
                <p className='control-title'>Train Setting</p>
                <Col span={24}>            
                    <span className='control-title-small'>Train Algorithm</span>
                    <Select defaultValue={"skip-gram"} options={algorithmOption} size={"middle"}
                    onChange={(v)=>{
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{training_algorithm: v}}
                        });
                    }} ></Select>
                    <span className='control-title-small'>Optimize</span>
                    <Select defaultValue={"hierachical softmax"} options={optimizeOption} size={"middle"} style={{width:150}} 
                    onChange={(v)=>{
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{optimize: v}}
                        });
                    }}></Select>
                </Col>
            </Row>
            <Row style={{marginBottom:"0.5vh"}}>
                <Col span={24}>
                    <span className='control-title-small'>vector_size</span>
                    <InputNumber min={1} max={1024} defaultValue={128} style={{width:"3.5vw"}} 
                    onChange={(v)=>{
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{vector_size: v as number}}
                        });
                    }}></InputNumber>
                    <span className='control-title-small'>window</span>
                    <InputNumber min={1} max={100} defaultValue={5} style={{width:"3.5vw"}}
                    onChange={(v)=>{
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{window: v as number}}
                        });
                    }}></InputNumber>
                    <span className='control-title-small'>epoch</span>
                    <InputNumber min={1} max={100} defaultValue={3} style={{width:"3.5vw"}}
                    onChange={(v)=>{
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{epoch: v as number}}
                        });
                    }}></InputNumber>
                </Col>
            </Row>
            <Row style={{marginBottom:"0.5vh"}}>
                <p className='control-title'>Similarity Setting</p>
                <Col span={24}>
                    <Radio.Group defaultValue={"KNN"} onChange={(e)=>{
                        const v = e.target.value;
                        setSettingData((pre:SettingData)=>{
                            return {...pre, ...{similarity: v}}
                        });
                    }}>
                        <Radio style={{marginLeft:"1vw"}} value={"KNN"}>KNN (K-Nearest Neighbor)</Radio>
                        <Radio style={{marginLeft:"2vw"}} value={"KDT"}>KDT ( k-Dimension Tree)</Radio>
                    </Radio.Group>
                </Col>
            </Row>
        </div>
        <div id='target-graph'>
            <p className='control-title'>K Value</p>
            <Slider min={1} max={
                selectCommunities.length==0?100:selectCommunities[selectCommunities.length-1]["node_num"]
            } onAfterChange={(value: number)=>{setSliderData(value);}}></Slider>
        </div>
        <div id='select-graph'>
            <p className='control-title'>Select Graph</p>
            <div className='graph-list' style={{height:"80%", padding:'0.2rem', overflowY:"scroll"}}>
                {
                    selectCommunities.map((item: Community, id:number)=>{
                        return <GraphItem key={id} width={100} height={40} graph={item} isTarget={false}/>
                    })
                }
            </div>
        </div>
        <Button className='control-button' onClick={searchSimilarityNodes}>Combine Similarity Nodes</Button>
        <Modal title="Combine Name" open={isModalOpen} onCancel={()=>{setIsModalOpen(false)}} onOk={okHandle}>
            <Input onChange={(e)=>{setCombineNodesName(e.target.value)}}></Input>
        </Modal>
    </div>);
};

export default ControlPanel