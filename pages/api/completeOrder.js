import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default async function handler(req, res){
    if(req.method == 'POST'){
        try{
            const { orderId } = req.body

            const completeOrder = await prisma.saleMaster.update({
                where:{
                    id: orderId
                },
                data:{
                    completed: true
                }
            });

            console.log("Order Completed!:", completeOrder);
            res.status(200).json({ success: true, data: completeOrder});
            
        }catch(error){
            res.status(500).json({ message: error.message });
        }
        finally{
            await prisma.$disconnect();
        }
    }else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}