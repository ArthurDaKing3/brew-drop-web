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

export function getMonthlySalesData({monthlySales, monthlySalesGoal, monthlyUnitsSaled, monthlyUnitsGoal}, gaugeMode) {

    const salesPercentage = Math.min((monthlySales / monthlySalesGoal) * 100, 100);
    const unitsPercentage = Math.min((monthlyUnitsSaled / monthlyUnitsGoal) * 100, 100);
    const percentage = gaugeMode == "Dinero" ? salesPercentage : unitsPercentage;

    return {
        labels: ["Progreso", "Restante"],
        datasets: [
            {
                data: [percentage, 100 - percentage],
                backgroundColor: ["#4caf50", "#e0e0e0"],
                borderWidth: 0,
                cutout: "80%",
            },
        ],
    };
    
}