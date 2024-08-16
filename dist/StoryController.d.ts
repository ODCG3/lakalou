import { Request, Response } from 'express';
declare const _default: {
    createStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getStories: (req: Request, res: Response) => Promise<void>;
    deleteStory: (req: Request, res: Response) => Promise<void>;
    viewStory: (req: Request, res: Response) => Promise<void>;
    getStoryViews: (req: Request, res: Response) => Promise<void>;
};
export default _default;
