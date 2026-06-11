import { NavLink } from "react-router-dom"
import styles from './NavLoginButton.module.css'
function NavLoginButton() {
    return (
        <NavLink to="/login">
            <button className={styles.button}>
                Login
            </button>
        </NavLink>
    )
}

export default NavLoginButton
