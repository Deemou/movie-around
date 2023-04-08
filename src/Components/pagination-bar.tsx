import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Bar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4rem;
  padding-bottom: 1.25rem;
  button {
    color: white;
    aspect-ratio: 1/1;
    height: 4.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    border-radius: 0.8rem;
    margin: 0 0.2rem;
  }
  svg {
    background-color: black;
  }
`;

const PrevBtn = styled.button<{ currentPage: number }>`
  visibility: ${(props) => (props.currentPage === 1 ? "hidden" : "visible")};
  background-color: black;
  border-color: black;
  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const NextBtn = styled.button<{ currentPage: number; lastPage: number }>`
  visibility: ${(props) =>
    props.currentPage === props.lastPage ? "hidden" : "visible"};
  background-color: black;
  border-color: black;
  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const FirstPageBtn = styled.div<{ pages: number[] }>`
  display: ${(props) => (props.pages.includes(1) ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  button {
    background-color: black;
    border-color: white;
  }
  svg {
    width: 2rem;
    height: 2rem;
    margin: 0 0.5rem;
  }
`;

const LastPageBtn = styled.div<{ pages: number[]; lastPage: number }>`
  display: ${(props) =>
    props.pages.includes(props.lastPage) ? "none" : "flex"};
  align-items: center;
  justify-content: center;
  button {
    background-color: black;
    border-color: white;
  }
  svg {
    width: 2rem;
    height: 2rem;
    margin: 0 0.5rem;
  }
`;

const PageBtn = styled.button<{ page: number; currentPage: number }>`
  background-color: ${(props) =>
    props.page === props.currentPage ? "red" : "black"};
  border-color: ${(props) =>
    props.page === props.currentPage ? "black" : "white"};
`;

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}
type Direction = "prev" | "next";

export default function PaginationBar({
  currentPage,
  lastPage,
}: PaginationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pages, setPages] = useState<number[]>([]);
  const pageLimit = Math.min(5, lastPage);
  const onClickPage = (page: number) => {
    move(page);
  };
  const onClickDirection = (direction: Direction) => {
    if (direction === "prev") {
      move(currentPage - 1);
    } else {
      move(currentPage + 1);
    }
  };
  const move = (num: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", num + "");
    const requestUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(requestUrl);
  };

  useEffect(() => {
    if (currentPage <= 3) {
      setPages(Array.from({ length: pageLimit }, (_, i) => i + 1));
    } else if (currentPage > 3 && currentPage + 2 < lastPage) {
      setPages([
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ]);
    } else if (currentPage + 3 >= lastPage) {
      setPages(
        Array.from({ length: pageLimit }, (_, i) => lastPage - i).reverse()
      );
    }
  }, [currentPage, lastPage, pageLimit]);
  return (
    <Bar>
      <PrevBtn
        currentPage={currentPage}
        onClick={() => {
          onClickDirection("prev");
        }}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="48"
          height="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </PrevBtn>
      <FirstPageBtn pages={pages}>
        <button
          onClick={() => {
            onClickPage(1);
          }}
        >
          <span>{1}</span>
        </button>
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </FirstPageBtn>
      {pages?.map((page) => {
        return (
          <PageBtn
            page={page}
            currentPage={currentPage}
            onClick={() => {
              onClickPage(page);
            }}
            key={page}
          >
            <span>{page}</span>
          </PageBtn>
        );
      })}
      <LastPageBtn pages={pages} lastPage={lastPage}>
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
        <button
          onClick={() => {
            onClickPage(lastPage);
          }}
        >
          <span>{lastPage}</span>
        </button>
      </LastPageBtn>
      <NextBtn
        currentPage={currentPage}
        lastPage={lastPage}
        onClick={() => {
          onClickDirection("next");
        }}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </NextBtn>
    </Bar>
  );
}
