import type { FriendProfile, FriendRequest } from "./friends-types"

export const friendProfiles: FriendProfile[] = [
  { id: "friend-1", name: "Lina Morgan", role: "Home cook", initials: "LM", mutualFriends: 8 },
  { id: "friend-2", name: "Thanh Nguyen", role: "Recipe tester", initials: "TN", mutualFriends: 5 },
  { id: "friend-3", name: "Maya Rivera", role: "Weekend baker", initials: "MR", mutualFriends: 12 },
  { id: "friend-4", name: "Jamie Lee", role: "Food photographer", initials: "JL", mutualFriends: 3 },
]

export const friendRequests: FriendRequest[] = [
  { ...friendProfiles[1], sentAt: "2 hours ago" },
  { ...friendProfiles[3], sentAt: "Yesterday" },
]

export const friendSuggestions: FriendProfile[] = [
  { id: "suggestion-1", name: "Sofia Tran", role: "Bread enthusiast", initials: "ST", mutualFriends: 14 },
  { id: "suggestion-2", name: "Noah Williams", role: "Plant-based cook", initials: "NW", mutualFriends: 6 },
  { id: "suggestion-3", name: "Anika Shah", role: "Spice collector", initials: "AS", mutualFriends: 4 },
]
