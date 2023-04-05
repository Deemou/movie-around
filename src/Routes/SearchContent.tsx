import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { IGetSearchResult, searchData } from "../api";
import { makeImagePath } from "../utils";
import Modal from "../Components/Modal";
import { useState } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 0.25fr);
  gap: 2rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  float: left;
  margin: 0.3rem;
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
  z-index: -1;
`;

const NoSearchData = styled.div`
  position: absolute;
  top: 39%;
  transform: translateY(-50%);
  padding-top: 8rem;
  width: 100%;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 500;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
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

const mediaType = "movie";

function SearchContent({ keyword }: { keyword: string }) {
  const [contentId, setContentId] = useState(0);
  const [isBoxClicked, setIsBoxClicked] = useState(false);
  const { data } = useQuery<IGetSearchResult>(
    ["search", keyword],
    () => searchData(keyword || ""),
    { useErrorBoundary: true }
  );

  const onBoxClick = (id: number) => {
    setContentId(id);
    setIsBoxClicked(true);
  };

  return (
    <>
      {data && data.results.length > 0 ? (
        <>
          <Container>
            {data?.results.map((content) => (
              <Box
                layoutId={content.id + mediaType}
                key={content.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(content.backdrop_path || "", "w500")}
                onClick={() => onBoxClick(content.id)}
              >
                <Title variants={titleVariants}>{content.title}</Title>
              </Box>
            ))}
          </Container>
          <AnimatePresence>
            {isBoxClicked && (
              <Modal
                exitModal={() => {
                  setIsBoxClicked(false);
                }}
                contentId={contentId}
                mediaType={mediaType}
                listType={mediaType}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <NoSearchData>No movie found for the keyword '{keyword}'</NoSearchData>
      )}
    </>
  );
}

export default SearchContent;
