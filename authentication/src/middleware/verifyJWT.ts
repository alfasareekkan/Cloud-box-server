import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

const JWT_SECRET: string | undefined = process.env.JWTKEY; 

const verifyJWT = (req: Request, res: Response, next: NewableFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader === 'string') {
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(
            token,
            // JWT_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403); //invalid token
                // req.body.user = decoded.UserInfo.username;
                next();
            }
        );
    }
    
}

module.exports = verifyJWT