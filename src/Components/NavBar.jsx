import { NavLink } from "react-router-dom"
import Logo from "./Logo"
import styles from "./NavBar.module.css"
function NavBar() {
    return (
        <nav className={styles.nav}>
            <Logo />
            <NavLink to="/">Home</NavLink>
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/contato">Contato</NavLink>
        </nav>
    )
}

export default NavBar
