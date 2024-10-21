import { Request, Response } from "express";
declare const _default: {
    createStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getStories: (req: Request, res: Response) => Promise<void>;
    deleteStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    viewStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getStoryViews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getUserStories: (req: Request, res: Response) => Promise<void>;
    getOtherUserStories: (req: Request, res: Response) => Promise<void>;
};
export default _default;
