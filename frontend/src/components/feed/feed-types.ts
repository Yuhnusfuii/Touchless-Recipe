export type FeedComment = {
  id: string
  author: string
  avatar: string
  text: string
}

export type FeedPost = {
  id: string
  author: string
  initials: string
  avatar?: string
  role: string
  time: string
  title: string
  body: string
  image?: string
  tags: string[]
  likes: number
  comments: FeedComment[]
  isLiked?: boolean
  isSaved?: boolean
}