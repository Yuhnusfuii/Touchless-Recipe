import mongoose, { Document, Schema } from "mongoose";

export interface IPostComment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId?: mongoose.Types.ObjectId;
  title: string;
  body: string;
  image?: string;
  tags: string[];
  comments: IPostComment[];
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IPostComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const postSchema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, trim: true },
    tags: { type: [String], default: [] },
    comments: { type: [commentSchema], default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;