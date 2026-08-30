import styles from "./NavModal.module.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useDispatch, useSelector } from "react-redux";
import LogoutIconNavMobile from "./LogoutIconNavMobile";
import { NavLink } from "react-router";
import NavLoginButton from "./NavLoginButton";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Logo from "./Logo";
import EmailIcon from "@mui/icons-material/Email";
import { revertModal } from "../../slices/globalSlice";

function NavModal() {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { cartProducts } = useSelector((store) => store.cart);
  const {isOpenModal} = useSelector((store) => store.global)
  const dispatch = useDispatch()
  return (
    <div className={`${styles.modal} ${isOpenModal ? styles.fixed : ""}`}>
      {isOpenModal ? (
        <button
          aria-controls="menu-navegacao"
          aria-label="Fechar menu de navegação"
          className={`${styles.menuButton} ${styles.closeButton}`}
          onClick={() => dispatch(revertModal())}
        >
          &times;
        </button>
      ) : (
        <button
          aria-controls="menu-navegacao"
          aria-label="Abrir menu de navegação"
          className={styles.menuButton}
          onClick={() => dispatch(revertModal())}
        >
          &#9776;
        </button>
      )}

      {isOpenModal && (
        <nav
          className={styles.links}
          id="menu-navegacao"
          aria-controls="menu-navegacao"
        >
          <NavLink
            tabIndex={0}
            aria-label="Ir para início"
            to="/"
            className={styles.textLink}
          >
            <Logo />
          </NavLink>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          <NavLink
            tabIndex={0}
            aria-label="ir para produtos"
            to="/produtos"
            className={styles.textLink}
          >
            <ShoppingBagIcon /> <span>Produtos</span>
          </NavLink>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          <a
            tabIndex={0}
            aria-label="Entrar em contato"
            href="mailto:emporionatural36@gmail.com"
            className={styles.textLink}
          >
            <EmailIcon /> <span>Contato</span>
          </a>
          <div className={styles.separator}>
            <span>
              <hr></hr>
            </span>
          </div>
          {isAuthenticated && (
            <>
              <NavLink
                tabIndex={0}
                aria-label="Ir para carrinho"
                to="/cart"
                className={styles.textLink}
              >
                {({ isActive }) => (
                  <>
                    <ShoppingCartOutlinedIcon
                      sx={{
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
                    </span>{" "}
                    <span>
                      {!cartProducts?.length
                        ? null
                        : `(${cartProducts?.length})`}
                    </span>
                  </>
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
        </nav>
      )}
    </div>
  );
}

export default NavModal;
