import { Request, Response } from "express";
export default class CommentController {

    static addComment(req: Request, res: Response): Promise<Response>;
    static deleteComment(req: Request, res: Response): Promise<Response>;
    static addReply(req: Request, res: Response): Promise<Response>;
    static getPostComments(req: Request, res: Response): Promise<Response>;

}
