// Dependencies
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";

// Components
import ToggleChartViewMode from "../../components/ToggleChartViewMode";

// Utilities
import { formatCurrency } from "@/utils/utilites";

const MonthlySalesChart = ({monthlySalesData, monthlySalesOptions}) => {
    
    const [monthlySalesMode, setMonthlySalesMode] = useState("Dinero");

    const monthlySalesLabels      = monthlySalesData.Labels;
    const monthlySalesDataBySales = monthlySalesData.Data.DataBySales;
    const monthlySalesDataByUnits = monthlySalesData.Data.DataByUnits;

    return(
        <div className="chart-container">
            <Doughnut 
                data = {
                    monthlySalesMode == "Dinero"
                    ? monthlySalesDataBySales
                    : monthlySalesDataByUnits
                } 
                options = {monthlySalesOptions} 
            />
        
            <div style={{ textAlign: "center", marginTop: "-100px", fontSize: "15px" }}>
                <strong>{monthlySalesMode == "Dinero" ? `${formatCurrency(monthlySalesLabels.monthlySales)} / ${formatCurrency(monthlySalesLabels.monthlySalesGoal)}` : `${monthlySalesLabels.monthlyUnitsSold} / ${monthlySalesLabels.monthlyUnitsGoal}`}</strong>
                <p>{monthlySalesMode == "Dinero" ? "Ventas mensuales" : "Unidades Vendidas"}</p>
            </div>

            <ToggleChartViewMode handler={setMonthlySalesMode} viewMode={monthlySalesMode}/>

        </div>
    );
}

export default MonthlySalesChart;