import { Request, Response, json } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User, { IUser } from '../model/User';
import { createToken } from './authController';



export const handleRefreshToken = async (req: Request, res: Response) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization;
    try {
        
         if(!authHeader) throw new Error
    if (typeof authHeader === 'string') {
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(403);
        const token = authHeader.split(' ')[1]; 
        jwt.verify(
            token,
            process.env.JWTKEY,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
                let userToken 
                if (typeof decoded === 'string') {
                    
                    userToken=JSON.parse(decoded)
                } else {
                    userToken=decoded
                }
            
                
                const user =await User.findOneUser(userToken.UserInfo.username)
                
                if (!user) return res.sendStatus(403);
                const refreshToken = createToken(user, '15s')
                console.log(refreshToken,"😒😒");
                
                res.status(200).json({refreshToken})
                
            }
        );
    }
} catch (error) {
    res.sendStatus(403);
    
}
    
 }
    
    
//     const cookies = req.cookies;
//     if (!cookies?.jwt) return res.sendStatus(401);
//     const refreshToken = cookies.jwt;
//     res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

//     const foundUser = await User.findOne({ refreshToken }).exec();
//     // if (REFRESH_TOKEN_SECRET) {

//         // Detected refresh token reuse!
//         if (!foundUser) {
//             jwt.verify(
//                 refreshToken,
//                 process.env.REFRESH_TOKEN_SECRET,
//                 async (err:any, decoded:any) => {
//                     if (err) return res.sendStatus(403); //Forbidden
//                     // Delete refresh tokens of hacked user
//                     const hackedUser = await User.findOne({ email: decoded.email }).exec();
//                     hackedUser.refreshToken = [];
//                     const result = await hackedUser.save();
//                 }
//             )
//             return res.sendStatus(403); //Forbidden
//         }

//         const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

//         // evaluate jwt 
//         jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET,
//             async (err:any, decoded:any) => {
//                 if (err) {
//                     // expired refresh token
//                     foundUser.refreshToken = [...newRefreshTokenArray];
//                     const result = await foundUser.save();
//                 }
//                 if (err || foundUser.email !== decoded.username) return res.sendStatus(403);

//                 // Refresh token was still valid
//                 const accessToken = jwt.sign(
//                     {
//                         UserInfo: {
//                             username: foundUser.email,
//                               id: foundUser._id,
                            
//                         }
//                     },
//                     process.env.JWTKEY,
//                     { expiresIn: '10s' }
//                 );

//                 const newRefreshToken = jwt.sign(
//                     { "username": foundUser.email },
//                     process.env.REFRESH_TOKEN_SECRET,
//                       { expiresIn: '15s' }
//                 );
//                 // Saving refreshToken with current user
//                 foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//                 const result = await foundUser.save();

//                 // Creates Secure Cookie with refresh token
//                 res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

//                 res.json({ accessToken,user:foundUser.email })
            
//             }
//         );
//     // }
// }