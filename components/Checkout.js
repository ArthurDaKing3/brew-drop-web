import CheckoutDropDown from "./DropDown";

const Checkout = ({cartItems, itemCount, price, clearCart, isDropDownCollapsed, closeDropdown})=>{
    return(
        <div style={isDropDownCollapsed ? {height: "12vh"} : {}} className="checkout-wrapper">
            
            <CheckoutDropDown 
                cartItems = {cartItems}
                itemCount = {itemCount}
                isCollapsed = {isDropDownCollapsed} 
                clearCart = {clearCart}
                closeDropdown = {closeDropdown}/>

            <div className="checkout-footer" onClick={()=>closeDropdown(false)}>
                <h1 className="price">${price}</h1>
                <div className="cart" onClick={()=>closeDropdown(false)}>
                        <img className="icon" alt="cart-icon" src="./assets/cart.png"/>
                </div>
            </div>

        </div>
    );
}

export default Checkout;