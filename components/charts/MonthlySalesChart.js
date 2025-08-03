// Dependencies
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

// Utilities
import { formatCurrency } from "@/utils/utilites";

const MonthlySalesChart = ({data, options}) => {
    
    const [monthlySalesMode, setMonthlySalesMode] = useState("Ventas");

    const monthlySalesLabels      = data.Labels;
    const monthlySalesDataBySales = data.Data.DataBySales;
    const monthlySalesDataByUnits = data.Data.DataByUnits;

    return(
        <div className="chart-container">
            <Doughnut 
                data = {
                    monthlySalesMode == "Ventas"
                    ? monthlySalesDataBySales
                    : monthlySalesDataByUnits
                } 
                options = {options} 
            />
        
            <div style={{ textAlign: "center", marginTop: "-100px", fontSize: "15px" }}>
                <strong>{monthlySalesMode == "Ventas" ? `${formatCurrency(monthlySalesLabels.monthlySales)} / ${formatCurrency(monthlySalesLabels.monthlySalesGoal)}` : `${monthlySalesLabels.monthlyUnitsSold} / ${monthlySalesLabels.monthlyUnitsGoal}`}</strong>
                <p>{monthlySalesMode == "Ventas" ? "Ventas mensuales" : "Unidades Vendidas"}</p>
            </div>

            <ToggleChartViewMode handler={setMonthlySalesMode} viewMode={monthlySalesMode}/>

        </div>
    );
}

export default MonthlySalesChart;