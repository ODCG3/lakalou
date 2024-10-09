import { Request, Response } from 'express';
export default class ListeSouhaitsController {
    static listeSouhaits(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static voirListeSouhaits(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static supprimerSouhait(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
