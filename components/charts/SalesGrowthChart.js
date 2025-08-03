// Dependencies
import { Line } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";


const SalesGrowthChart = ({ data, options }) => {
    
    const [salesGrowthMode, setSalesGrowthMode] = useState("Ventas");
    
    return(
        <div className="chart-container">

            <Line  
                data={
                    salesGrowthMode === "Ventas"
                    ? data.DataBySales
                    : data.DataByUnits
                } 
                options={options} 
            />
            <ToggleChartViewMode handler={setSalesGrowthMode} viewMode={salesGrowthMode}/>

        </div>

    );
}

export default SalesGrowthChart;