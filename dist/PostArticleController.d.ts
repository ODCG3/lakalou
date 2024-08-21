import { Request, Response } from 'express';
export default class PostArticleController {
    static createPostArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
