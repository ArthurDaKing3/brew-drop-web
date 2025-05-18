import { useEffect, useState } from "react";
import { Button } from "antd";
import Layout from "../components/Layout";
import ProductGrid from "@/components/ProductGrid";
import ProductList from "@/components/ProductList";
import Checkout from "@/components/Checkout";
import Orders from "@/components/Orders"
import { PrismaClient } from '@prisma/client'

export async function getServerSideProps(){
    const prisma        = new PrismaClient({
    });
    
    const categories    = await prisma.category.findMany();
    const discounts     = await prisma.discount.findMany();
    const sizes         = await prisma.size.findMany();
    const milkTypes     = await prisma.milkType.findMany();
    const drinks        = await prisma.drink.findMany({
        include:{
            categories : {select: {name: true}}
        }
    }); 
    const salesMaster   = await prisma.saleMaster.findMany({
        where:{
            completed: false
        },
        include:{
            saleDetail: {
                select: {
                    drinkId: true,
                    drink: {
                        select: {
                            name: true,
                            image: true,
                            price: true,
                            categories: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    drinkType: true,
                    size: {
                        select: {
                            id: true,
                            name: true,
                            priceMultiplier: true,
                        }
                    },
                    milkType: {
                        select:{
                            id: true,
                            name: true,
                            price: true,
                        }
                    },
                    quantity: true
                }
            }
        }
    });

    const sSalesMaster  = salesMaster.map(sm => ({
        ...sm,
        saleDetail: sm.saleDetail.map(sd => ({
            ...sd,
            size: sd.size.id,
            milk: sd.milkType.id,
            name: sd.drink.name,
            image: sd.drink.image,
            price: sd.drink.price,
            categories: sd.drink.categories.map(c => (c.name)),
        })),
        createdAt: sm.createdAt.toISOString(),
        updatedAt: sm.updatedAt ? sm.updatedAt.toISOString() : ""
    }));

    const sDrinks       = drinks.map(d => ({
        ...d,
        categories: d.categories.map(c => c.name),
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
    }));

    const sCategories   = categories.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : ""
    }));

    const sDiscounts    = discounts.map(d => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
    }));

    const sSizes        = sizes.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt ? s.updatedAt.toISOString() : ""
    }));

    const sMilkTypes    = milkTypes.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt ? m.updatedAt.toISOString() : ""
    }));

    return({
        props:{
            drinks:     sDrinks,
            categories: sCategories,
            discounts:  sDiscounts,
            sizes:      sSizes,
            milks:      sMilkTypes,
            sales:     sSalesMaster,
        }
    })
}

const Sell = ({drinks, categories, discounts, sizes, milks, sales})=>{

    const [isGridView, setIsGridView]                   = useState(false);
    const [isDropDownCollapsed, setIsDropDownCollapsed] = useState(true);
    const [cartItems, setCartItems]                     = useState([]);
    const [itemCount, setItemCount]                     = useState(0);
    const [price, setPrice]                             = useState(0.0);
    const [discount, setDiscount]                       = useState(0);
    const [filteredProducts, setFilteredProducts]       = useState([]);
    const [filteredBy, setFilteredBy]                   = useState("");
    const [orders, setOrders]                           = useState(Array.isArray(sales) ? [...sales] : [])
    
    let tempValue = "";

    useEffect(() => {
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

    useEffect(() => {
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
                    <img class="details-img" src="${item.image != null ? item.image : './assets/product-images/not-found.png'}" alt="drink"/>
                </div>
            </div>
            <div class="details-options">
                <div class="details-option">
                    <label for="milk">Leche:</label>
                    <select id="milk" style="margin-top:10px" class="swal2-input">
                        <option value="0">Elige...</option>
                        ${milks.map(m => (
                            `<option value=${m.id} ${m.name == "N/A" ? "selected" : ""}>${m.name}</option>`
                        ))}
                    </select>
                </div>

                <div class="details-option">
                    <label for="size">Tamaño:</label>
                    <select id="size" style="margin-top:10px" class="swal2-input">
                        <option value="0">Elige...</option>
                        ${sizes.map(s=>(
                            `<option value=${s.id} ${s.name == "N/A" ? "selected" : ""}>${s.name}</option>`
                        ))}
                    </select>
                </div>

                <div class="details-option">
                    <label for="qty">Cant:</label>
                    <input id="qty" type="number" inputmode='numeric' pattern='[0-9]*' style="margin-top:10px" class="swal2-input" min="1" max="10" value=1>
                </div>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Añadir al carrito',
            cancelButtonText: 'Cancelar',
            didOpen: () =>{
                const drinkTypes = item.categories.filter(c => c == "Frio" || c == "Caliente")

                if(drinkTypes.length == 1 && drinkTypes[0] == "Caliente")   setDrinkType('Caliente')
                if(drinkTypes.length == 1 && drinkTypes[0] == "Frio")       setDrinkType('Frio');
            },
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
                const sizeMultiplier = sizes.find(s => s.id == size.value).priceMultiplier;
                const milkMultiplier = milks.find(m => m.id == milk.value).price;

                setPrice((prevPrice) => prevPrice + ((item.price + sizeMultiplier + milkMultiplier) * parseInt(qty.value)));
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

    function filterProducts(filter){
        const products = drinks.filter(p => {
            if(p.categories.includes(filter)) return(p);
        })
        setFilteredBy(filter);
        setFilteredProducts(products);
    }

    function resetFilters(){
        setFilteredBy("");
        setFilteredProducts([]);
    }

    function closeDropdown(toggle) {
        document.documentElement.style.overflow = toggle ? 'scroll' : 'hidden';
        setIsDropDownCollapsed(toggle)
    }

    function toggleView() { 
        setIsGridView(prev => !prev)
    }

    return(
        <div>
            <Layout 
                CurrentPage={"Sell"}
                ContentProducts={
                    <div className="sell-wrapper">
                        <div className="sell-header">
                            <Button onClick={toggleView} className="view-button">
                                <img src={`./assets/${isGridView ? "grid" : "list"}.png`} className="view-img"/>
                            </Button>
                        </div>
                        <div className="sell-body">
                            {isGridView ? <ProductList 
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
                        <div className="sell-header header-categories">
                            <Button onClick={resetFilters} className="view-button">
                                <img src={`./assets/back.png`} className="view-img"/>
                            </Button>
                            <h1 className="filter-title">{filteredBy}</h1>
                            <Button onClick={toggleView} className="view-button">
                                <img src={`./assets/${isGridView ? "grid" : "list"}.png`} className="view-img"/>
                            </Button>
                        </div>
                        <div id="categories-wrapper" className="sell-body">
                            {
                            isGridView 
                                ? <ProductList 
                                    products={
                                        filteredProducts.length == 0 
                                            ? drinks 
                                            : filteredProducts}
                                    categories={categories}
                                    addItemToCart={addItemToCart}
                                    enabled={true}
                                    isProduct={
                                        filteredProducts.length == 0 
                                            ? false 
                                            : true}
                                    filterProducts={filterProducts}/>
                                : <ProductGrid 
                                    products={
                                        filteredProducts.length == 0 
                                            ? drinks 
                                            : filteredProducts}
                                    categories={categories}
                                    addItemToCart={addItemToCart}
                                    isProduct={
                                        filteredProducts.length == 0 
                                            ? false 
                                            : true}
                                    filterProducts={filterProducts}/>
                            }
                        </div>
                    </div>
                }
                ContentOrders = {
                   <Orders 
                    orders      = {orders}
                    setOrders   = {setOrders}
                    sizes       = {sizes}
                    milks       = {milks}
                   />
                }
            />
            <Checkout 
                cartItems           = {cartItems} 
                itemCount           = {itemCount}
                price               = {price} 
                discount            = {discount}
                clearCart           = {clearCart}
                showDiscounts       = {showDiscounts}
                isDropDownCollapsed = {isDropDownCollapsed}
                closeDropdown       = {closeDropdown}
                sizes               = {sizes}
                milks               = {milks}
            />
        </div>
    );
}

export default Sell;
