// community-list store

import { createSlice } from "@reduxjs/toolkit"
import { Community } from "../../components/@types/communi-list";
export interface CommunityListState {
    currentCommunityId: string,
    currentCommunity: Community|null,
    communities: Community[]|null
}

const initialState: CommunityListState = {
    currentCommunityId: '1983081',
    currentCommunity: null,
    communities: null
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
        },
        setCommunities: (state: CommunityListState, {payload}) => {
            state.communities = payload.communities;
        }
    }
});

// export actions
export const {setCommunityId, setCommunity, setCommunities} = communityListSlice.actions;

export default communityListSlice.reducer;