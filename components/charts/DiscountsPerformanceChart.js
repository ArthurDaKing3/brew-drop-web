// Utilities
import { Bar } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../ToggleChartViewMode";

const DiscountsPerformanceChart = ({ data, options }) => {

    const [discountsPerformanceMode, setDiscountsPerformanceMode] = useState("Ventas");

    return(
        <div className="chart-container">

            <Bar
                data={{
                    labels: data.discountNames,
                    datasets: [
                    {
                        label: discountsPerformanceMode == "Ventas" ? "Ventas ($)" : "Unidades Vendidas",
                        data: discountsPerformanceMode == "Ventas" ? data.totalSales : data.totalUnits,
                        backgroundColor: "rgba(255, 159, 64, 0.5)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 1,
                    },
                    ],
                }}
                options={options}
            />

            <ToggleChartViewMode handler={setDiscountsPerformanceMode} viewMode={discountsPerformanceMode} />
        </div>
    );
};

export default DiscountsPerformanceChart;