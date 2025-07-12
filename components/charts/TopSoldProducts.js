
// Dependencies
import { useState } from "react";
import { Bar } from "react-chartjs-2";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

const TopSoldProducts = ({topProductsData, topProductsOptions}) => {
    
    const [topProductsMode, setTopProductsMode ] = useState("Dinero");
    
    return(
        <div className="chart-container">
            <Bar
                data={topProductsMode == "Dinero" ? topProductsData.DataBySales : topProductsData.DataByUnits }
                options={topProductsOptions}
            />

            <ToggleChartViewMode handler={setTopProductsMode} viewMode={topProductsMode}/>

        </div>
    );
}

export default TopSoldProducts;