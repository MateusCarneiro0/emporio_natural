import { useState } from "react";
import styles from "./NavModal.module.css";
import IconButton from "@mui/material/IconButton";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import LogoutIconNavMobile from "./LogoutIconNavMobile";
import { NavLink } from "react-router-dom";
import NavLoginButton from "./NavLoginButton";
import Logo from "./Logo"
function NavModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { cartProducts } = useSelector((store) => store.cart);
  return (
    <div className={`${styles.modal} ${isOpen ? styles.fixed : ""}`}>
      {isOpen ? (
        <button
          className={`${styles.menuButton} ${styles.closeButton}`}
          onClick={() => setIsOpen((isOpened) => !isOpened)}
        >
          &times;
        </button>
      ) : (
        <button
          className={styles.menuButton}
          onClick={() => setIsOpen((isOpened) => !isOpened)}
        >
          &#9776;
        </button>
      )}

      {isOpen && (
        <main className={styles.links}>
          <NavLink to="/" className={styles.textLink}>
            <Logo />
          </NavLink>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          <NavLink to="/produtos" className={styles.textLink}>
            Produtos
          </NavLink>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          <a
            href="mailto:emporionatural36@gmail.com"
            className={styles.textLink}
          >
            Contato
          </a>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          {isAuthenticated && (
            <>
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
                    <span>
                      {!cartProducts?.length
                        ? null
                        : `(${cartProducts?.length})`}
                    </span>
                  </IconButton>
                )}
              </NavLink>
              <div className={styles.loginSeparator}>
                <span>
                  <hr></hr>
                </span>
              </div>
            </>
          )}

          {isAuthenticated ? <LogoutIconNavMobile /> : <NavLoginButton />}
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
        </main>
      )}
    </div>
  );
}

export default NavModal;
