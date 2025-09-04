/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handleDuplicateError =(err:any):TGenericErrorResponse=>{
     const marchedArray = err.message.match(/"([^"]*)"/)
     return{
        statusCode: 400,
        message:`${marchedArray[1]} already exists`
     }
}