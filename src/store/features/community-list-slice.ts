// community-list store

import { createSlice } from "@reduxjs/toolkit"

export interface CommunityListState {
    currentCommunity: String
}

const initialState: CommunityListState = {
    currentCommunity: '1983081'
}

// create a slice
export const communityListSlice = createSlice({
    name: 'community-list',
    initialState,
    reducers: {
        // define reducers action
        setCommunity: (state: CommunityListState, {payload}) => {
            state.currentCommunity = payload.currentCommunity;
        }
    }
});

// export actions
export const {setCommunity} = communityListSlice.actions;

export default communityListSlice.reducer;