import { Drawer } from "antd";
import Link from "next/link";

const SideMenu = ({isCollapsed, toggleMenu})=>{
  
  return(
    <Drawer
      title="Menu"
      placement="left"
      open={isCollapsed}
      onClose={toggleMenu}
    >
      <ul className="options-wrapper">
        <li>
          <div className="option">
            <Link href="/sell">Vender</Link>
            <img src="../assets/cart.png" className="option-icon" alt="Vender" />
          </div>
        </li>
        <li>
          <div className="option">
            <Link href="/activity">Actividad</Link>
            <img src="../assets/activity.png" className="option-icon" alt="Actividad" />
          </div>
        </li>
        <li>
          <div className="option">
            <Link href="/catalog">Catálogo</Link>
            <img src="../assets/catalog.png" className="option-icon" alt="Catálogo" />
          </div>
        </li>
      </ul>
      <span className="version">V6.0.1</span>
    </Drawer>
  );
};

export default SideMenu;