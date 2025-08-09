import { Request, Response } from 'express';

export interface IController {
  index?(req: Request, res: Response): Promise<Response>;
  show?(req: Request, res: Response): Promise<Response>;
  store?(req: Request, res: Response): Promise<Response>;
  update?(req: Request, res: Response): Promise<Response>;
  destroy?(req: Request, res: Response): Promise<Response>;
} 