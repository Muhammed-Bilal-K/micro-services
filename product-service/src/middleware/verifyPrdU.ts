import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  const token = req.cookies.access_token;

  console.log(token);

  if (!token)
    return res.status(400).json({ success: false, message: "You are not authenticated!'" });

  jwt.verify(
    token,
    process.env.JWT_SECRET as Secret,
    async (err: unknown , user: unknown) => {
      console.log(user , 'user');
      if (err) return res.status(400).json({ message: "tocken not valid!'" });
      else console.log("jwt verified");
      req.user = user;
      console.log(req.user , 'from verify!');
      next();
    }
  );
};

export { verifyToken };
