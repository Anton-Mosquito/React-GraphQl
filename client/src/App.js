import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigation } from "./components";
import { Home, Settings, Recommend } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navigation />
      <Box sx={{ backgroundColor: (theme) => theme.palette.grey(100) }}>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="recommend" element={<Recommend />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;
