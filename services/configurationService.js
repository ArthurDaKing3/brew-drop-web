
import { PrismaClient } from "@prisma/client";
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 });
const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
});

export async function getConfigForTenant(tenant) {

    const cached = cache.get(tenant);
    if (cached) return cached;

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

    console.log("Tenant Data:", tenantData);
    const configMap = {};

    tenantData?.forEach((c) => {
    configMap[c.ConfigKey] = c.ConfigValue;
    });

    console.log("Config Map:", configMap);
    cache.set(tenant, configMap);

    return configMap;

}
