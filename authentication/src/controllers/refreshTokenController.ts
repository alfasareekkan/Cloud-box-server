import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../model/User';



export const handleRefreshToken = async (req: Request, res: Response) => {
    
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