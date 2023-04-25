import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";
import { AiFillCaretRight, AiOutlineInfoCircle } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";
import { useRecoilValue } from "recoil";
import { BannerSize } from "../atoms";
import { useState } from "react";

const Wrapper = styled.div<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 70vh;
  margin: 10rem 0;
  margin-bottom: 5rem;
  padding: 4rem 6rem;
  background-repeat: no-repeat;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: 100%;
  background-position: center center;

  @media screen and (max-width: 1500px) {
    height: 95%;
  }
  @media screen and (max-width: 1400px) {
    height: 90%;
  }
  @media screen and (max-width: 1300px) {
    height: 85%;
  }
  @media screen and (max-width: 1200px) {
    height: 80%;
  }
  @media screen and (max-width: 1100px) {
    height: 70%;
  }
  @media screen and (max-width: 900px) {
    height: 60%;
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 3.2rem;
  font-weight: 900;
`;

const Overview = styled.p`
  margin-bottom: 2rem;
  width: 50rem;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2.5rem;

  @media only screen and (max-width: 600px) {
    width: 40rem;
    font-size: 1.5rem;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 1vw;
`;

interface IBannerBtn {
  color: string;
  bgcolor: string;
  hovercolor: string;
}

const BannerBtn = styled(motion.button)<IBannerBtn>`
  padding: 1rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgcolor};
  transition: all 0.3s;
  &:hover {
    background-color: ${(props) => props.hovercolor};
  }
`;

const PlayBtn = styled(BannerBtn)`
  width: 17rem;
  @media only screen and (max-width: 1000px) {
    width: 14rem;
  }
`;

const DetailInfoBtn = styled(BannerBtn)`
  width: 22rem;
  @media only screen and (max-width: 1000px) {
    width: 18rem;
  }
`;

const BtnICon = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  svg {
    width: 2.8rem;
    height: 2.8rem;
  }
  @media only screen and (max-width: 1200px) {
    width: 2.4rem;
    height: 2.4rem;
  }
  @media only screen and (max-width: 1000px) {
    width: 2rem;
    height: 2rem;
  }
  @media only screen and (max-width: 700px) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const BtnText = styled(motion.div)`
  font-size: 2.8rem;
  font-weight: 400;

  @media only screen and (max-width: 1200px) {
    font-size: 2.4rem;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 2rem;
  }
  @media only screen and (max-width: 700px) {
    font-size: 1.6rem;
  }
`;

interface IBanner {
  bannerInfo: IMovie;
}

function Banner({ bannerInfo }: IBanner) {
  const [isBoxClicked, setIsBoxClicked] = useState(false);
  const onBoxClick = () => {
    setIsBoxClicked(true);
  };
  const bannerBgSize = useRecoilValue(BannerSize);

  return (
    <Wrapper
      bgphoto={makeImagePath(bannerInfo.backdrop_path || "", bannerBgSize)}
    >
      <Title>{bannerInfo.title}</Title>
      <Overview>{bannerInfo.overview}</Overview>
      <ButtonArea>
        <PlayBtn
          color={"#000"}
          bgcolor={"rgba(255, 255, 255, 1)"}
          hovercolor={"rgba(255, 255, 255, 0.75)"}
        >
          <BtnICon>
            <AiFillCaretRight />
          </BtnICon>
          <BtnText>재생</BtnText>
        </PlayBtn>
        <DetailInfoBtn
          color={"#fff"}
          bgcolor={"rgba(109, 109, 110, 0.7)"}
          hovercolor={"rgba(109, 109, 110, 0.4)"}
          onClick={onBoxClick}
        >
          <BtnICon>
            <AiOutlineInfoCircle />
          </BtnICon>
          <BtnText>상세 정보</BtnText>
        </DetailInfoBtn>
      </ButtonArea>
      <AnimatePresence>
        {isBoxClicked && (
          <Modal
            exitModal={() => {
              setIsBoxClicked(false);
            }}
            contentId={bannerInfo.id}
            mediaType={"movie"}
            listType={"coverMovie"}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Banner;
