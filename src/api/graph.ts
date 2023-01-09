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