import { Request, Response } from "express";
export default class CommentController {
    static addComment(req: Request, res: Response): Promise<void>;
    static deleteComment(req: Request, res: Response): Promise<void>;
    static getPostComments(req: Request, res: Response): Promise<void>;
}
