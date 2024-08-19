import { Request, Response } from 'express';
export declare const addComment: (req: Request, res: Response) => Promise<void>;
export declare const deleteComment: (req: Request, res: Response) => Promise<void>;
export declare const getPostComments: (req: Request, res: Response) => Promise<void>;
