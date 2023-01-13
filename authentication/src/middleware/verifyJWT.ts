import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET: string | undefined = process.env.JWTKEY;

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === "string") {
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid token
      // req.body.user = decoded.UserInfo.username;

      const userInfo: JwtPayload | string = jwt.decode(token);
      if (typeof userInfo !== "string") {
        const id = userInfo.UserInfo.id;
        req.headers.userId=id;
      } else {
        const userObject = JSON.parse(userInfo);
        req.headers.userId= userObject.UserInfo.id;
      }
      next();
    });
  }
};

export default verifyJWT;
