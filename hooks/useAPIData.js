import { useEffect, useState } from "react";

/**
 * Custom hook to fetch data from a REST API endpoint
 * @param {string}  endpoint  - The API endpoint to call
 * @param {Object}  options   - Options for the API call
 */
export default function useAPIData(endpoint, options = {}) {

    const [data, setData]       = useState(null);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res  = await fetch(endpoint, options);
                const json = await res.json();
                
                if (!res.ok) {
                    throw new Error(json.message || "Error al obtener los datos");
                }

                setData(json);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);
                
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };

}