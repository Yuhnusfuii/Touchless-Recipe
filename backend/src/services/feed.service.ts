import Post from "../models/post.model.js";

export interface CreatePostDTO {
  title?: string;
  body: string;
  image?: string;
  tags?: string[];
}

export class FeedService {
  private formatPost(post: any) {
    const author = post.userId && typeof post.userId === "object" ? post.userId : {};
    return {
      id: String(post._id),
      author: author.name || "Community cook",
      initials: (author.name || "CC").split(" ").filter(Boolean).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase(),
      avatar: author.image,
      role: "Home cook",
      time: post.createdAt instanceof Date ? post.createdAt.toISOString() : String(post.createdAt),
      title: post.title,
      body: post.body,
      image: post.image,
      tags: post.tags || [],
      likes: Array.isArray(post.likes) ? post.likes.length : 0,
      comments: (post.comments || []).map((comment: any) => {
        const commenter = comment.userId && typeof comment.userId === "object" ? comment.userId : {};
        return {
          id: String(comment._id),
          author: commenter.name || "Community cook",
          avatar: commenter.image || (commenter.name || "CC").split(" ").map((part: string) => part[0]).join("").toUpperCase(),
          text: comment.text,
        };
      }),
    };
  }

  async getPosts(search?: string) {
    const filter = search?.trim()
      ? { $or: [{ title: { $regex: search.trim(), $options: "i" } }, { body: { $regex: search.trim(), $options: "i" } }, { tags: { $regex: search.trim(), $options: "i" } }] }
      : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name image")
      .populate("comments.userId", "name image")
      .lean();
    return posts.map((post) => this.formatPost(post));
  }

  async createPost(userId: string, data: CreatePostDTO) {
    const body = data.body.trim();
    if (!body && !data.image) throw new Error("Post body or image is required");

    const post = await Post.create({
      userId,
      title: data.title?.trim() || "A little something from my kitchen",
      body,
      image: data.image,
      tags: Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === "string").slice(0, 8) : [],
    });

    const createdPost = await Post.findById(post.id).populate("userId", "name image").lean();
    return createdPost ? this.formatPost(createdPost) : null;
  }
}

export const feedService = new FeedService();