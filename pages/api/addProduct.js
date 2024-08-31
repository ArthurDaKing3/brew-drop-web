import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default async function handler(req,res){
    if(req.method == 'POST'){
        try{
            const { name, price, selectedCategories } = req.body;

            const drink = await prisma.drink.create({
                data: {
                    name: name, 
                    price: parseInt(price),
                    image: "not-found.png",
                    categories: {
                        connect: selectedCategories.map(c=>{
                            return({
                                ...c,
                                updatedAt: null
                            });
                        })
                    }
                }
            })

            console.log("Product Created!:", drink);
            res.status(200).json({ drink: drink });
        }catch(error){
            res.status(500).json({ message: error.message });
        }finally{
            await prisma.$disconnect();
        }
    }else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}