import { Request, Response } from 'express';
export default class ArticleController {
    static createArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
