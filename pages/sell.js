import { useEffect, useState } from "react";
import { Button } from "antd";
import Layout from "../components/Layout";
import ProductGrid from "@/components/ProductGrid";
import ProductList from "@/components/ProductList";
import Checkout from "@/components/Checkout";
import { PrismaClient } from '@prisma/client'

export async function getStaticProps(){
    const prisma = new PrismaClient();

    const drinks = await prisma.drink.findMany({
        include:{
            categories : {select: {name: true}}
        }
    }); 
    const categories = await prisma.category.findMany();
    const discounts = await prisma.discount.findMany();
    const sizes = await prisma.size.findMany();
    const milkTypes = await prisma.milkType.findMany();

    const sDrinks = drinks.map(d => ({
        ...d,
        categories: d.categories.map(c => c.name),
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
      }));

      const sCategories = categories.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : ""
      }));

      const sDiscounts = discounts.map(d => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
      }));

      const sSizes = sizes.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt ? s.updatedAt.toISOString() : ""
      }));

      const sMilkTypes = milkTypes.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt ? m.updatedAt.toISOString() : ""
      }));

    return({
        props:{
            drinks: sDrinks,
            categories: sCategories,
            discounts: sDiscounts,
            sizes: sSizes,
            milks: sMilkTypes
        }
    })
}


const Sell = ({drinks, categories, discounts, sizes, milks})=>{

    const [view, setView] = useState(false);
    const toggleView = () => setView(prev=>!prev);

    const [isDropDownCollapsed, setIsDropDownCollapsed] = useState(true);
    const closeDropdown = (toggle) => {
        document.documentElement.style.overflow = toggle ? 'scroll' : 'hidden';
        setIsDropDownCollapsed(toggle)
    };

    const [cartItems, setCartItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [price, setPrice] = useState(0.0);
    const [discount, setDiscount] = useState(0);

    let tempValue = "";
    
    useEffect(() => {
        // Define la función en el objeto window solo en el cliente
        if (typeof window !== 'undefined') {
            window.setDrinkType = function(t){
                tempValue = t;
                let icon = document.getElementById(t);
                icon.style.filter = "grayscale(0)"

                let otherIcon = document.getElementById(t == "Caliente" ? "Frio" : "Caliente");
                if (otherIcon != null) otherIcon.style.filter = "grayscale(100)"
            }
        }
    }, );
    
    function addItemToCart(item){
        let categories = []
        tempValue == ""

        categories = item.categories && item.categories.map((c)=>{
            let category = ""
            switch(c){
              case "Caliente":
                category = `<img id='Caliente' class='category-icon' onclick="setDrinkType('Caliente')" src='./assets/bonfire.png' alt='Caliente'/>`
                break;
              case "Frio":
                category = `<img id='Frio' class='category-icon' onclick="setDrinkType('Frio')" src='./assets/snowflake.png' alt='Frio'/>`
                break;
              default:
                break;
            }
            return category
          })
        Swal.fire({
            title: 'Detalles de la Bebida',
            html:
            `
            <div class="details-info">
                <span class="details-subtitle">${item.name}</span>
                <div class="details-banner">
                    <div class="details-categories">
                        ${categories.join('')}
                    </div>
                    <img class="details-img" src="./assets/product-images/${item.image}" alt="drink"/>
                </div>
            </div>
            <div class="details-options">
                <div class="details-option">
                    <label for="milk">Leche:</label>
                    <select id="milk" style="margin-top:10px" class="swal2-input">
                        <option value="0">Elige...</option>
                        ${milks.map(m => (
                            `<option value=${m.id}>${m.name}</option>`
                        ))}
                    </select>
                </div>

                <div class="details-option">
                    <label for="size">Tamaño:</label>
                    <select id="size" style="margin-top:10px" class="swal2-input">
                        <option value="0">Elige...</option>
                        ${sizes.map(s=>(
                            `<option value=${s.id}>${s.name}</option>`
                        ))}
                    </select>
                </div>

                <div class="details-option">
                    <label for="qty">Cant:</label>
                    <input id="qty" type="number" inputmode='numeric' pattern='[0-9]*' style="margin-top:10px" class="swal2-input" min="1" max="10" placeholder="Enter a quantity">
                </div>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Añadir al carrito',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const milk = document.getElementById('milk').value;
                const size = document.getElementById('size').value;
                const qty = document.getElementById('qty').value;

                let error = ""
                if(qty == 0) error = "Selecciona una cantidad";
                if(size == 0) error = "Selecciona un tamaño";
                if(milk == 0) error = "Selecciona un tipo de leche";
                if(tempValue == "") error = "Selecciona si la bebida es fria o caliente";

                if (qty == 0 || size == 0 || milk == 0 || tempValue == "") {
                    Swal.showValidationMessage(error);
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setCartItems((cart) => {
                    return([
                        ...cart,
                        { 
                            ...item, 
                            drinkType: tempValue,
                            qty: parseInt(qty.value), 
                            milk: parseInt(milk.value), 
                            size: parseInt(size.value) 
                        }
                    ]);
                });
                setPrice((prevPrice) => prevPrice + (item.price + sizes.find(s => s.id == size.value).priceMultiplier) * parseInt(qty.value));
                setItemCount((prevCount) => prevCount + parseInt(qty.value));
            }
        });
    }

    function clearCart(){
        setCartItems([]);
        setItemCount(0);
        setDiscount(0);
        setPrice(0.0);
        closeDropdown(true);
    }

    useEffect(() => {
        // Define la función en el objeto window solo en el cliente
        if (typeof window !== 'undefined') {
            window.applyDiscount = function (percentage, discountId, discountName) {
                setPrice((prevPrice) => prevPrice - Math.round(prevPrice * (percentage / 100)));
                setDiscount(discountId);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito!',
                    text: `Descuento ${discountName} aplicado!`,
                });
            };
        }
    }, []);

    function showDiscounts(){
        Swal.fire(
        {
            title: 'Seleccionar Descuento',
            html: `
                <div class="discount-list">
                    ${discounts.map((discount) => `
                        <button key="${discount.id}" class="discount-button" onclick="applyDiscount(${discount.percentage}, '${discount.id}', '${discount.description}')">
                            ${discount.description} (${discount.percentage}%)
                        </button>
                    `).join('')}
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
        });
  
    }

    return(
        <div>
            <Layout 
                ContentProducts={
                    <div className="sell-wrapper">
                        <div className="sell-header">
                            <Button onClick={toggleView} className="view-button">
                                <img src={`./assets/${view ? "grid" : "list"}.png`} className="view-img"/>
                            </Button>
                        </div>
                        <div className="sell-body">
                            {view ? <ProductList 
                                    products={drinks} 
                                    addItemToCart={addItemToCart}
                                    enabled={true}
                                    isProduct={true}/>
                                : <ProductGrid 
                                    products={drinks} 
                                    addItemToCart={addItemToCart}
                                    isProduct={true}/>}
                        </div>
                    </div>
                }
                ContentCategories = {
                    <div className="sell-wrapper">
                        <div className="sell-header">
                            <Button onClick={toggleView} className="view-button">
                                <img src={`./assets/${view ? "grid" : "list"}.png`} className="view-img"/>
                            </Button>
                        </div>
                        <div className="sell-body">
                            {view ? <ProductList 
                                    products={categories} 
                                    enabled={true}
                                    isProduct={false}/>
                                : <ProductGrid 
                                    products={categories} 
                                    isProduct={false}/>}
                        </div>
                    </div>
                }
                ContentDiscounts = {
                    <div className="sell-wrapper">
                        <div className="sell-header">
                            <Button onClick={toggleView} className="view-button">
                                <img src={`./assets/${view ? "grid" : "list"}.png`} className="view-img"/>
                            </Button>
                        </div>
                        <div className="sell-body">
                            {view ? <ProductList 
                                    products={discounts} 
                                    enabled={true}
                                    isProduct={false}/>
                                : <ProductGrid 
                                    products={discounts} 
                                    isProduct={false}/>}
                        </div>
                    </div>
                }
            />
            <Checkout 
                cartItems={cartItems} 
                itemCount={itemCount}
                price = {price} 
                discount = {discount}
                clearCart = {clearCart}
                showDiscounts = {showDiscounts}
                isDropDownCollapsed = {isDropDownCollapsed}
                closeDropdown = {closeDropdown}
                sizes={sizes}
                milks={milks}/>
        </div>

        
    );
}

export default Sell;
