import { Link } from "react-router-dom";
import styles from "./Proposit.module.css";

function Purpose() {
  return (
    <section className={styles.proposit}>
      <img
        alt="imagem de frutas"
        src="/images/hero.png"
        className={styles.heroImg}
      />
      <div className={styles.textAction}>
        <p>
          O Empório Natural chega para transformar a sua rotina, trazendo o
          melhor da alimentação saudável diretamente para a sua mesa. Nosso
          grande compromisso é levar bem-estar, equilíbrio e mais qualidade de
          vida para você e sua família, através de uma seleção cuidadosa de
          produtos frescos, orgânicos e cheios de sabor. Acreditamos que nutrir
          o corpo de forma consciente é o primeiro passo para uma vida mais
          leve, feliz e vibrante.
        </p>
        <Link to="/produtos">
          <button>Conheça nossos produtos</button>
        </Link>
      </div>
    </section>
  );
}

export default Purpose;
