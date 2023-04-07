import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { IGetSearchResult, searchData } from "../api";
import List from "../Components/List";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const NoSearchData = styled.div`
  top: 39%;
  padding-top: 8rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 500;
`;

const mediaType = "movie";

function SearchContent({ keyword }: { keyword: string }) {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);

  const { data } = useQuery<IGetSearchResult>(
    ["search", [keyword, page]],
    () => searchData([keyword, page] || ""),
    { useErrorBoundary: true }
  );

  useEffect(() => {
    const newPage = new URLSearchParams(location.search).get("page");
    if (newPage) {
      setPage(+newPage);
    }
  }, [page, location]);

  return (
    <>
      {data && data.results.length > 0 ? (
        <List data={data as IGetSearchResult} mediaType={mediaType} />
      ) : (
        <NoSearchData>No movie found for the keyword '{keyword}'</NoSearchData>
      )}
    </>
  );
}

export default SearchContent;
