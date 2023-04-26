import styled from "styled-components";
import List from "../Components/List";
import { IGetMoviesResult, getTopRatedMovies } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Wrapper = styled.div`
  padding: 10rem 0 3rem 0;
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
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    [mediaType, page],
    () => getTopRatedMovies(page)
  );

  useEffect(() => {
    if (!data) return;
    if (page > data.total_pages) {
      setPage(1);
      navigate(`${location.pathname}`);
      return;
    }
    let newPage = Number(new URLSearchParams(location.search).get("page"));
    if (!newPage) newPage = 1;
    setPage(newPage);
  }, [page, location, data, navigate]);

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
