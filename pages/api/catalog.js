
import { PrismaClient } from "@prisma/client";
import { getTenantFromRequest } from "@/utils/utilites";
import { getCategories, getProducts, getDiscounts } from "@/services/catalogService";

const prismaConnection = new PrismaClient({
    log: ['info', 'warn', 'error']
});

export default async function handler(req, res) {

    const tenant = getTenantFromRequest(req);

    if (!tenant) return res.status(400).json({ error: 'Missing tenant context' });

    switch(req.method){
        case 'GET':
            try{
                const { categories, drinks, discounts } = await getAllCatalogsData(prismaConnection, tenant);
                res.status(200).json({ categories, drinks, discounts });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
            finally {
                await prismaConnection.$disconnect();
            }
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getAllCatalogsData(prismaConnection, tenant){

    const categories    = await getCategories(prismaConnection, tenant);
    const products      = await getProducts(prismaConnection, tenant);
    const discounts     = await getDiscounts(prismaConnection, tenant);

    const categoriesResult  = categories.map(category => ({...category, checked: false}));
    const productsResult    = products.map(product => ({...product, categories: product.categories.split(",")}));

    return { 
          categories: categoriesResult,
          drinks: productsResult,
          discounts: discounts
    };
}