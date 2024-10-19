import { Request, Response } from 'express';
export default class DislikeController {
    static dislikePost(req: Request, res: Response): Promise<void>;
    static undislikePost(req: Request, res: Response): Promise<void>;
    static getPostDislike(req: Request, res: Response): Promise<void>;
}
