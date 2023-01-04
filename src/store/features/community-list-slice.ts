// community-list store

import { createSlice } from "@reduxjs/toolkit"
import { Community } from "../../components/@types/communi-list";
export interface CommunityListState {
    currentCommunity: Community|null,
    communities: Community[]|null,
    selectCommunities: Community[]
}

const initialState: CommunityListState = {
    currentCommunity: null,
    communities: null,
    selectCommunities: []
}

// create a slice
export const communityListSlice = createSlice({
    name: 'community-list',
    initialState,
    reducers: {
        // define reducers action
        setCommunity: (state:CommunityListState, {payload}) => {
            state.currentCommunity = payload.currentCommunity;
        },
        setCommunities: (state: CommunityListState, {payload}) => {
            state.communities = payload.communities;
        },
        setSelectCommunities: (state: CommunityListState, {payload}) => {
            state.selectCommunities = payload.selectCommunities;
        }
    }
});

// export actions
export const {setCommunity, setCommunities, setSelectCommunities} = communityListSlice.actions;

export default communityListSlice.reducer;