
/**
 * Calls a stored procedure and maps results using provided column aliases
 * @param {object}  prismaInstance  - An instance of Prisma Client
 * @param {string}  procedureName   - The name of the stored procedure
 * @param {Array}   params          - Array of parameters to pass to the SP
 * @param {Array}   columnAliases   - Array of strings representing desired output keys
 */
async function ExecuteSP(prismaInstance, procedureName, params = [], columnAliases = []) {

    const placeholders = params.map(() => '?').join(', ');

    const rawResult = await prismaInstance.$queryRawUnsafe(
        `CALL ${procedureName}(${placeholders});`,
        ...params
    );

    const rows = Array.isArray(rawResult[0]) ? rawResult[0] : rawResult;

    if (columnAliases.length === 0) return rows;

    return rows.map(row => {

        const mapped = {};
        columnAliases.forEach((alias, index) => {
        mapped[alias] = row[`f${index}`];
        });

        return mapped;

    });

}

export default ExecuteSP;
