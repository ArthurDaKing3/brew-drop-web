import { Dropdown } from "antd";
import ProductList from "./ProductList";
import { PrismaClient } from "@prisma/client"

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
            if(enteredCash == 0){
                Swal.showValidationMessage("Porfavor ingresa una cantidad a cobrar");
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
                registerSale(price, discount);
                return false; // Esto evita que se cierre la alerta
            }
            });
            // .then((result)=>{
            //     if(result.isConfirmed){
            //         registerSale(price, discount);
            //         clearCart();
            //     }
            // });
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
            Swal.fire({
                title: 'Compra registrada!',
                html: "<lord-icon\
                    src='https://cdn.lordicon.com/mmbmokuv.json'\
                    trigger='loop'\
                    delay='500'\
                    style='width:250px;height:150px'>\
                </lord-icon>",
                confirmButtonText: 'OK'
              }).then((result)=>{
                if(result.isConfirmed) clearCart();
              })
          } catch (error) {
            Swal.fire({
                title: 'Error',
                html: `No se pudo registrar la venta:\
                <br/> ${error}`,
                icon: 'error',
                confirmButtonText: 'OK'
              }).then((result)=>{
                if(result.isConfirmed) clearCart();
              })
              }
    }
    return(
        <div style={isCollapsed ? {display:"none"} : {}} className="dropdown-wrapper">
            <div className="dropdown-header">
                <img className="drop-icon" src="./assets/arrow.png" onClick={()=>closeDropdown(true)} alt="drop-icon"/>
                <span>{itemCount} artículo{itemCount > 1 || itemCount == 0 ? "s":""}</span>
                <Dropdown menu={{items}} placement="bottom" trigger={['click']}>
                    <img className="more-icon" src="./assets/more.png" alt="dots" />
                </Dropdown>
            </div>
            <div className="dropdown-content">
                <ProductList 
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