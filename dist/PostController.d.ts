import { Request, Response } from 'express';
export default class PostController {
    static createPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getPosts(req: Request, res: Response): Promise<void>;
}
