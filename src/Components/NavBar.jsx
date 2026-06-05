import { NavLink } from "react-router-dom"
import Logo from "./Logo"

function NavBar() {
    return (
        <nav>
            <Logo />
            <NavLink to="/">Home</NavLink>
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/contato">Contato</NavLink>
        </nav>
    )
}

export default NavBar
