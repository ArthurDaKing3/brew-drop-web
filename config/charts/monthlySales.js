export const monthlySalesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        rotation: 225,
        circumference: 270,
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Ventas Mensaules',
            }
        },
    };

export function getMonthlySalesData({monthlySales, monthlySalesGoal, monthlyUnitsSaled, monthlyUnitsGoal}) {

    const salesPercentage = Math.min((monthlySales / monthlySalesGoal) * 100, 100);
    const unitsPercentage = Math.min((monthlyUnitsSaled / monthlyUnitsGoal) * 100, 100);

    return (
        {
            DataBySales:{
                labels: ["Progreso", "Restante"],
                datasets: [
                    {
                        data: [salesPercentage, 100 - salesPercentage],
                        backgroundColor: ["#4caf50", "#e0e0e0"],
                        borderWidth: 0,
                        cutout: "80%",
                    }
                ]
            },
            DataByUnits:{
                labels: ["Progreso", "Restante"],
                datasets: [
                    {
                        data: [unitsPercentage, 100 - unitsPercentage],
                        backgroundColor: ["#4caf50", "#e0e0e0"],
                        borderWidth: 0,
                        cutout: "80%",
                    }
                ]
            },
        }
    );
    
}