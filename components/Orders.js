import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";

const Orders = ({orders, setOrders, sizes, milks}) => {

    const [currentTime, setCurrentTime] = useState(Date.now());
    const orderTimeLimit  = 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

    return () => clearInterval(interval);

    }, []);

    const orderTimeElapsed = (createdAt) => {
        const createdTime = new Date(createdAt).getTime();
        const differenceInMs = currentTime - createdTime;
        const totalSeconds = Math.floor(differenceInMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");

        return {minutes, seconds};
    };

    function confirmComplete(orderId){
        const chk_order = document.getElementById(`chk_order${orderId}`);
        
        Swal.fire({
            title: `Orden# ${orderId}`,
            showCancelButton: true,
            confirmButtonText: 'Completar',
            cancelButtonText: 'Cancelar'
        }).then((result)=>{
            if(!result.isConfirmed) chk_order.checked = false;
            else{
                Swal.fire({
                    title: 'Completando Orden...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                completeOrder(orderId);
            }
        });
    }

    async function completeOrder(orderId) {
        try {
            const response = await fetch('/api/completeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });
    
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.message);
            }
    
            const { data } = await response.json();
    
            Swal.fire({
                icon: 'success',
                title: `Orden #${data.id} completada!`,
            });
    
            const updatedOrders = orders.filter(order => order.id !== orderId);
            setOrders(updatedOrders);

    
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al completar la orden',
                text: error.message,
            });
        }
    }

    return(
        <div className="sell-wrapper">
            <h1 className="order-header">Ordenes</h1>
            <div className="accordion accordion-wrapper" id="accordionOrder">
                {
                    orders.map(o => {
                        const orderTimer = orderTimeElapsed(o.createdAt)
                        return( 
                            <div className="accordion-item" key={o.id}>
                                <h2 className="accordion-header" id={`heading${o.id}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${o.id}`} aria-expanded="true" aria-controls={`collapse${o.id}`}>
                                    <span className={"accordion-text"}>Orden #{o.id}</span>
                                    <input id={`chk_order${o.id}`} className="chk-order" type="checkbox" onClick={()=>confirmComplete(o.id)}/>
                                    <span className={orderTimer.minutes < orderTimeLimit ? "in-time-order" : "late-order"}>
                                        {orderTimer.minutes + ' : ' + orderTimer.seconds}
                                    </span>
                                </button>
                                </h2>
                                <div id={`collapse${o.id}`} class="accordion-collapse collapse" aria-labelledby={`heading${o.id}`}>
                                    <div className="accordion-body">
                                        <div className="order-wrapper">
                                            <ProductList 
                                                isProduct={true}
                                                products={o.saleDetail} 
                                                enabled={false}
                                                contained={true}
                                                sizes={sizes}
                                                milks={milks}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            
        </div>
    );

}

export default Orders