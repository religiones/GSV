import { createSlice } from "@reduxjs/toolkit"
import { subGraphType } from "../../components/@types/graph-view";

export interface graphState {
    graphRank: number[],
    graphDistance: number[],
    focusGraphs: number[],
    embeddingGraph: number|undefined,
    subGraph:subGraphType|undefined,
    subGraphList: subGraphType[]
}

const initialState: graphState = {
    graphRank: [],
    graphDistance: [],
    focusGraphs: [],
    embeddingGraph: undefined,
    subGraph: undefined,
    subGraphList: []
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
        },
        setSubGraph: (state: graphState, {payload}) => {
            state.subGraph = payload.subGraph;
        },
        setSubGraphList: (state: graphState, {payload}) => {
            state.subGraphList = payload.subGraphList;
        }
    }
})
// export actions
export const {setGraphRank, setGraphDistance, setFocusGraphs, setEmbeddingGraph, setSubGraph, setSubGraphList} = graphSlice.actions;

export default graphSlice.reducer;