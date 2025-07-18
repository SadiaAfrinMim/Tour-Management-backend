import z from "zod";
import { IsActive, Role } from "./user.interface";

 export const createUserZodSchema = z.object({
          name:z
          .string({invalid_type_error:"Name must be string"})
          .min(2,{message:"Name too short .Minimum 2 character long"})
          .max(50,{message:"Name too long"}),

          // name:z.object({
          //   firstName:z.string({invalid_type_error:"Name must be string"})
          // .min(2,{message:"Name too short .Minimum 2 character long"})
          // .max(50,{message:"Name too long"}),
          //  lastName:z.object({
          //   nickName:z.string({invalid_type_error:"Name must be string"})
          // .min(2,{message:"Name too short .Minimum 2 character long"})
          // .max(50,{message:"Name too long"}),
           
          // }),
          // surName:z.string({invalid_type_error:"Name must be string"})
          // .min(2,{message:"Name too short .Minimum 2 character long"})
          // .max(50,{message:"Name too long"}),
           
          

          //  }),
            email:z
            .string({invalid_type_error:"Email must be string"}).email({message:"Invalid email address format."})
            .min(8,{message:"password must be at least 8 characters long"})
            .max(100,{message:"email cannot exist 100 characters."}),
            password: z
            .string({invalid_type_error:"password must be string"})
            .min(8,{message:"password must be 8 character long"})
            .regex(/^(?=.*[A-Z])/,{message:"Password must contain at least 1 uppercase letter"})
            .regex(/^(?=.*[@$!%*?&])/,{message:"password must contain at least 1 special character"})
            .regex(/^(?=.*\d)/,{message:"password must contain at least 1 number"}),
            phone:z
            .string({invalid_type_error:"phone number nust be string"})
            .regex(/^(\+88)?01[3-9]\d{8}$/,{message:"Phone number must be valid for Bangladesh.Formet :017XXXXXXXXX or+8801XXXXXx"})
            .optional(),
         
            address:z.string({invalid_type_error:"Address must be string"}).max(200,{message:"Address cannot exceed 200 characters."})
            .optional()
        

    })


    export const updateUserZodSchema = z.object({
          name:z
          .string({invalid_type_error:"Name must be string"})
          .min(2,{message:"Name too short .Minimum 2 character long"})
          .max(50,{message:"Name too long"})
          .optional(),
         
            password: z
            .string({invalid_type_error:"password must be string"})
            .min(8,{message:"password must be 8 character long"})
            .regex(/^(?=.*[A-Z])/,{message:"Password must contain at least 1 uppercase letter"})
            .regex(/^(?=.*[@$!%*?&])/,{message:"password must contain at least 1 special character"})
            .regex(/^(?=.*\d)/,{message:"password must contain at least 1 number"})
            .optional(),
            phone:z
            .string({invalid_type_error:"phone number nust be string"})
            .regex(/^(\+88)?01[3-9]\d{8}$/,{message:"Phone number must be valid for Bangladesh.Formet :017XXXXXXXXX or+8801XXXXXx"})
            .optional(),

            role:z
            .enum(Object.keys(Role)as[string])
            .optional(),
            isActive: z
            .enum(Object.values(IsActive) as [string])
            .optional(),
            isDeleted:z
            .boolean({invalid_type_error:"isdeleted must be true or false"})
            .optional(),
            isverified:z
            .boolean({invalid_type_error:"isVerified must be true or false"})
            .optional(),
         
            address:z.string({invalid_type_error:"Address must be string"}).max(200,{message:"Address cannot exceed 200 characters."})
            .optional()
        

    })