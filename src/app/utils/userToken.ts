import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import httpStatus  from 'http-status-codes';
import AppError from "../errorhelpers/AppError";

export const createUserTokens = (user:Partial<IUser>)=>{
       const jwtPayload = {
            userId: user._id,
            email:user.email,
            role:user.role
        }
        const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
        const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

        return {
            accessToken,refreshToken
        }

}

export const createNewAccessTokenWithRefreshToken =async(refreshToken:string)=>{
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
    return accessToken

}