import { SettingData } from '../components/@types/control-panel';
import Axios from './axios';

export const connectTest = () => {
    return Axios({
        url: "/api/test",
        method: "get"
    })
}

export const getGraphByCommunity = (params:{community: number}) => {
    return Axios({
        url: "/api/graph",
        method: "post",
        data: params
    })
}

export const getGraphEmbeddingByCommunity = (params:{community: number}) => {
    return Axios({
        url: "/api/graphEmbedding",
        method: "post",
        data: params
    })
}

export const getGraphsByCommunities = (params:{communities: number[]}) => {
    return Axios({
        url: "/api/graphs",
        method: "post",
        data: params
    })
}

export const getSimilarityNodes = (params: {nodes:string[], community: number, graph: any, k: number, modelCfg: SettingData}) => {
    return Axios({
        url: "/api/similarityNodes",
        method: "post",
        data: params
    })
}