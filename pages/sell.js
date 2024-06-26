import { useEffect, useState } from "react";
import { Button } from "antd";
import Layout from "../components/Layout";
import ProductGrid from "@/components/ProductGrid";
import ProductList from "@/components/ProductList";
import Checkout from "@/components/Checkout";


const fetchProducts = async () => {
    const res = await fetch('/api/products');
    if (!res.ok) {
        throw new Error('Error fetching products');
    }
    const products = await res.json();
    return products;
};

const categories = [
    {
        productId: 1,
        name:"Espresso",
        image:"latte.png"
    },
    {
        productId: 2,
        name:"Caliente",
        image:"latte.png"
    },
];

const discounts = [
    {
        productId: 1,
        name:"Vinanti",
        image:"latte.png"
    }
];

const Sell = ()=>{

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const productsFromServer = await fetchProducts();
            setProducts(productsFromServer);
            console.log(productsFromServer);
        };

        getProducts();
    }, []);


    const [view, setView] = useState(false);
    const toggleView = () => setView(prev=>!prev);

    const [isDropDownCollapsed, setIsDropDownCollapsed] = useState(true);
    const closeDropdown = (toggle) => {
        document.documentElement.style.overflow = toggle ? 'scroll' : 'hidden';
        setIsDropDownCollapsed(toggle)
    };

    const [cartItems, setCartItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    const [price, setPrice] = useState(0.0)

    function addItemToCart(item){
        
        setCartItems(cart => {
            if(!cart.some(p=> p.productId == item.productId)){
                return([...cart, {...item, qty: 1}]);
            }
            else{
                const newCart = cart.map(p=>{
                    if(p.productId == item.productId) {
                        p.qty ++;
                        return(p);
                    }else return(p);
                })
                return(newCart);
            }
        });

        setPrice(prevPrice => prevPrice += item.price);
        setItemCount(prevCount => prevCount += 1);
    }

    function clearCart(){
        setCartItems([]);
        setItemCount(0);
        setPrice(0.0);
        closeDropdown(true);
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
                                    products={products} 
                                    addItemToCart={addItemToCart}
                                    enabled={true}
                                    isProduct={true}/>
                                : <ProductGrid 
                                    products={products} 
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
                clearCart = {clearCart}
                isDropDownCollapsed = {isDropDownCollapsed}
                closeDropdown = {closeDropdown}/>
        </div>

        
    );
}

export default Sell;
