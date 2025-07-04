
export const dailySalesOptions = 
{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Ventas Diarias',
        }
    }
};

export function getDailySalesData(data, dailySalesMode){
    return {
            labels: data.hours,
            datasets: [
                {
                    label: dailySalesMode === "Dinero" ? "Ventas ($)" : "Unidades Vendidas",
                    data: dailySalesMode === "Dinero" ? data.salesTotal : data.salesUnits,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
}