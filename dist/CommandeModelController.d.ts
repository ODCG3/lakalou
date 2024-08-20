import { Request, Response } from "express";
export default class CommandeModelController {
    static createCommande(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getCommandes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getCommandeById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
