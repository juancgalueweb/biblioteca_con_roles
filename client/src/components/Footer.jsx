import React from "react";
import styles from "../scss/Footer.module.scss";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6>Sobre Nosotros</h6>
              <p>
                Aquí encontrarás información útil relacionada con los libros que
                están en tendencia, lo más demandados, los que te llevan a
                soñar, enamorarte y vivir una vida de fantasía mientras los
                lees. Déjate guiar a través de las recomendaciones hechas por
                nuestros usuarios.
              </p>
            </div>
            <div className="col-md-3 mx-auto mt-0">
              <h6>Síguenos en nuestras redes</h6>
              <p>
                <a href="/">
                  <TwitterOutlined className="fs-4" />
                </a>
              </p>
              <p>
                <a href="/">
                  <FacebookOutlined className="fs-4" />
                </a>
              </p>
              <p>
                <a
                  href="https://www.linkedin.com/in/juancgalue"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedinOutlined className="fs-4" />
                </a>
              </p>
              <p>
                <a
                  href="https://github.com/juancgalueweb"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <GithubOutlined className="fs-4" /> @juancgalue
                </a>
              </p>
              <p>
                <a
                  href="https://github.com/thamaraRD"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <GithubOutlined className="fs-4" /> @thamaraRD
                </a>
              </p>
            </div>
          </div>
          <hr />
        </div>
        <div className="container text-center">
          <p>Copyright &copy; 2022</p>
        </div>
      </footer>
    </div>
  );
};
