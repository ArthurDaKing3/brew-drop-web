import Layout from "../components/Layout";
import AddProduct from "../components/AddProduct"
import { PrismaClient } from '@prisma/client'

export async function getStaticProps(){
    const prisma = new PrismaClient();

    const categories = await prisma.category.findMany();
    const sCategories = categories.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : ""
      }));

    return({
        props:{
            categories: sCategories,
        }
    })
}

const Catalog = ({categories})=>{
    return(
        <div>
            <Layout 
                ContentProducts={
                    <AddProduct categories={categories}/>
                }
            />
        </div>
    );
}
export default Catalog;