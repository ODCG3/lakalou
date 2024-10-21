import { Request, Response } from "express";
export default class NotificationController {
    static createNotification(userId: number, action: string, message: string, postId?: number): Promise<void>;
    static getNotifications(req: Request, res: Response): Promise<void>;
    static markAsRead(req: Request, res: Response): Promise<void>;
    static notifyFollowers(userId: number, postId: number): Promise<void>;
}
