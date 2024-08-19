import { Request, Response } from 'express';
export default class PrismaUserController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static logout(req: Request, res: Response): void;
    static addNotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static reportUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static unfollowUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static followUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static profile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static changeRole(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static bloquerUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateNote(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static chargeCredit(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
