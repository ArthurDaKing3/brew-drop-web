import SideMenu from "@/components/SideMenu";
import { Button, Tabs } from "antd";
import { useState } from "react";

const Layout = 
({ 
      CurrentPage = ""
    , ContentProducts
    , ContentCategories
    , ContentDiscounts
    , ContentOrders
    , SalesActivity
    , ProductsActivity
    , DiscountsActivity
    , HandleTabChange = () => {} 
}) => {

    const [isCollapsed, setIsCollapsed] = useState(true);

    function toggleMenu(){
        setIsCollapsed(prev => !prev);
    }

    const tabItems = [
        {
            key: "0",
            label: <Button className="menu-icon" onClick={toggleMenu}>
                        <img src="./assets/menu.png" alt="menu-icon"/>
                    </Button>,
            disabled: true
        },
        ContentProducts != null &&
        {
            key: "1",
            label: <div className="menu-option">Productos</div>,
            children: ContentProducts
        },
        ContentCategories != null &&
        {
            key: "2",
            label: <div className="menu-option">Categorías</div>,
            children: ContentCategories
        },
        ContentDiscounts != null &&
        {
            key: "3",
            label: <div className="menu-option">Descuentos</div>,
            children: ContentDiscounts
        },
        ContentOrders != null &&
        {
            key: "4",
            label: <div className="menu-option">Ordenes</div>,
            children: ContentOrders
        },
        SalesActivity != null &&
        {
            key: "1",
            label: <div className="menu-option">Ventas</div>,
            children: SalesActivity
        },
        ProductsActivity != null &&
        {
            key: "2",
            label: <div className="menu-option">Productos</div>,
            children: ProductsActivity
        },
        DiscountsActivity != null &&
        {
            key: "3",
            label: <div className="menu-option">Descuentos</div>,
            children: DiscountsActivity
        },

    ];

    return(
        <div className="layout-wrapper">
            <SideMenu 
                isCollapsed={!isCollapsed} 
                toggleMenu={toggleMenu} 
                currentPage={CurrentPage}
            />
            <Tabs
                className="tab-wrapper"
                defaultActiveKey="1"
                items={tabItems}
                onChange={HandleTabChange}
            />
        </div>
    );
}

export default Layout;