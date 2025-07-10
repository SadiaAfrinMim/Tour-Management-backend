import z from "zod";

 export const createUserZodSchema = z.object({
          name:z
          .string({invalid_type_error:"Name must be string"})
          .min(2,{message:"Name too short .Minimum 2 character long"})
          .max(50,{message:"Name too long"}),
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