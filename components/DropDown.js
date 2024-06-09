import { Button, Dropdown } from "antd";
import ProductList from "./ProductList";

const DropDown = ({cartItems, itemCount, isCollapsed, clearCart, closeDropdown})=>{
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
            label: <div className="action">
                <img className="delete-icon" alt="delete" src="./assets/discount.png"/>
                <span>Aplicar descuento</span>
            </div>
        }
    ]

    function calculateChange() {
        let subtotal = 0;
        cartItems.forEach((item)=>{
            subtotal += item.qty * item.price
        })

        Swal.fire({
        title: 'Cobrar',
        html: `<input type='number' id='cash-input' class='cash-input' placeholder='Ingrese dinero' />`,
        showCancelButton: true,
        confirmButtonText: 'Cambio',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const enteredCash = document.getElementById("cash-input").value;
            const change = enteredCash - subtotal;
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
            icon: 'success',
            confirmButtonText: 'Cobrar'
            });
        }
        });
    }

    console.log(cartItems);
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
                <ProductList products={cartItems} enabled={false}/>
                <button className="cash-wrapper" onClick={()=>calculateChange()}>
                    <img src="./assets/cash.png" alt="cash" className="cash-icon"/>
                </button>
            </div>
        </div>
    );
}

export default DropDown;