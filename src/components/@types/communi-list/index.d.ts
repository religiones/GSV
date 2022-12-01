// type definitions for community-list

export type props = {
    
}
export interface Community {
    id: number,
    node_num: number,
    wrong_num: number,
    porn: number,
    gambling: number,
    fraud: number,
    drug: number,
    gun: number,
    hacker: number,
    trading: number,
    pay: number,
    other: number,
    key: string,
    wrong_list: number[],
    neighbour: number[]
}