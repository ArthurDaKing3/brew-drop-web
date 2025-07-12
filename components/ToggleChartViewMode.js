
const ToggleChartViewMode = ({handler, viewMode}) => {
    return(
        <div style={{ position: "absolute", bottom: "-50px", left: "0px" }}>
            <button
                onClick={() => handler(viewMode == "Dinero" ? "Unidades" : "Dinero")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                Métrico: {viewMode == "Dinero" ? "Unidades" : "Dinero"}
            </button>
        </div>
    );
}

export default ToggleChartViewMode;