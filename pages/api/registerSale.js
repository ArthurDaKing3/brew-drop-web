import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { total, saleDetails, discount } = req.body;
    let saleMaster
    try {
      if(discount == 0){
        saleMaster = await prisma.saleMaster.create({
          data: { total }
        })
      }else{
        saleMaster = await prisma.saleMaster.create({
          data: { total, discountId: parseInt(discount) }
        })
      }

       const saleDetailPromises = saleDetails.map(detail => {
        return prisma.saleDetail.create({
          data: {
            saleMasterId: saleMaster.id,
            drinkId: detail.drinkId,
            drinkType: detail.drinkType,
            sizeId: detail.sizeId,
            milkTypeId: detail.milkTypeId,
            quantity: detail.quantity
          }
        });
      });
      console.log("Creating SaleDetails...");
      const saleDetailsResult = await Promise.all(saleDetailPromises);
      console.log("SaleDetails created:", saleDetailsResult);
      res.status(200).json({saleMaster:saleMaster, saleDetail: saleDetailsResult});
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
