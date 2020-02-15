const getRandom = () => Math.random().toString(16).slice(-4)

export const uuid = () => `${getRandom()}-${getRandom()}-${getRandom()}-${getRandom()}${getRandom()}`
