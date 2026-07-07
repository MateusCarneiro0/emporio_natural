import { NavLink, useParams } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBar.module.css";
import IconButton from "@mui/material/IconButton";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import NavLoginButton from "./NavLoginButton";
import LogoutIconNav from "./LogoutIconNav";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EmailIcon from "@mui/icons-material/Email";
import LeaveProductIcon from "./LeaveProductIcon";

function NavBarDesktop() {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { id } = useParams();
  const { cartProducts } = useSelector((store) => store.cart);

  return (
    <nav className={styles.nav}>
      {id ? (
        <LeaveProductIcon />
      ) : (
        isAuthenticated && <LogoutIconNav />
      )}
      <NavLink className={styles.textLink} to="/">
        <Logo />
      </NavLink>
      <NavLink to="/produtos" className={styles.textLink}>
        <ShoppingBagIcon /> <span>Produtos</span>
      </NavLink>
      <a href="mailto:emporionatural36@gmail.com" className={styles.textLink}>
        <EmailIcon /> <span>Contato</span>
      </a>
      {isAuthenticated ? (
        <NavLink to="/cart" className={styles.textLink}>
          {({ isActive }) => (
            /* O NavLink expõe 'isActive'. Passamos isso para o IconButton ou para o Ícone */
            <IconButton>
              <ShoppingCartOutlinedIcon
                sx={{
                  // Se estiver ativo, fica azul, se não, fica cinza
                  color: isActive ? "rgb(170, 173, 121)" : "#757575",
                  transition: "color 0.2s ease",
                }}
              />
              <span
                style={{
                  color: isActive ? "rgb(170, 173, 121)" : "#757575",
                }}
              >
                Carrinho
              </span>
              <span>
                {!cartProducts?.length ? null : `(${cartProducts?.length})`}
              </span>
            </IconButton>
          )}
        </NavLink>
      ) : (
        <NavLoginButton />
      )}
    </nav>
  );
}

export default NavBarDesktop;
