import { Request, Response } from "express";
export default class LikeController {
    static likePost(req: Request, res: Response): Promise<void>;
    static unlikePost(req: Request, res: Response): Promise<void>;
    static getPostLikes(req: Request, res: Response): Promise<void>;
}
