import { Request, Response } from "express";
export default class PostController {
    static createPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getPosts(req: Request, res: Response): Promise<void>;
    static getPostById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deletePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static addView(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getVues(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static addFavoris(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserFavorites(req: Request, res: Response): Promise<void>;
    static deleteFavoris(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static partagerPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static notifyFollowers(userId: number, postId: number): Promise<void>;
    static deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
