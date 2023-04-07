import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { windowWidth } from "./atoms";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 0 auto;
  @media screen {
    max-width: 1440px;
  }
`;

function App() {
  const setWidth = useSetRecoilState(windowWidth);
  useEffect(() => {
    const debouncedResizeHandler = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, [setWidth]);

  return (
    <Router>
      <Wrapper>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movie" element={<Movie />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
      </Wrapper>
    </Router>
  );
}

export default App;
