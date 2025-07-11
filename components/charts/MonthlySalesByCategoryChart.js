// Dependencies
import { Pie } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

const MonthlySalesByCategoryChart = ({ salesByCategoryData, salesByCategoryOptions }) => {
    
    const [salesByCategoryMode, setSalesByCategoryMode] = useState("Dinero");
    
    return(
        <div className="chart-container">
            <Pie
                data={{
                    labels: salesByCategoryData.categories,
                    datasets: [
                    {
                        label: salesByCategoryMode == "Dinero" ? "Ventas ($)" : "Unidades Vendidas",
                        data: salesByCategoryMode == "Dinero" ? salesByCategoryData.totalSales : salesByCategoryData.totalUnits,
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
                options={salesByCategoryOptions}
            />
            <ToggleChartViewMode handler={setSalesByCategoryMode} viewMode={salesByCategoryMode} />
        </div>
    );

}

export default MonthlySalesByCategoryChart;