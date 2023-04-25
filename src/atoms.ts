import { atom, selector } from "recoil";

export const windowWidth = atom({
  key: "windowWidth",
  default: window.innerWidth,
});

export const isMobile = atom({
  key: "isMobile",
  default: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
});

export const BannerSize = selector({
  key: "bannerSize",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width < 501) {
      return "w500";
    } else {
      return "";
    }
  },
});

export const slideContentCols = selector({
  key: "slideContentCols",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width >= 1200) {
      return 5;
    } else if (width >= 800) {
      return 4;
    } else {
      return 2;
    }
  },
});

export const listContentCols = selector({
  key: "listContentCols",
  get: ({ get }) => {
    const width = get(windowWidth);
    if (width >= 800) {
      return 4;
    } else if (width >= 250) {
      return 2;
    } else {
      return 1;
    }
  },
});
