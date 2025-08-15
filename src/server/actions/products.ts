"use server"

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { productDetailSchema } from "@/schemas/products";
import { createProduct as createProductDB} from "@/server/db/products"
import { redirect } from "next/navigation";

export async function createProduct(
    unsafeData: z.infer<typeof productDetailSchema>
){
    const {userId}=auth()
    const {success,data}=productDetailSchema.safeParse(unsafeData);

    if(!success || userId==null){
        return {
            error:true,message:"There was an error creating your product"
        }
    }

    const {id}=await createProductDB({...data,clerkUserId:userId})

    redirect(`/dashboard/products/${id}/edit?tab=countries`)
};