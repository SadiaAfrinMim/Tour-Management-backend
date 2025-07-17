import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";


passport.use(
    new GoogleStrategy({
        clientID:envVars.GOOGLE_CLIENT_SECRET,
        clientSecret:envVars.GOOGLE_CLIENT_SECRET,
        callbackURL:envVars.GOOGLE_CALLBACK_URL
        
    },async(accessToken:string, refreshToken:string,profile:Profile,done:VerifyCallback)=>{
        try{
            const email = profile.emails?.[0].value
            if(!email){
                return done(null,false,{message:"no email found"})
            }
            let user = await User.findOne({email})
            if(!user){
                user = await User.create({
                    email,
                    name:profile.displayName,
                    picture:profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths:[
                        {provider:"google",
                        providerId:profile.id}
                    ]
                })

            }
            return done(null,user)

        }catch(error){
            console.log("google strategy error",error)
            return done(error)

        }
    })
)



// frontend loalhost:5173-->localhost:5000/api/v1/auth/google--->password ->google oauth consent->gmail login ->successful->callaback url localhost:5000/api/v1/auth/google/callback->db store ->token 

// brige== google-->user db store ->token 
// custom ->email, password, role:USER, name..->registration -->DB -->1 user create
// google -?>req->google-> successful: jwt token:role ,email->Db-store ->token -api access



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null,user._id)

})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async(id:string,done:any)=>{
    try{
        const user = await User.findById(id);
        done(null,user)
    }
    catch(error){
        done(error)
    }
})