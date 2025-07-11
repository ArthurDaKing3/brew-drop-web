
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

export function getDailySalesData({hours, salesTotal, salesUnits}) {
    return (
        {
            DataBySales:{
                labels: hours,
                datasets: [
                    {
                        label: "Ventas ($)",
                        data: salesTotal,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            DataByUnits:{
                labels: hours,
                datasets: [
                    {
                        label: "Unidades Vendidas",
                        data: salesUnits,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            }
        }
    );
}