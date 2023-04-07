const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const LANGUAGE = "ko-KO";
const REGION = "KR";
const BASE_PATH = "https://api.themoviedb.org/3";
const TAIL_PATH = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;
export const MOVIE_TYPE = ["nowPlaying", "upcomingMovies", "popularMovies"];

export interface IMovie {
  id: number;
  backdrop_path?: string;
  poster_path?: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IMovieDetail {
  id: number;
  overview?: string;
  title: string;
  original_title: string;
  vote_average: number;
  runtime: number;
  backdrop_path: string;
  poster_path?: string;
  genres: IGenre[];
  release_date: string;
  tagline?: string;
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

interface ISearch {
  id: number;
  backdrop_path?: string;
  poster_path?: string;
  title: string;
  overview: string;
}

function getRequestUrl(keyword: string, page: number) {
  return `${BASE_PATH}/movie/${keyword}?${TAIL_PATH}&page=${page}`;
}

export async function getTopRatedMovies(page: number) {
  const keyword = "top_rated";
  const requestUrl = getRequestUrl(keyword, page);
  return fetch(requestUrl).then((response) => response.json());
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}

export function getDetailData(mediaType: string, id: number) {
  return fetch(`${BASE_PATH}/${mediaType}/${id}?${TAIL_PATH}`).then(
    (response) => response.json()
  );
}

export function searchData([keyword, page]: [string, number]) {
  const requestUrl = `${BASE_PATH}/search/movie?${TAIL_PATH}&query=${keyword}&page=${page}`;
  return fetch(requestUrl)
    .then((response) => response.json())
    .catch((err) => err);
}
