import noImageSmall from "./assets/images/noImageSmall.png";

export function makeImagePath(id: string, format?: string) {
  if (id === "" || id === null || id === undefined) {
    return noImageSmall;
  } else {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  }
}
