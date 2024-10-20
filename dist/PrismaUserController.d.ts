import { Request, Response } from "express";
interface Tailleur {
    id: number;
    nom: string | null;
    prenom: string | null;
    email: string | null;
    photoProfile: string | null;
    role: string | null;
    averageRate: number;
    rank: number;
}
export default class PrismaUserController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static logout(req: Request, res: Response): void;
    static addNotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static filterByNotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getNotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserNotesFromPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static reportUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static unfollowUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static followUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static myFollowers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static myFollowings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;

    static profile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static changeRole(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static bloquerUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static debloquerUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUserBloquer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateNote(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static chargeCredit(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateMeasurements(req: Request, res: Response): Promise<Response>;
    static addMesure(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static findByName(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static acheterBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static acheterBadgeVandeur(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTailleurs(req: Request, res: Response): Promise<void>;
    static myPosition(req: Request, res: Response): Promise<void>;
    static getTailleurRanking(req?: Request, res?: Response): Promise<Tailleur[]>;
    static getStatistiques(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static filterTailleurById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static filterByName(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static filterTailleurByCertificat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getBalance: (req: Request, res: Response) => Promise<void>;
    static getConnectedUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static abonnementPremium(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
