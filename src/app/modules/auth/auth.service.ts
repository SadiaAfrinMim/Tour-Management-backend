/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorhelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import httpStatus  from 'http-status-codes';
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken"

import  bcryptjs  from 'bcryptjs';
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken";

// const credentialsLogin = async (payload:Partial<IUser>)=>{
//     const {email,password} = payload;
//     const isUserExist = await User.findOne({email});
//     if(!isUserExist){
//         throw new AppError(httpStatus.BAD_REQUEST,"Email doesn't  Exist")
//     }
//     const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

//     if(!isPasswordMatched){
//         throw new AppError(httpStatus.BAD_REQUEST,"Incorrect Password")
//     }

//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email:isUserExist.email,
//     //     role:isUserExist.role
//     // }
//     // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
//     // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

//     const userTokens = createUserTokens(isUserExist)

//     const {password:pass ,...rest} = isUserExist.toObject()

//     // const accessToken = jwt.sign(jwtPayload,"secret",{
//     //     expiresIn:"1d"
//     // })
   
//     return {
//         accessToken: userTokens.accessToken,
//          refreshToken: userTokens.refreshToken,
//          user: rest
//     }

// }

const getNewAccessToken = async (refreshToken: string)=>{
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

    // const userTokens = createUserTokens(isUserExist)

    // const {password:pass ,...rest} = isUserExist.toObject()

    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })
   
    return {
        accessToken:newAccessToken

}
}

const resetPassword = async (oldPassword:string,newPassword:string, decodedToken:JwtPayload)=>{
    const user = await User.findById(decodedToken.userId)
    const isOldPassWordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if(!isOldPassWordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED,"old password doest not match");
        
    }
  user!.password =await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
  user!.save()


  
  
}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}


// const setPassword = async (userId: string,Plainpassword:string)=>{
//     const user = await User.findById(userId)

//     if(!user){
//       throw new AppError(404,"user not found")
//     }
//     if(user.password && user.auths.some(providerObject =>providerObject.provider ==="google")){
//       throw new AppError(httpStatus.BAD_REQUEST,"you have already set your password. Now you can change the password from your profile password update")
//     }

//     const hashedPassword = await bcryptjs.hash(
//       Plainpassword,
//       Number(envVars.BCRYPT_SALT_ROUND)
//     )

//     const credentialProvider: IAuthProvider = {
//       provider:"credentials",
//       providerId: user.email
//     }

//     const auths:IAuthProvider[] = [...user.auths,credentialProvider]

//       user.password = hashedPassword

//       user.auths = auths 

//       await user.save()

  
  
// }


export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    setPassword
}