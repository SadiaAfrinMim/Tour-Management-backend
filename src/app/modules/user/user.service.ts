/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorhelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"

const createUser =async(payload:Partial<IUser>)=>{
    const {email,password,...rest} = payload;
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist")

    }
    const hashPassword= await bcryptjs.hash(password as string,10)
   

    
    
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

export const UserServices ={
    createUser,
    getAllUser
}