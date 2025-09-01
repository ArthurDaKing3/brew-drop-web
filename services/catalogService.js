import ExecuteSP from "./prismaService";

export async function getCategories(prisma, tenant){

    return await ExecuteSP(prisma, "sp_GetCategories", [tenant], ['id', 'name', 'image']);

}

export async function getProducts(prisma, tenant){

    return await ExecuteSP(prisma, "sp_GetProducts", [tenant], ['id', 'name', 'price', 'image', 'categories']);

}

export async function getDiscounts(prisma, tenant){

    return await ExecuteSP(prisma, "sp_GetDiscounts", [tenant], ['id', 'description', 'percentage']);

}