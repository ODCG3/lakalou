import { Request, Response } from "express";
declare class NotificationController {
    static createNotification(userId: number, action: string, message: string, postId?: number): Promise<void>;
    static getNotifications(req: Request, res: Response): Promise<void>;
    static markAsRead(req: Request, res: Response): Promise<void>;
    static notifyFollowers(userId: number, postId: number): Promise<void>;
}
export default NotificationController;
