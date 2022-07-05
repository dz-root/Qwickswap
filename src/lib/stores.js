import { writable } from "svelte/store";

export const currentUser = writable('loading')
export const currentChain = writable('')
export const currentChainID = writable('')
export const nativeBalance = writable(0)
export const userBalances = writable({})
export const slippage = writable(0.5)