import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  IMovie,
  IGetMoviesResult,
  MOVIE_TYPE,
} from "../api";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import { Helmet } from "react-helmet-async";

const Wrapper = styled.div`
  background: #000;
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

const SliderArea = styled.div`
  position: relative;
  margin-top: -16.8rem;
  @media screen and (max-width: 700px) {
    margin-top: -8.8rem;
  }
`;

function Home() {
  const { data: nowPlayingMoviesList, isLoading } = useQuery<IGetMoviesResult>(
    [MOVIE_TYPE[0], "nowPlayingMovies"],
    getNowPlayingMovies
  );

  const { data: upcomingMoviesList } = useQuery<IGetMoviesResult>(
    [MOVIE_TYPE[1], "upcomingMovies"],
    getUpcomingMovies
  );

  const { data: popularMoviesList } = useQuery<IGetMoviesResult>(
    [MOVIE_TYPE[2], "popularMovies"],
    getPopularMovies
  );

  return (
    <>
      <Helmet>
        <title>Movie Around</title>
      </Helmet>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner bannerInfo={nowPlayingMoviesList?.results[0] as IMovie} />
            <SliderArea>
              <Slider
                data={nowPlayingMoviesList as IGetMoviesResult}
                title={"NOW PLAYING"}
                listType={MOVIE_TYPE[0]}
                mediaType={"movie"}
              />
              <Slider
                data={upcomingMoviesList as IGetMoviesResult}
                title={"UPCOMING MOVIES"}
                listType={MOVIE_TYPE[1]}
                mediaType={"movie"}
              />
              <Slider
                data={popularMoviesList as IGetMoviesResult}
                title={"POPULAR MOVIES"}
                listType={MOVIE_TYPE[2]}
                mediaType={"movie"}
              />
            </SliderArea>
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Home;
