import { useEffect } from "react";
import Card from "./Card";
import styles from "./Motives.module.css";
import AOS from "aos";
import "aos/dist/aos.css";
function Motives() {
  const motives = [
    {
      texto:
        "Melhora do sono com chás e suplementos naturais que promovem um descanso profundo e revigorante.",
      icone: "/icons/icon_1.png",
    },
    {
      texto:
        "Fortalecimento do comércio local, impulsionando a economia do nosso bairro e gerando empregos na região.",
      icone: "/icons/icon_4.png",
    },
    {
      texto:
        "Mais saúde e longevidade através de alimentos livres de aditivos químicos e ricos em nutrientes essenciais.",
      icone: "/icons/icon_3.png",
    },
    {
      texto:
        "Fortalecimento da agricultura local, apoiando pequenos produtores que cultivam de forma sustentável.",
      icone: "/icons/icon_2.png",
    },
  ];
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div className={styles.motives}>
      <h1>Por quê comprar?</h1>
      {motives.map((item, i) => {
        return (
          <Card
            isLast={i === motives.length - 1}
            src={item.icone}
            key={item.texto}
            id="icon"
            right={i % 2 === 0}
          >
            {item.texto}
          </Card>
        );
      })}
    </div>
  );
}

export default Motives;
