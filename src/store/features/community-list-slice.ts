// community-list store

import { createSlice } from "@reduxjs/toolkit"
import { Community } from "../../components/@types/communi-list";
export interface CommunityListState {
    currentCommunityId: string
    currentCommunity: Community|null
}

const initialState: CommunityListState = {
    currentCommunityId: '1983081',
    currentCommunity: null
}

// create a slice
export const communityListSlice = createSlice({
    name: 'community-list',
    initialState,
    reducers: {
        // define reducers action
        setCommunityId: (state: CommunityListState, {payload}) => {
            state.currentCommunityId = payload.currentCommunityId;
        },
        setCommunity: (state:CommunityListState, {payload}) => {
            state.currentCommunity = payload.currentCommunity;
        }
    }
});

// export actions
export const {setCommunityId, setCommunity} = communityListSlice.actions;

export default communityListSlice.reducer;