import { createSlice } from "@reduxjs/toolkit"

export interface graphState {
    graphRank: number[],
    graphDistance: number[],
    focusGraphs: number[],
    embeddingGraph: number|undefined
}

const initialState: graphState = {
    graphRank: [],
    graphDistance: [],
    focusGraphs: [],
    embeddingGraph: undefined
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
        },
        setEmbeddingGraph: (state: graphState, {payload}) => {
            state.embeddingGraph = payload.embeddingGraph;
        }
    }
})
// export actions
export const {setGraphRank, setGraphDistance, setFocusGraphs, setEmbeddingGraph} = graphSlice.actions;

export default graphSlice.reducer;