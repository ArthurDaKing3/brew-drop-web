import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default async function handler(req, res){
    if(req.method == 'POST'){
        try{
            const { name, price, selectedCategories, imageUrl } = req.body;

            console.log(imageUrl)

            const drink = await prisma.drink.create({
                data: {
                    name: name,
                    price: parseInt(price),
                    image: imageUrl,
                    categories: {
                        connect: selectedCategories.map(c=>{
                            return({
                                "id": c.id,
                                "name": c.name,
                                "image": c.image
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