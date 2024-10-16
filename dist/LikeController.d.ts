import { Request, Response } from "express";
export default class LikeController {
    static likePost(req: Request, res: Response): Promise<void>;
    static unlikePost(req: Request, res: Response): Promise<void>;
    static countPostLikes(req: Request, res: Response): Promise<void>;
}
