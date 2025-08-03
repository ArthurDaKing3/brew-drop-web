
// Dependencies
import { useState } from "react";
import { Bar } from "react-chartjs-2";

// Components
import ToggleChartViewMode from "../ToggleChartViewMode";

const TopSoldProductsChart = ({data, options}) => {
    
    const [topProductsMode, setTopProductsMode ] = useState("Ventas");
    
    return(
        <div className="chart-container">
            <Bar
                data={topProductsMode == "Ventas" ? data.DataBySales : data.DataByUnits }
                options={options}
            />

            <ToggleChartViewMode handler={setTopProductsMode} viewMode={topProductsMode}/>

        </div>
    );
}

export default TopSoldProductsChart;