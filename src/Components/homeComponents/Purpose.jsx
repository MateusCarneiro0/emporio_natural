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
        <span className={styles.heroBadge}>
          Naturais, frescos e cheios de sabor
        </span>
        <h1>Seu bem-estar começa em cada escolha</h1>
        <p>
          O Empório Natural chega para transformar a sua rotina, trazendo o
          melhor da alimentação saudável diretamente para a sua mesa. Nosso
          grande compromisso é levar bem-estar, equilíbrio e mais qualidade de
          vida para você e sua família através de uma seleção cuidadosa de
          produtos frescos, orgânicos e cheios de sabor.
        </p>
        <Link to="/produtos" className={styles.ctaLink}>
          <button type="button">Conheça nossos produtos</button>
        </Link>
      </div>
    </section>
  );
}

export default Purpose;
