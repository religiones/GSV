import { createSlice } from "@reduxjs/toolkit"

export interface graphState {
    graphRank: number[],
    graphDistance: number[],
    focusGraphs: number[]
}

const initialState: graphState = {
    graphRank: [],
    graphDistance: [],
    focusGraphs: []
}

// create a slice
export const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        // define reducers action
        setGraphRank: (state: graphState, {payload}) => {
            state.graphRank = payload.graphRank;
        },
        setGraphDistance: (state: graphState, {payload}) => {
            state.graphDistance = payload.graphDistance;
        },
        setFocusGraphs: (state: graphState, {payload}) => {
            state.focusGraphs = payload.focusGraphs;
        }
    }
})
// export actions
export const {setGraphRank, setGraphDistance, setFocusGraphs} = graphSlice.actions;

export default graphSlice.reducer;