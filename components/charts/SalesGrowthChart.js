// Dependencies
import { Line } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";


const SalesGrowthChart = ({ salesGrowthData, salesGrowthOptions }) => {
    
    const [salesGrowthMode, setSalesGrowthMode] = useState("Dinero");
    
    
    return(
        <div className="chart-container">

            <Line  
                data={
                    salesGrowthMode === "Dinero"
                    ? salesGrowthData.DataBySales
                    : salesGrowthData.DataByUnits
                } 
                options={salesGrowthOptions} 
            />
            <ToggleChartViewMode handler={setSalesGrowthMode} viewMode={salesGrowthMode}/>

        </div>

    );
}

export default SalesGrowthChart;