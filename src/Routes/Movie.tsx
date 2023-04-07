import styled from "styled-components";
import List from "../Components/List";
import { IGetMoviesResult, getTopRatedMovies } from "../api";
import { useQuery } from "@tanstack/react-query";

const Wrapper = styled.div`
  padding: 11rem 6rem;
  @media only screen and (max-width: 500px) {
    padding: 9rem 3rem;
  }
  @media screen {
    max-width: 1440px;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const mediaType = "movie";

function Movie() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    [mediaType, mediaType],
    getTopRatedMovies
  );
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
