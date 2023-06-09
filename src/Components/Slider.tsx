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
  width: 5rem;
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
  @media only screen and (max-width: 499px) {
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

const Row = styled(motion.div)`
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
  background-color: black;
  opacity: 0;
  text-align: center;
  font-size: 1.8rem;
`;

const rowVariants = {
  hidden: (to: number) => {
    const sliderWidth = Math.min(1440, window.innerWidth) - 30;
    return {
      x: to === 1 ? sliderWidth + 5 : -sliderWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (to: number) => {
    const sliderWidth = Math.min(1440, window.innerWidth) - 30;
    return {
      x: to === 1 ? -sliderWidth - 5 : sliderWidth + 5,
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
  const [index, setIndex] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const dragWrapperRef = useRef<HTMLDivElement>(null);

  const changeIndex = () => {
    // 슬라이더 버튼 및 드래그로 인한 강제 흘러감 방지
    if (leaving) return;
    if (!data) return;

    setLeaving(true);
    const totalLength = data.results.length;
    const maxIndex = totalLength / offset;

    direction === RIGHT
      ? setIndex((prev) => (prev >= maxIndex ? 1 : prev + 1))
      : setIndex((prev) => (prev === 1 ? maxIndex : prev - 1));
  };

  //resize로 인해 index의 값이 엄청 커진 상태에서 offset 개수가 많아지면 값이 안 맞는 현상 막기 위해 재연산 처리 추가
  useEffect(() => {
    if (!data) return;

    const totalLength = data.results.length;
    const maxIndex = totalLength / offset;

    if (index > maxIndex) {
      setIndex(maxIndex);
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
    if (leaving) return;

    if (info.delta.x < -1) {
      setDirection(RIGHT);
      changeIndex();
    } else if (info.delta.x > 1) {
      setDirection(LEFT);
      changeIndex();
    }
  };

  const onClickArrowBtn = (to: number) => {
    if (leaving) return;

    setDirection(to);
    changeIndex();
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
        onExitComplete={() => setLeaving(false)}
        custom={direction}
      >
        <Row
          {...rowProps}
          {...(mobile
            ? {
                drag: "x",
                dragConstraints: dragWrapperRef,
                onDragEnd: dragEnd,
                dragListener: !leaving,
              }
            : {})}
        >
          {data?.results
            .slice(offset * (index - 1), offset * index)
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
        </Row>
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
