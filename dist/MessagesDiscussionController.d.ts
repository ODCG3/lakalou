import { Request, Response } from "express";
export default class MessagesDiscussionController {
    static createDiscussion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getDiscussions(req: Request, res: Response): Promise<void>;
    static getDiscussionById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getDiscussionsByUser(req: Request, res: Response): Promise<void>;
    static sendMessageToDiscussion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static modifierMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
