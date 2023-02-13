import { createSlice } from "@reduxjs/toolkit"
import { subGraphType, CombineNodes, Combine } from "../../components/@types/graph-view";

export interface graphState {
    graphRank: number[],
    graphDistance: number[],
    focusGraphs: number[],
    embeddingGraph: number|undefined,
    subGraph:subGraphType|undefined,
    subGraphList: subGraphType[],
    selectNode: string|undefined,
    combineNodes: CombineNodes|undefined,
    combineNodesList: CombineNodes[],
    deleteNodes: string[],
    isCombine: {
        flag: boolean,
        target: Combine|undefined
    }
}

const initialState: graphState = {
    graphRank: [],
    graphDistance: [],
    focusGraphs: [],
    embeddingGraph: undefined,
    subGraph: undefined,
    subGraphList: [],
    selectNode: undefined,
    combineNodes: undefined,
    combineNodesList: [],
    deleteNodes: [],
    isCombine: {
        flag: false,
        target: undefined
    }
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
        },
        setSelectNode: (state: graphState, {payload}) => {
            state.selectNode = payload.selectNode;
        },
        setCombineNodes: (state: graphState, {payload}) => {
            state.combineNodes = payload.combineNodes;
        },
        setCombineNodesList: (state: graphState, {payload}) => {
            state.combineNodesList = payload.combineNodesList;
        },
        setDeleteNodes: (state: graphState, {payload}) => {
            state.deleteNodes = payload.deleteNodes;
        },
        setIsCombine: (state: graphState, {payload}) => {
            state.isCombine = payload.isCombine;
        }
    }
})
// export actions
export const {setGraphRank, setGraphDistance, setFocusGraphs, 
    setEmbeddingGraph, setSubGraph, setSubGraphList,
    setSelectNode, setCombineNodes, setCombineNodesList,
    setDeleteNodes, setIsCombine} = graphSlice.actions;

export default graphSlice.reducer;