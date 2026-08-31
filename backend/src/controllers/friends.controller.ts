import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { friendsService } from "../services/friends.service.js";

export class FriendsController {
  async getSnapshot(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) { res.status(401).json({ success: false, message: "Not authorized" }); return; }
      res.status(200).json({ success: true, data: await friendsService.getSnapshot(req.user.id) });
    } catch (error) { next(error); }
  }

  async sendRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) { res.status(401).json({ success: false, message: "Not authorized" }); return; }
      const recipientId = String(req.body.recipientId || "");
      if (!recipientId) { res.status(400).json({ success: false, message: "recipientId is required" }); return; }
      res.status(201).json({ success: true, data: await friendsService.sendRequest(req.user.id, recipientId) });
    } catch (error) { next(error); }
  }

  async updateRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) { res.status(401).json({ success: false, message: "Not authorized" }); return; }
      const status = req.body.status === "accepted" || req.body.status === "declined" ? req.body.status : null;
      if (!status) { res.status(400).json({ success: false, message: "status must be accepted or declined" }); return; }
      res.status(200).json({ success: true, data: await friendsService.updateRequest(req.user.id, String(req.params.id), status) });
    } catch (error) { next(error); }
  }
}

export const friendsController = new FriendsController();
