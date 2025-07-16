/* eslint-disable no-console */

import {Server} from 'http'
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server:Server;


const startServer =async()=>{
    try{
        console.log(envVars.NODE_ENV)

        await mongoose.connect(envVars.DB_URL)
        console.log("connect to db")        
        server = app.listen(envVars.PORT,()=>{
            console.log(`server listening to port ${envVars.PORT}`)
        })
    }
    catch(error){
        console.log(error)
    }


}

(async()=>{
   await startServer()
  await seedSuperAdmin()
})()


process.on("unhandledRejection",(error)=>{
    console.log("Unhandled Rejection detected... server shutting down..",error)
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("uncaughtException",(error)=>{
    console.log("Unhandled Rejection detected... server shutting down..",error)
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT",(error)=>{
    console.log("SIGTERM signal detected... server shutting down..",error)
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

// uncaught rejection error

// throw new Error("I forgot to handle this local error")
// unhandle rejection error
// Promise.reject(new Error("I forgot to catch this promise"))
