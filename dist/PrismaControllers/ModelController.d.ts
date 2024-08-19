import { Request, Response } from "express";
export default class ModelController {
    static create(req: Request, res: Response): Promise<void>;
    static getModelsByUserId(req: Request, res: Response): Promise<void>;
    static getModelById(req: Request, res: Response): Promise<void>;
    static updateModel(req: Request, res: Response): Promise<void>;
    static deleteModel(req: Request, res: Response): Promise<void>;
}
