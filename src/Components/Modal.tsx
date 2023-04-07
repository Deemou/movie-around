import styled, { createGlobalStyle } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getDetailData, IMovieDetail, IGenre } from "../api";
import { makeImagePath } from "../utils";
import ReactStars from "react-stars";
import { AiOutlineClose } from "react-icons/ai";
import ModalInfoItem from "../Routes/ModalItem";

const GlobalStyle = createGlobalStyle`
  html{overflow: hidden;}
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;

const ModalBox = styled(motion.div)`
  position: fixed;
  top: 12rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 50%;
  min-width: 76.8rem;
  height: 75%;
  overflow: auto;
  border-radius: 1.5rem;
  background-color: black;
  color: ${(props) => props.theme.white.lighter};
  z-index: 100;

  @media screen and (max-height: 860px) {
    overflow: auto;
  }

  @media only screen and (max-width: 800px) {
    top: 5rem;
    min-width: 58.8rem;
    width: 90%;
    height: auto;
  }
  @media only screen and (max-width: 700px) {
    top: 0;
    bottom: 0;
    min-width: auto;
    width: 100%;
    border-radius: 0;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #4e4e4e;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-track {
    background-color: #4e4e4e;
    border-radius: 100px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
`;

const ModalCover = styled.div`
  position: relative;
  width: 100%;
  height: 40rem;
  background-size: cover;
  background-position: center center;
  .closeModal {
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 2rem;
    height: 2rem;
    vertical-align: middle;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #181818;
      scale: 1.3;
    }
  }

  @media only screen and (max-width: 500px) {
    .closeModal {
      width: 3rem;
      height: 3rem;
      cursor: pointer;
      &:hover {
        color: #181818;
      }
    }
  }
`;

const ModalCoverTitle = styled.div`
  position: absolute;
  left: calc(30% + 3.5rem);
  bottom: 2rem;
  float: right;
  font-weight: 700;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`;

const ModalTitle = styled.h3`
  font-size: 3.6rem;
`;

const ModalSmallTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 400;
`;

const ModalContents = styled.div`
  position: relative;
  padding: 2rem 4rem 0 4rem;
  font-weight: 100;

  @media only screen and (max-width: 700px) {
    margin-top: -30rem;
    text-align: center;
  }
`;

const ModalImage = styled.div`
  float: left;
  width: 30%;
  margin-top: -17rem;
  img {
    width: 100%;
  }

  @media only screen and (max-width: 700px) {
    margin: 0;
    width: 100%;
    text-align: center;
    img {
      width: 50%;
      min-width: 200px;
      margin: 0 auto;
    }
  }
`;

const ModalInfoTitle = styled.div`
  display: none;

  @media only screen and (max-width: 700px) {
    display: block;
    text-align: center;
    margin: 2rem 0;
  }
`;

const ModalTextCnt = styled.div`
  float: left;
  width: 70%;
  padding-left: 2rem;

  @media only screen and (max-width: 700px) {
    padding-left: 0;
    width: 100%;
  }
`;

const ModalInfo = styled.ul`
  font-size: 1.6rem;
  line-height: 2.4rem;
  li {
    float: left;
    .rating {
      position: relative;
      display: inline-block;
      margin-top: -2px;
      overflow: hidden;
    }
    .ratingValue {
      display: inline-block;
      padding-left: 0.4rem;
      vertical-align: top;
    }
  }
  li ~ li {
    position: relative;
    margin-left: 1.2rem;
    padding-left: 1.2rem;
  }
  li ~ li:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 50%;
    background-color: #7e7e7e;
  }

  @media only screen and (max-width: 700px) {
    text-align: center;
    li {
      display: inline-block;
      float: none;
    }
    li ~ li {
      margin-left: 0.6rem;
      padding-left: 0.6rem;
    }
  }
`;

const ModalTagLine = styled.h3`
  position: relative;
  margin-bottom: 1rem;
  padding-left: 1rem;
  font-size: 1.4rem;
  &:before {
    content: "";
    position: absolute;
    width: 0.3rem;
    height: 1.2rem;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #ccc;
  }

  @media only screen and (max-width: 700px) {
    display: inline;
  }
`;

const ModalOverView = styled.p`
  margin-bottom: 5rem;
  font-size: 1.4rem;
  line-height: 1.9rem;

  @media only screen and (max-width: 700px) {
    margin: 0 auto;
    margin-top: 2rem;
    text-align: left;
    line-height: 2.4rem;
    width: 90%;
  }
`;

const ModalCategory = styled.ul`
  padding: 2rem 0;
  clear: both;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const ModalItem = styled.li`
  display: block;
  margin-bottom: 2rem;
`;

const getYear = (date: string) => {
  if (date) {
    return date.split("-")[0];
  } else {
    return "";
  }
};

const getGenreToString = (arr: IGenre[]): string => {
  if (arr && arr.length > 0) {
    return (
      arr.map((g, idx) => {
        return idx + 1 === arr.length ? `${g.name}` : `${g.name}`;
      }) + ""
    );
  }
  return "";
};

interface IModal {
  contentId: number;
  mediaType: string;
  listType: string;
  exitModal: Function;
}

export default function Modal({
  contentId,
  mediaType,
  listType,
  exitModal,
}: IModal) {
  const onOverlayClicked = () => {
    exitModal();
  };

  const { data } = useQuery<IMovieDetail>(
    [listType + contentId, "detail" + contentId],
    () => getDetailData(mediaType, contentId) || null
  );

  return (
    <>
      <GlobalStyle />
      <Overlay
        onClick={onOverlayClicked}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {data && (
        <ModalBox layoutId={contentId + listType}>
          {
            <>
              <ModalCover
                style={{
                  backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                    data.backdrop_path || "",
                    "w500"
                  )})`,
                }}
              >
                <AiOutlineClose
                  onClick={onOverlayClicked}
                  className="closeModal"
                  size={"2rem"}
                />
                <ModalCoverTitle>
                  <ModalTitle>{data.title}</ModalTitle>
                  <ModalSmallTitle>{data.original_title}</ModalSmallTitle>
                </ModalCoverTitle>
              </ModalCover>
              <ModalContents>
                <ModalImage>
                  <img
                    src={makeImagePath(data.poster_path || "", "w500")}
                    alt="poster"
                  />
                </ModalImage>
                <ModalTextCnt>
                  <ModalInfoTitle>
                    <ModalTitle>{data.title}</ModalTitle>
                    <ModalSmallTitle>{data.original_title}</ModalSmallTitle>
                  </ModalInfoTitle>
                  <ModalInfo>
                    <ModalInfoItem datas={getYear(data.release_date)} />
                    <ModalInfoItem datas={`${data.runtime}분`} />
                    <ModalInfoItem datas={getGenreToString(data.genres)} />
                    {
                      <li>
                        <ReactStars
                          count={5}
                          value={data.vote_average ? data.vote_average / 2 : 0}
                          color1="#E6E6E6"
                          color2="#FFCC33"
                          half
                          size={20}
                          edit={false}
                          className="rating"
                        />
                        <span className="ratingValue">
                          ({data.vote_average.toFixed(1)})
                        </span>
                      </li>
                    }
                  </ModalInfo>
                  <ModalCategory>
                    <ModalItem>
                      {data.tagline && (
                        <ModalTagLine>{data.tagline}</ModalTagLine>
                      )}
                      <ModalOverView title={data.overview}>
                        {data.overview && data.overview.length > 390
                          ? data.overview.slice(0, 390) + "..."
                          : data.overview}
                      </ModalOverView>
                    </ModalItem>
                  </ModalCategory>
                </ModalTextCnt>
              </ModalContents>
            </>
          }
        </ModalBox>
      )}
    </>
  );
}
