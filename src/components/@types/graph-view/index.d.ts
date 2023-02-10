import { Attrtion } from "../communi-list"

// type definitions for graph-view
export interface Node{
    id: string,
    property?: Attrtion,
}

export interface Edge{
    source: string,
    target: string
}

export type graphData = {
    nodes: Node[],
    edges: EDge[]
}

export type subGraphType = {
    name: string,
    data: graphData
}

export type CombineNodes  = {
    name: string,
    nodeNum: number,
    community: number,
    combine: {
        nodes: string,
        distance: number
    }
}

export type SetState<T> = Dispatch<SetStateAction<T>>;