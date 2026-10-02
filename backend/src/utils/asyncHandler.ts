import type { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<R extends Request = Request>(
  reqHandler: (
    req: R,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | unknown,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req as R, res, next)).catch((err) => next(err));
  };
}
