import { Drawer } from "antd";
import Link from "next/link";

const SideMenu = ({isCollapsed, toggleMenu, currentPage})=>{
  return(
    <Drawer
      title="Menú"
      placement="left"
      open={isCollapsed}
      onClose={toggleMenu}
    >
      <ul className="options-wrapper">
        <li>
          <div className="option">
            <Link href="/sell" >
                <span className={currentPage == "Sell" ? "menu-active" : "menu-inactive"}>
                  Vender
                </span>
            </Link>
            <img src="../assets/cart.png" className="option-icon" alt="Vender" />
          </div>
        </li>
        <li>
          <div className="option">
            <Link href="/activity" >
                <span className={currentPage == "Activity" ? "menu-active" : "menu-inactive"}>
                  Actividad
                </span>
            </Link>
            <img src="../assets/activity.png" className="option-icon" alt="Actividad" />
          </div>
        </li>
        <li>
          <div className="option">
            <Link href="/catalog" >
                <span className={currentPage == "Catalog" ? "menu-active" : "menu-inactive"}>
                  Catálogo
                </span>
            </Link>
            <img src="../assets/catalog.png" className="option-icon" alt="Catálogo" />
          </div>
        </li>
      </ul>
      <span className="version">V7.0.2</span>
    </Drawer>
  );
};

export default SideMenu;