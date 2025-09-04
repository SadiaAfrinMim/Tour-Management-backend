import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.createDivision(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
});




// const createDivision = catchAsync(async(req:Request,res:Response)=>{
//     console.log({
//         file:req.file,
//         body:req.body
//     })

//     const result = await DivisionService.createDivision(req.body)
//     sendResponse(res,{
//         statusCode:400,
//         success:true,
//         message:"Division created",
//         data:result,
//     })

// });

const getAllDivisions = catchAsync(async(req:Request,res:Response)=>{
    const result = await DivisionService.getAllDivisions()
    sendResponse(res,{
        statusCode:400,
        success:true,
        message:"Division Retrived",
        data:result.data,
        meta:result.meta
    })
});
const getSingleDivision = catchAsync(async(req:Request,res:Response)=>{
    const slug= req.params.slug
    const result = await DivisionService.getSingleDivision(slug)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Divition retrived",
        data:result.data
    })
})

const updateDivision = catchAsync(async(req:Request,res:Response)=>{
    const id = req.params.id;
    const result = await DivisionService.updateDivision(id,req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"division updated",
        data:result
    })
})


const deleteDivision= catchAsync(async(req:Request,res:Response)=>{
    // const result = await DivisionService.deleteDivision(req.params.id);
    console.log({
        file:req.body,
        body:req.body
    })
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"division deleted",
        data:{}
    })
})



export const DivisionController ={
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}