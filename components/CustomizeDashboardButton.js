import ChartList from "@/components/ChartList";
import { showSwalWithComponent } from "@/hooks/useSweetAlert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef } from "react";
import { ChartContext } from '@/context/ChartContext';
import { useChartContext } from "@/hooks/useChartContext";
import ChartsCatalog from "@/config/charts/ChartsCatalog";



const CustomizeDashboardButton = () => {

    const { dashboardLayout, currentSection } = useChartContext();
    const selectedCharts = dashboardLayout.find(s => s.SectionLabel == currentSection).SectionCharts;
    const chartsOrder = new Map(selectedCharts.map((name, i) => [name, i]));
    const initialCharts = [...ChartsCatalog]
                            .map(c => ({ 
                                ...c, 
                                isChartSelected: chartsOrder.has(c.chartName), 
                                order: chartsOrder.get(c.chartName) ?? Infinity 
                            }))
                            .sort((a, b) => a.order - b.order);

    const [contextCharts, setContextCharts] = useState(initialCharts);

    useEffect(() => {

        const updateDashboardLayout = async() => {
            
            Swal.showLoading();
            const customSwalButtons = document.getElementById("customSwalButtons");
            if (customSwalButtons) customSwalButtons.style.setProperty('display', 'none', 'important');
            

            // Builds the layout object with the updated chart selections
            const newLayout = dashboardLayout.map(section => {
                if (section.SectionLabel == currentSection) {
                    return {
                        ...section,
                        SectionCharts: contextCharts.filter(c => c.isChartSelected).map(c => c.chartName),
                    };
                }
                return section;
            });

            // HTTP Request to update the layout
            try{

                const response  = await fetch("/api/activity", {method: "PUT", body: JSON.stringify(newLayout)});
                const result    = await response.json();

                if (!response.ok) throw new Error(result.message || "Unknown error");
               
                window.location.reload();

            }
            catch (error) {

                console.error(error.message);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Failed to update dashboard layout, open console for more details`,
                });
            }

        };

        if (JSON.stringify(contextCharts) !== JSON.stringify(initialCharts)) updateDashboardLayout();

    }, [contextCharts]);

    async function OpenCustomizationModal(){

        await showSwalWithComponent(
            <ChartContext.Provider value={{ contextCharts, setContextCharts }}>
                <ChartList />
            </ChartContext.Provider>,
            {
                title: "Personalizar Dashboard",
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            },
        );

    }

    return (
        <div className="d-flex w-100 justify-content-end mb-3 mr-5">
            <button className="btn btn-success" onClick={OpenCustomizationModal}>
                <FontAwesomeIcon icon={faPen} /> Personalizar
            </button>
        </div>
    );
}

export default CustomizeDashboardButton;