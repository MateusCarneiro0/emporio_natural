import { useState } from "react";
import styles from "./NavModal.module.css";
import IconButton from "@mui/material/IconButton";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import NavLoginButton from "./NavLoginButton";
import LogoutIconNav from "./LogoutIconNav";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";

function NavModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { id } = useParams();
  const navigate = useNavigate();

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
          <div className={styles.linkContainer}>
            <NavLink to="/produtos" className={styles.textLink}>
              Produtos
            </NavLink>
          </div>
          <div className={styles.linkContainer}>
            <a
              href="mailto:emporionatural36@gmail.com"
              className={styles.textLink}
            >
              Contato
            </a>
          </div>
          <div className={styles.linkContainer}>
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
                    <span>
                      {!cartProducts?.length
                        ? null
                        : `(${cartProducts?.length})`}
                    </span>
                  </IconButton>
                )}
              </NavLink>
            ) : (
              <NavLoginButton />
            )}
          </div>
          <div className={styles.linkContainer}>
            {id ? (
              <NavLink>
                <IconButton onClick={() => navigate(-1)}>
                  <WestIcon />
                </IconButton>
              </NavLink>
            ) : (
              isAuthenticated && <LogoutIconNav />
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default NavModal;
