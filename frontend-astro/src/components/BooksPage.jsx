// src/components/BooksPage.jsx
import { useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { Carousel } from "@mantine/carousel"; // Importa el componente Carousel
import classes from "../styles/HeroImageBackground.module.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css"; // Asegúrate de importar los estilos del carrusel

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import BookCard from "./BookCard";

export default function BooksPage() {
  const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/books`)
      .then((res) => res.json())
      .then(setBooks)
      .catch((err) => console.error("Error fetching books:", err));
  }, [BASE_URL]);

  // Mapea los libros a los slides del carrusel
  const slides = books.map((book) => (
    <Carousel.Slide key={book.idLibro}>
      <BookCard book={book} />
    </Carousel.Slide>
  ));

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />

      <section>
        <div className={classes.wrapper}>
          <section style={{ padding: 50 }}>
            <Carousel
              withIndicators
              height={450} // Ajusta la altura según sea necesario
              slideSize="33.333333%"
            //   slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }} // Define el tamaño de las diapositivas para diferentes tamaños de pantalla
              slideGap={{ base: 0, sm: "md" }} // Define el espacio entre diapositivas
              loop
              align="start"
              controlsOffset="lg"
              controlSize={35}
              emblaOptions={{
                loop: true,
                dragFree: false,
                align: "center",
              }}
              slidesToScroll={1} // Define cuántas diapositivas se desplazan a la vez
            >
              {slides}
            </Carousel>
          </section>
        </div>
      </section>
    </MantineProvider>
  );
}
