// Dependencies
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

// Utilities
import { formatCurrency } from "@/utils/utilites";

const MonthlySalesChart = ({monthlySalesData, monthlySalesOptions, monthlySalesLabels}) => {
    
    const [monthlySalesMode, setMonthlySalesMode] = useState("Dinero");
    
    return(
        <div className="chart-container">
            <Doughnut 
                data = {
                    monthlySalesMode == "Dinero"
                    ? monthlySalesData.DataBySales
                    : monthlySalesData.DataByUnits
                } 
                options = {monthlySalesOptions} 
            />
        
            <div style={{ textAlign: "center", marginTop: "-110px", fontSize: "15px" }}>
                <strong>{monthlySalesMode == "Dinero" ? `${formatCurrency(monthlySalesLabels.monthlySales)} / ${formatCurrency(monthlySalesLabels.monthlySalesGoal)}` : `${monthlySalesLabels.monthlyUnitsSaled} / ${monthlySalesLabels.monthlyUnitsGoal}`}</strong>
                <p>{monthlySalesMode == "Dinero" ? "Ventas mensuales" : "Unidades Vendidas"}</p>
            </div>

            <div style={{ position: "absolute", bottom: "-40px" }}>
                <ToggleChartViewMode handler={setMonthlySalesMode} viewMode={monthlySalesMode}/>
            </div>
        </div>
    );
}

export default MonthlySalesChart;