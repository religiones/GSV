// type definitions for graph-view
export interface Node{
    id: string,
    property?: any,
}

export interface Edge{
    source: string,
    target: string
}

export type graphData = {
    nodes: Node[],
    edges: EDge[]
}

export type SetState<T> = Dispatch<SetStateAction<T>>;