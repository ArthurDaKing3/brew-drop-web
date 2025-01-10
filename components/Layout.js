import SideMenu from "@/components/SideMenu";
import { Button, Tabs } from "antd";
import { useState } from "react";

const Layout = ({ ContentProducts, ContentCategories, ContentDiscounts, ContentOrders, HandleTabChange = () => {} })=>{
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
    ];

    return(
        <div className="layout-wrapper">
            <SideMenu isCollapsed={!isCollapsed} toggleMenu={toggleMenu}/>
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