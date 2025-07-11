/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorhelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"
import { envVars } from './../../../config/env';
import { JwtPayload } from "jsonwebtoken";

const createUser =async(payload:Partial<IUser>)=>{
    const {email,password,...rest} = payload;
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist")

    }

    
    const hashPassword= await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
   

    
    
    const authProvider : IAuthProvider = {provider:"credentials",providerId:email!}

    const user = await User.create({
          
            email,
            password:hashPassword,
           auths: [authProvider],
            ...rest
        })
        return user
}
const getAllUser = async ()=>{
    const users = await User.find({})
    const totalUser = await User.countDocuments()

    return {
        data:users,
        meta:{
            total:totalUser
        }
    }
}



const updateUser = async (userId:string,payload:Partial<IUser> ,decodedToken: JwtPayload)=>{
        const ifUserExist = await User.findById(userId);

        if(!ifUserExist){
            throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
        }

        if(ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED){
             throw new AppError(httpStatus.FORBIDDEN,"This User can not be updated")

        }
        // email can not update
        // name ,update,password,address
        // password- re hashing
        // only admin superadmin - role, isdeleted
        // promotin g to super admin - superadmin
        if(payload.role){
            if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
                throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
            }
            if(payload.role=== Role.SUPER_ADMIN && decodedToken.ROLE === Role.ADMIN){
                  throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")

            }

        }
        if(payload.isActive || payload.isDeleted||payload.isVerified){
              if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
                throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
            }

        }
        if(payload.password){
            payload.password = await bcryptjs.hash(payload.password,envVars.BCRYPT_SALT_ROUND)
        }
        const newUpdateUser = await User.findByIdAndUpdate(userId,payload,{new: true,runValidators:true})
        return newUpdateUser

    }

export const UserServices ={
    createUser,
    getAllUser,
     updateUser
  
}