export type FriendProfile = {
  id: string
  name: string
  role: string
  initials: string
  avatar?: string
  mutualFriends: number
}

export type FriendRequest = FriendProfile & {
  sentAt: string
}

export type FriendSnapshot = {
  friends: FriendProfile[]
  requests: FriendRequest[]
  suggestions: FriendProfile[]
}
