import { Attrtion } from "../communi-list"

// type definitions for graph-view
export interface Node{
    id: string,
    property?: Attrtion,
}

export interface Edge{
    source: any,
    target: any
}

export type graphData = {
    nodes: Node[],
    edges: EDge[],
    index?: Number
}

export type subGraphType = {
    name: string,
    data: graphData
}

export type Combine = {
    nodes: string[],
    distance: number[]
}

export type CombineNodes  = {
    name: string,
    nodeNum: number,
    community: number,
    combine: Combine,
    isCombine: boolean
}

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type D3Selection = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;