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
      <ul>
        <li>
          <Link href="/sell">Vender</Link>
        </li>
        <li>
          <Link href="/activity">Actividad</Link>
        </li>
        <li>
          <Link href="/catalog">Catálogo</Link>
        </li>
      </ul>
    </Drawer>
  );
};

export default SideMenu;