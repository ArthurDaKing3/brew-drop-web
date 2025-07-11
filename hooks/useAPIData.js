import { useEffect, useState } from "react";

export default function useAPIData(endpoint) {

    const [data, setData]       = useState(null);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await fetch(endpoint);
                const json = await res.json();
                setData(json);

            } catch (err) {

                setError(err);
                console.error("Error en useAPIData:", err);

            } finally {

                setLoading(false);
                
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };

}