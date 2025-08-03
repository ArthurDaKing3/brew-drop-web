// Dependencies
import { Bar } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";


const DailySalesChart = ({ data, options }) => {
    
    const [dailySalesMode, setDailySalesMode] = useState("Ventas"); 

    return (
        <div className="chart-container">
            
            <Bar
                data={ 
                    dailySalesMode == "Ventas"
                    ? data.DataBySales
                    : data.DataByUnits
                }
                options={options}
            />

            <ToggleChartViewMode handler={setDailySalesMode} viewMode={dailySalesMode} />
            
        </div>
    );

};

export default DailySalesChart;