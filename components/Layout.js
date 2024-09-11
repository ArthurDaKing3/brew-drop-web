import SideMenu from "@/components/SideMenu";
import { Button, Tabs } from "antd";
import { useState } from "react";

const Layout = ({ContentProducts, ContentCategories, ContentDiscounts})=>{
    const [isCollapsed, setIsCollapsed] = useState(true);
    function toggleMenu(){
        setIsCollapsed(prev=>!prev);
    }

    const items = [
        {
            key: "0",
            label: <Button className="menu-icon" onClick={toggleMenu}>
                        <img src="./assets/menu.png" alt="menu-icon"/>
                    </Button>,
            disabled: true
        },
        {
            key: "1",
            label: <div className="menu-option">Artículos</div>,
            children: ContentProducts
        },
        {
            key: "2",
            label: <div className="menu-option">Categorías</div>,
            children: ContentCategories
        },
        // {
        //     key: "3",
        //     label: <div className="menu-option">Descuentos</div>,
        //     children: ContentDiscounts
        // }
    ];

    return(
        <div className="layout-wrapper">
            <SideMenu isCollapsed={!isCollapsed} toggleMenu={toggleMenu}/>
            <Tabs
                className="tab-wrapper"
                defaultActiveKey="1"
                items={items}
            />
        </div>
    );
}

export default Layout;