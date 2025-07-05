import { Dropdown } from "antd";
import ProductList from "./ProductList";
import withReactContent from 'sweetalert2-react-content';
import ReactDOMServer from 'react-dom/server';
import Ticket from './Ticket';
import Swal from 'sweetalert2';

const CustomSwal = withReactContent(Swal);

const DropDown = ({cartItems, itemCount, price, discount, sizes, milks, isCollapsed, clearCart, showDiscounts, closeDropdown})=>{
    const items = [
        {
            key:'1',
            label: <div className="action" onClick={clearCart}>
                <img className="delete-icon" alt="delete" src="./assets/delete.png"/>
                <span>Vaciar carrito</span>
            </div>
                
        },
        {
            key:'2',
            label: <div className="action" onClick={showDiscounts}>
                <img className="delete-icon" alt="discount" src="./assets/discount.png"/>
                <span>Aplicar descuento</span>
            </div>
        }
    ]


    const printTicket = () => {
        // Convertir el componente <Ticket /> a HTML
        const ticketHtml = ReactDOMServer.renderToString(<Ticket />);

        const styles = `
        .ticket-container {
          max-width: 300px;
          margin: 20px auto;
          padding: 10px;
          background: #fff;
          border: 1px solid #000;
          font-family: 'Courier New', Courier, monospace;
          color: #000;
        }
        .ticket {
          text-align: center;
          padding: 10px;
        }
        .ticket .business-info {
          margin-bottom: 10px;
        }
        .ticket .business-info .business-logo {
          width: 60px;
          height: auto;
          margin: 0 auto 5px auto;
          display: block;
          filter: grayscale(100%);
        }
        .ticket .business-info .title {
          font-size: 20px;
          margin: 5px 0;
        }
        .ticket .business-info .info {
          font-size: 12px;
          line-height: 1.2;
        }
        .ticket .separator {
          border: none;
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .ticket .order-info .subtitle {
          font-size: 16px;
          margin-bottom: 10px;
        }
        .ticket .order-info .list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
          font-size: 12px;
        }
        .ticket .order-info .list .list-item {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          border-bottom: 1px dotted #000;
        }
        .ticket .order-info .total {
          font-size: 14px;
          text-align: right;
          margin-top: 10px;
        }
        .ticket .order-info .payment {
          font-size: 12px;
          text-align: right;
          margin-top: 3px;
        }
        .print-button {
          width: 100%;
          margin-top: 10px;
          padding: 8px;
          font-size: 14px;
          background-color: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 2px;
        }
      `;
        
        // Abrir una nueva ventana y escribir el contenido del ticket
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>TICKET</title>
                <style>${styles}</style>
            </head>
            <body >
                ${ticketHtml}
            </body>
            </html>
        `);
        printWindow.document.close();

        // Usar onload para asegurarse de que el contenido esté cargado antes de imprimir
        printWindow.onload = function() {
            printWindow.focus();
            printWindow.print();

            printWindow.onafterprint = function() {
              printWindow.close();
            };
            // printWindow.close();
        };

        // Fallback por si onload no se dispara (por ejemplo, después de 1 segundo)
        // setTimeout(() => {
        //     if (!printWindow.closed) {
        //         printWindow.focus();
        //         printWindow.print();
        //         // printWindow.close();
        //     }
        // }, 1000);
      };

    function calculateChange() {
        if(cartItems.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay ningún producto agregado al carrito'
            });
            return;
        }

        Swal.fire({
            title: 'Cobrar',
            html: `<input type='number' inputmode='numeric' pattern='[0-9]*' id='cash-input' class='cash-input' placeholder='Ingrese dinero' />`,
            showCancelButton: true,
            confirmButtonText: 'Cambio',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const enteredCash = document.getElementById("cash-input").value;
                if(enteredCash <= 0 || enteredCash < price){
                    Swal.showValidationMessage("Porfavor ingresa una cantidad válida a cobrar");
                    return;
                }
                const change = enteredCash - price;
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(change);
                    }, 1000);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                    title: `Cambio: ${result.value}`,
                    html: "\
                    <script src='https://cdn.lordicon.com/lordicon.js'></script>\
                    <lord-icon\
                        src='https://cdn.lordicon.com/tjiwvnho.json'\
                        trigger='loop'\
                        delay='500'\
                        state='morph-destroyed'\
                        style='width:200px;height:200px'>\
                    </lord-icon>\
                    ",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Cobrar',
                    
                    preConfirm: () => {
                        Swal.fire({
                            text: 'Registrando venta...',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            didOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        registerSale(price, discount);
                        return false;
                    }
                    });
                }
        });
    }

    async function registerSale(total, discount){
        const saleDetails = cartItems.map(item => ({
            drinkId: item.id,
            sizeId: item.size,
            milkTypeId: item.milk,
            quantity: item.qty,
            drinkType: item.drinkType
          }));
          try {
            const response = await fetch('/api/registerSale', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ total, discount, saleDetails }),
            });
      
            if (!response.ok) {
              const errorDetails = await response.json();
              throw new Error(errorDetails.message);
            }
      
            const data = await response.json();
            CustomSwal.fire({
                title: 'Compra registrada!',
                html: "<lord-icon\
                    src='https://cdn.lordicon.com/mmbmokuv.json'\
                    trigger='loop'\
                    delay='500'\
                    style='width:250px;height:150px'>\
                </lord-icon>",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Imprimir Ticket',
                denyButtonText: 'Mandar por SMS',
                cancelButtonText: 'Salir',
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result)=>{
                if(result.isConfirmed){
                  printTicket();
                }
                clearCart();
                window.location.reload();
              })
          } catch (error) {
            Swal.fire({
                title: 'Error',
                html: `No se pudo registrar la venta:\
                <br/> ${error}`,
                icon: 'error',
                confirmButtonText: 'OK'
              })
           }
    }


    return(
        <div style={isCollapsed ? {display:"none"} : {}} className="dropdown-wrapper shadow-lg">
            <div className="dropdown-header">
                <img className="drop-icon" src="./assets/arrow.png" onClick={()=>closeDropdown(true)} alt="drop-icon"/>
                <span>{itemCount} artículo{itemCount > 1 || itemCount == 0 ? "s":""}</span>
                <Dropdown menu={{items}} placement="bottom" trigger={['click']}>
                    <img className="more-icon" src="./assets/more.png" alt="dots" />
                </Dropdown>
            </div>
            <div className="dropdown-content">
                <ProductList 
                    isProduct={true}
                    products={cartItems} 
                    enabled={false} 
                    sizes={sizes}
                    milks={milks}/>
                <button className="cash-wrapper" onClick={()=>calculateChange()}>
                    <img src="./assets/cash.png" alt="cash" className="cash-icon"/>
                </button>
            </div>
        </div>
    );
}

export default DropDown;