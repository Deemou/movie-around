import styled from "styled-components";
import List from "../Components/List";
import { IGetMoviesResult, getTopRatedMovies } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Wrapper = styled.div`
  padding: 10rem 6rem 3rem 6rem;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const mediaType = "movie";

function Movie() {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    [mediaType, page],
    () => getTopRatedMovies(page)
  );

  useEffect(() => {
    const newPage = new URLSearchParams(location.search).get("page");
    if (newPage) {
      setPage(+newPage);
    }
  }, [page, location]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <List data={data as IGetMoviesResult} mediaType={mediaType} />
      )}
    </Wrapper>
  );
}

export default Movie;
