import { friendProfiles, friendRequests, friendSuggestions } from "./friends-data"
import type { FriendSnapshot } from "./friends-types"

const FRIENDS_STATE_KEY = "touchless-friends-state"
export const FRIENDS_CHANGE_EVENT = "touchless-friends-change"

type FriendsState = { acceptedIds: string[]; declinedIds: string[]; sentIds: string[] }

function getState(): FriendsState {
  try {
    const stored = localStorage.getItem(FRIENDS_STATE_KEY)
    return stored ? JSON.parse(stored) as FriendsState : { acceptedIds: [], declinedIds: [], sentIds: [] }
  } catch {
    return { acceptedIds: [], declinedIds: [], sentIds: [] }
  }
}

function updateState(update: (state: FriendsState) => FriendsState) {
  localStorage.setItem(FRIENDS_STATE_KEY, JSON.stringify(update(getState())))
  window.dispatchEvent(new Event(FRIENDS_CHANGE_EVENT))
}

export function getFriendSnapshot(): FriendSnapshot {
  const state = getState()
  return {
    friends: friendProfiles.filter((friend) => state.acceptedIds.includes(friend.id)),
    requests: friendRequests.filter((request) => !state.declinedIds.includes(request.id) && !state.acceptedIds.includes(request.id)),
    suggestions: friendSuggestions.filter((friend) => !state.sentIds.includes(friend.id)),
  }
}

export function acceptFriendRequest(id: string) {
  updateState((state) => ({ ...state, acceptedIds: [...new Set([...state.acceptedIds, id])] }))
}

export function declineFriendRequest(id: string) {
  updateState((state) => ({ ...state, declinedIds: [...new Set([...state.declinedIds, id])] }))
}

export function sendFriendRequest(id: string) {
  updateState((state) => ({ ...state, sentIds: [...new Set([...state.sentIds, id])] }))
}
