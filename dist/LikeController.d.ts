import { Request, Response } from "express";
export declare const likePost: (req: Request, res: Response) => Promise<void>;
export declare const unlikePost: (req: Request, res: Response) => Promise<void>;
export declare const getPostLikes: (req: Request, res: Response) => Promise<void>;
