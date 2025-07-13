/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorhelpers/AppError";
import { IsActive, IUser } from "../user/user.interface"
import httpStatus  from 'http-status-codes';
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken"

import  bcryptjs  from 'bcryptjs';
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { createUserTokens } from "../../utils/userToken";

const credentialsLogin = async (payload:Partial<IUser>)=>{
    const {email,password} = payload;
    const isUserExist = await User.findOne({email});
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"Email doesn't  Exist")
    }
    const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,"Incorrect Password")
    }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email:isUserExist.email,
    //     role:isUserExist.role
    // }
    // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

    const userTokens = createUserTokens(isUserExist)

    const {password:pass ,...rest} = isUserExist.toObject()

    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })
   
    return {
        accessToken: userTokens.accessToken,
         refreshToken: userTokens.refreshToken,
         user: rest
    }

}

const getNewAccessToken = async (refreshToken: string)=>{
    const verifiedRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
    
   
    const isUserExist = await User.findOne({email: verifiedRefreshToken.email});
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"user doesn't  Exist")
    }

     if(isUserExist.isActive === IsActive.BLOCKED||isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST,`user is ${isUserExist.isActive}`)
    }

     if(isUserExist.isDeleted ){
        throw new AppError(httpStatus.BAD_REQUEST,"user is delet")
    }
    
    // const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

    // if(!isPasswordMatched){
    //     throw new AppError(httpStatus.BAD_REQUEST,"Incorrect Password")
    // }

    const jwtPayload = {
        userId: isUserExist._id,
        email:isUserExist.email,
        role:isUserExist.role
    }
    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

    // const userTokens = createUserTokens(isUserExist)

    const {password:pass ,...rest} = isUserExist.toObject()

    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })
   
    return {
        accessToken

}
}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}