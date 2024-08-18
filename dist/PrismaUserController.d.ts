import { Request, Response } from 'express';
export default class PrismaUserController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static logout(req: Request, res: Response): void;
    static addNotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateNote(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
