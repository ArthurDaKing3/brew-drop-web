
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
});

export async function getConfigForTenant(tenant) {

    try{

        const tenantData = await prisma.$queryRawUnsafe(`
            SELECT 
                B.BusinessId,
                B.BusinessName,
                B.Subdomain,
                BC.ConfigKey,
                BC.ConfigValue
            FROM 
                tb_BusinessesCatalog AS B
            INNER JOIN
                tb_BusinessesConfig AS BC
                    ON B.BusinessId = BC.BusinessId
            WHERE 
                B.Subdomain = "${tenant}"
        `);

        const configMap = {};

        tenantData?.forEach((c) => {
            configMap[c.ConfigKey] = JSON.parse(c.ConfigValue);
        });

        return configMap;
    }
    catch (error) {
        throw new Error(error.message);
    } 
    finally {
        await prisma.$disconnect();
    }


}
