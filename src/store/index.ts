// 创建一个store文件夹
// 创建一个index.ts做为主入口
// 创建一个festures文件夹用来装所有的store

import { configureStore } from "@reduxjs/toolkit";
import communityListSlice from "./features/community-list-slice";

const store = configureStore({
    // combine all slices
    reducer: {
        communityList: communityListSlice
    }
});

export default store;