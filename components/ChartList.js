import { useState, useRef } from 'react';
import { useSortable } from '@/hooks/useSortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useChartContext } from '@/hooks/useChartContext';
import { faGripLines } from '@fortawesome/free-solid-svg-icons'


const ChartList = () => {

    const {contextCharts, setContextCharts} = useChartContext();
    const [charts, setCharts] = useState(contextCharts);
    const listRef = useRef(null);

    useSortable(listRef, setCharts, "drag-handle");

    return (
        <div>

            <ul 
                ref={listRef}
                className="list-group" 
                style={{ maxHeight: '50vh', overflowY: 'scroll' }}
            >
                {charts.map((chart) => (

                    <li key={chart.chartId} className="list-group-item">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            
                            <input 
                                id={`chart${chart.chartId}Selected`} 
                                type="checkbox" 
                                onChange={() => setCharts(prevCharts => 
                                    prevCharts.map(c => 
                                        c.chartId == chart.chartId ? { ...c, isChartSelected: !c.isChartSelected } : c
                                    )
                                )}
                                checked={chart.isChartSelected} 
                                className="form-check-input" 
                            />
                            
                            <span>
                                <FontAwesomeIcon icon={chart.chartIcon} className="mr-3"/>
                                {chart.chartDisplayName}
                            </span>

                            <span className="drag-handle" style={{ cursor: 'grab' }}>
                                <FontAwesomeIcon icon={faGripLines} />
                            </span>
                        </div> 
                    </li>

                ))}
            </ul>

            <div id="customSwalButtons" className="mt-3 d-flex justify-content-center gap-3">
                <button className="btn btn-primary" onClick={() => setContextCharts(charts)}>
                    Confirmar
                </button>
                <button className="btn btn-secondary" onClick={() => Swal.close()}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ChartList;