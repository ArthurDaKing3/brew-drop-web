

export const discountsPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Desempeño de Descuentos'
        }
    }
};

export function formatDiscountsPerformanceData(data){
    return data;
};