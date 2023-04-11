// type definitions for community-list

export type props = {
    
}

export interface Attrtion {
    porn: number,
    gambling: number,
    fraud: number,
    drug: number,
    gun: number,
    hacker: number,
    trading: number,
    pay: number,
}
export interface Community extends Attrtion{
    id: number,
    node_num: number,
    wrong_num: number,
    key: string,
    wrong_list: number[],
    neighbour: number[]
}
