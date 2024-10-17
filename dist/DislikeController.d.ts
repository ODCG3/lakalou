import { Request, Response } from 'express';
export declare const dislikePost: (req: Request, res: Response) => Promise<void>;
export declare const undislikePost: (req: Request, res: Response) => Promise<void>;
export declare const getPostDislike: (req: Request, res: Response) => Promise<void>;
