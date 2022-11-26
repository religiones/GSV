import Axios from './axios';

export const getCommunity = () => {
    return Axios({
        url: "/api/community",
        method: "get"
    })
}

