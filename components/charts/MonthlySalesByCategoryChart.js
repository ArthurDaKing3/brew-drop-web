// Dependencies
import { Pie } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

const MonthlySalesByCategoryChart = ({ data, options }) => {
    
    const [salesByCategoryMode, setSalesByCategoryMode] = useState("Ventas");
    
    return(
        <div className="chart-container">
            <Pie
                data={{
                    labels: data.categories,
                    datasets: [
                    {
                        label: salesByCategoryMode == "Ventas" ? "Ventas ($)" : "Unidades Vendidas",
                        data: salesByCategoryMode == "Ventas" ? data.totalSales : data.totalUnits,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(54, 162, 235, 0.5)",
                            "rgba(255, 206, 86, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                    },
                    ],
                }}
                options={options}
            />
            <ToggleChartViewMode handler={setSalesByCategoryMode} viewMode={salesByCategoryMode} />
        </div>
    );

}

export default MonthlySalesByCategoryChart;