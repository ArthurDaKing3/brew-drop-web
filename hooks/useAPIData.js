import { useEffect, useState } from "react";

export default function useAPIData(endpoint, options = {}) {

    const [data, setData]       = useState(null);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await fetch(endpoint, options);
                const json = await res.json();
                
                if (!res.ok) {
                    throw new Error(json.message || "Error al obtener los datos");
                }

                setData(json);

            } catch (error) {

                setError(error.message);
                console.error("Error en useAPIData:", error);

            } finally {

                setLoading(false);
                
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };

}