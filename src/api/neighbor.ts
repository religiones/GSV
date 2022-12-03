import Axios from "./axios"

export const getNeighborByCommunity = (communities: number[]) => {
    return Axios({
        url: "/api/neighbors",
        method: 'post',
        data: {
            communities: communities
        }
    })
}