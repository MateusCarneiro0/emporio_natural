import { NavLink, useNavigate, useParams } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBar.module.css";
import IconButton from "@mui/material/IconButton";
import WestIcon from "@mui/icons-material/West";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import NavLoginButton from "./NavLoginButton";
function NavBar() {
  const {isAuthenticated} = useSelector(store => store.auth)
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartProducts } = useSelector((store) => store.cart);
  return (
    <nav className={styles.nav}>
      {id && (
        <NavLink>
          <IconButton onClick={() => navigate(-1)}>
            <WestIcon />
          </IconButton>
        </NavLink>
      )}
      <NavLink className={styles.textLink} to="/">
        <Logo />
      </NavLink>
      <NavLink to="/produtos" className={styles.textLink}>
        Produtos
      </NavLink>
      <a href="mailto:emporionatural36@gmail.com" className={styles.textLink}>
        Contato
      </a>
      {isAuthenticated ?<NavLink to="/cart" className={styles.textLink}>
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
            <span>
              {!cartProducts?.length ? null : `(${cartProducts?.length})`}
            </span>
          </IconButton>
        )}
      </NavLink>:<NavLoginButton />}
    </nav>
  );
}

export default NavBar;
