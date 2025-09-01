import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default async function handler(req, res){
    if(req.method == 'POST'){
        try{
            const { type, items } = req.body;

            const data = {};
            switch(type){
                case "product":
                    
                    if (items.name)     data.name   = items.name;
                    if (items.image)    data.image  = items.image;
                    if (items.price)    data.price  = parseFloat(items.price);

                    if (items.categories) {
                        const categoryConnections = await Promise.all(
                            items.categories.map(async (categoryName) => {
                                const existingCategory = await prisma.category.findFirst({
                                    where: { name: categoryName },
                                });

                                return { id: existingCategory.id };
                            })
                        );

                        data.categories = {
                            set: categoryConnections,
                        };
                    }

                    if (Object.keys(data).length === 0) {
                        return res.status(400).json({ error: "No valid fields to update" });
                    }

                    await prisma.drink.update({
                        where: {
                            id: items.id,
                        },
                        data,
                    });
                    return res.status(200).json({ message: "Product updated successfully!" });

                case "category":
                    if (items.name)     data.name   = items.name;
                    if (items.image)    data.image  = items.image;

                    if (Object.keys(data).length === 0) {
                        return res.status(400).json({ error: "No valid fields to update" });
                    }

                    await prisma.category.update({
                        where: {
                            id: items.id,
                        },
                        data,
                    });
                    return res.status(200).json({ message: "Category updated successfully!" });

                case "discount":
                    if (items.description)  data.description = items.description;
                    if (items.percentage)   data.percentage  = parseInt(items.percentage);

                    if (Object.keys(data).length === 0) {
                        return res.status(400).json({ error: "No valid fields to update" });
                    }

                    await prisma.discount.update({
                        where: {
                            id: items.id,
                        },
                        data,
                    });
                    return res.status(200).json({ message: "Discount updated successfully!" });

                default:
                    return res.status(400).json({ error: "Invalid type provided" });
            }
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