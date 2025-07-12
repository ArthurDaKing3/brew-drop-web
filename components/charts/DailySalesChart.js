// Dependencies
import { Bar } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";


const DailySalesChart = ({ dailySalesData, dailySalesOptions }) => {
    
    const [dailySalesMode, setDailySalesMode] = useState("Dinero"); 

    return (
        <div className="chart-container">
            
            <Bar
                data={
                    dailySalesMode == "Dinero"
                    ? dailySalesData.DataBySales
                    : dailySalesData.DataByUnits
                }
                options={dailySalesOptions}
            />

            <ToggleChartViewMode handler={setDailySalesMode} viewMode={dailySalesMode} />
            
        </div>
    );

};

export default DailySalesChart;