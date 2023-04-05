import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import Modal from "./Modal";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { isMobile, slideContentCols } from "../atoms";

const Wrapper = styled(motion.div)`
  position: relative;
  min-height: 23.9rem;
  margin-top: 3rem;
  overflow: hidden;
  :hover .arrow {
    opacity: 1;
  }
  @media screen {
    max-width: 1440px;
  }
`;

const SliderTitle = styled.div`
  font-size: 2.4rem;
  padding-left: 2rem;
  font-weight: 700;
  padding-bottom: 1rem;
`;

const ArrowBtn = styled(motion.div)<{ mobile: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 16rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => props.mobile};
  transition: all 0.3s;
  z-index: 90;
  cursor: pointer;
  &:hover {
    color: #000;
    background-color: #fff;
  }
  &:blur {
    color: #fff;
    background-color: #000;
  }
  svg {
    width: 2.8rem;
    height: 2.8rem;
  }
  @media only screen and (max-width: 500px) {
    width: 5rem;
    height: 5rem;
    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const LeftArrowBtn = styled(ArrowBtn)`
  left: 0;
`;

const RightArrowBtn = styled(ArrowBtn)`
  right: 0;
`;

const Container = styled(motion.div)`
  position: absolute;
  left: 0;
  margin-bottom: 3rem;
  width: 100%;
  clear: both;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const Box = styled(motion.div)<{ bgphoto: string; offset: number }>`
  display: block;
  float: left;
  width: calc(100% / ${(props) => props.offset} - 5px);
  height: 16rem;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  font-size: 4rem;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  & ~ & {
    margin-left: 0.6rem;
  }
`;

const Title = styled(motion.div)`
  position: relative;
  top: 15.8rem;
  width: 100%;
  padding: 1rem;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  text-align: center;
  font-size: 1.8rem;
`;

const rowVariants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
    };
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.3,
      duration: 0.2,
    },
  },
};

const titleVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

interface ISlider {
  data: IGetMoviesResult;
  title: string;
  listType: string;
  mediaType: string;
}

const RIGHT = 1;
const LEFT = -1;

export default function Slider({ data, title, listType, mediaType }: ISlider) {
  const offset = useRecoilValue(slideContentCols);
  const mobile = useRecoilValue(isMobile);
  const [contentId, setContentId] = useState(0);
  const [isBoxClicked, setIsBoxClicked] = useState(false);
  const [direction, setDirection] = useState(RIGHT);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const dragWrapperRef = useRef<HTMLDivElement>(null);

  const toggleLeaving = (value: boolean) => {
    setLeaving(value);
    setDragMode(value);
  };
  const changeIndex = () => {
    // 슬라이더 버튼 및 드래그로 인한 강제 흘러감 방지
    if (leaving || dragMode) return;
    if (!data) return;

    toggleLeaving(true);
    const totalLength = data.results.length;
    //20개 리스트에서 18개만 보여주기 위해 floor처리
    const maxIndex =
      totalLength % offset === 0
        ? Math.floor(totalLength / offset) - 1
        : Math.floor(totalLength / offset);

    direction === RIGHT
      ? setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  //resize로 인해 index의 값이 엄청 커진 상태에서 offset 개수가 많아지면 값이 안 맞는 현상 막기 위해 재연산 처리 추가
  useEffect(() => {
    if (!data) return;

    const dataTotalLen = data.results.length;
    const maxIdx =
      dataTotalLen % offset === 0
        ? Math.floor(dataTotalLen / offset) - 1
        : Math.floor(dataTotalLen / offset);

    if (index > maxIdx) {
      setIndex(maxIdx);
    }
  }, [offset, data, index, setIndex]);

  const onBoxClick = (id: number) => {
    setContentId(id);
    setIsBoxClicked(true);
  };

  const rowProps = {
    gridcnt: offset,
    custom: direction,
    variants: rowVariants,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    transition: { type: "tween", duration: 1 },
    key: index,
  };

  /**
   * 드래그 이벤트 끝나고 delta값에 따라 좌, 우 슬라이드 이동처리
   * @param event
   * @param info
   */
  const dragEnd = (event: TouchEvent, info: PanInfo) => {
    if (!leaving && !dragMode) {
      if (info.delta.x > 1) {
        setDirection(RIGHT);
        changeIndex();
      } else if (info.delta.x < -1) {
        setDirection(LEFT);
        changeIndex();
      }
    }
  };

  const onClickArrowBtn = (to: number) => {
    if (!leaving && !dragMode) {
      setDirection(to);
      changeIndex();
    }
  };

  return (
    <Wrapper ref={dragWrapperRef}>
      <SliderTitle>{title}</SliderTitle>
      <LeftArrowBtn
        mobile={mobile ? 1 : 0}
        className="arrow"
        onClick={() => onClickArrowBtn(LEFT)}
      >
        <AiOutlineLeft />
      </LeftArrowBtn>
      <RightArrowBtn
        mobile={mobile ? 1 : 0}
        className="arrow"
        onClick={() => onClickArrowBtn(RIGHT)}
      >
        <AiOutlineRight />
      </RightArrowBtn>
      <AnimatePresence
        initial={false}
        onExitComplete={() => toggleLeaving(false)}
        custom={direction}
      >
        <Container
          {...rowProps}
          {...(mobile
            ? {
                drag: "x",
                dragConstraints: dragWrapperRef,
                onDragEnd: dragEnd,
                dragListener: !dragMode,
              }
            : {})}
        >
          {data?.results
            .slice(offset * index, offset * index + offset)
            .map((content) => (
              <Box
                key={content.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                layoutId={content.id + "" + listType}
                bgphoto={makeImagePath(content.backdrop_path || "", "w500")}
                offset={offset}
                onClick={() => {
                  onBoxClick(content.id);
                }}
              >
                <Title variants={titleVariants}>{content.title}</Title>
              </Box>
            ))}
        </Container>
      </AnimatePresence>
      <AnimatePresence>
        {isBoxClicked && (
          <Modal
            exitModal={() => {
              setIsBoxClicked(false);
            }}
            contentId={contentId}
            mediaType={mediaType}
            listType={listType}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
