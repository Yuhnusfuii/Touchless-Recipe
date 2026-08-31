import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { feedService } from "../services/feed.service.js";

export class FeedController {
  async getPosts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      res.status(200).json({ success: true, data: await feedService.getPosts(search) });
    } catch (error) { next(error); }
  }

  async createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) { res.status(401).json({ success: false, message: "Not authorized" }); return; }
      const body = typeof req.body.body === "string" ? req.body.body : "";
      const image = typeof req.body.image === "string" ? req.body.image : undefined;
      if (!body.trim() && !image) { res.status(400).json({ success: false, message: "Post body or image is required" }); return; }
      const post = await feedService.createPost(req.user.id, { title: req.body.title, body, image, tags: req.body.tags });
      res.status(201).json({ success: true, data: post });
    } catch (error) { next(error); }
  }
}

export const feedController = new FeedController();