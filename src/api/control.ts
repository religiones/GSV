import Axios from './axios';

export const getSimilarityGraph = (params:{target:string,source:string[],max:number}) => {
    return Axios({
        url: "/api/similarity",
        method: "post",
        data: params
    })
}