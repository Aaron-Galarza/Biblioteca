// ../src/app.jsx
import '@mantine/core/styles.css'; // NOTE: used for MantineUI
import { HashRouter, Routes, Route } from "react-router-dom";

import { HeaderMegaMenu } from './components/HeaderMegaMenu';
import { FooterCentered } from './components/FooterCentered';
import { HeroImageBackground } from './components/HeroImageBackground';

import HomePage from "./pages/HomePage";
import LibrosPage from "./pages/LibrosPage";
import SociosPage from "./pages/SociosPage";
import PrestamosPage from "./pages/PrestamosPage";
import MultasPage from "./pages/MultasPage";
import "./App.css";

import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});


function App() {
  return (
    <MantineProvider theme={theme}>
      <HashRouter>
      <HeaderMegaMenu/>
      <HeroImageBackground/>
        <div className="">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/libros" element={<LibrosPage />} />
            <Route path="/socios" element={<SociosPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/multas" element={<MultasPage />} />
          </Routes>
        </div>
        {/* <Footer /> */}
        <FooterCentered/>
      </HashRouter>
    </MantineProvider>
  );
}

export default App;
