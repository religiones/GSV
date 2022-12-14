export interface SettingData {
    training_algorithm: "skip-gram"|"CBOW",
    optimize: "hierachical softmax"|"neigative sampling",
    vector_size: number,
    window: number,
    epoch: number,
    similarity: "KNN (K-Nearest Neighbor)"|"KDT"
}