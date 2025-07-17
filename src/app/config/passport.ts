import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs"

// import passport from "passport"

passport.use(
    new LocalStrategy({ usernameField:"email",passwordField:"password"},async(email:string,password:string,done)=>{
        try {
            const isUserExist = await User.findOne({email})
            if(!isUserExist){
                return done(null,false,{message:"User Does not exist"})
            }
            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects=>providerObjects.provider == "google")
            if(isGoogleAuthenticated){
                return done(null,false,{message:"you have authenticated through google.so if you want to login with credentials , then at first login with google and set a password for your Gmail and then you can login with email and  password "})
            }

             const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

    if(!isPasswordMatched){
          return done(null,false,{message:"password does not match"})
    }

    return done(null,isUserExist)
            
        } catch (error) {
            console.log(error)
            done(error)
            
        }

    })
)


passport.use(
    new GoogleStrategy({
       clientID: envVars.GOOGLE_CLIENT_ID,
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

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: envVars.GOOGLE_CLIENT_ID,
//       clientSecret: envVars.GOOGLE_CLIENT_SECRET,
//       callbackURL: envVars.GOOGLE_CALLBACK_URL,
//       passReqToCallback: false
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // const user = await findOrCreateUser(profile)
//         return done(null, user)
//       } catch (error) {
//         return done(error)
//       }
//     }
//   )
// )

// passport.serializeUser((user, done) => {
//   done(null, user)
// })

// passport.deserializeUser((user, done) => {
//   done(null, user as any)
// })