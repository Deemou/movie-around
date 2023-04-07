import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { IGetSearchResult, searchData } from "../api";
import List from "../Components/List";

const NoSearchData = styled.div`
  top: 39%;
  padding-top: 8rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 500;
`;

const mediaType = "movie";

function SearchContent({ keyword }: { keyword: string }) {
  const { data } = useQuery<IGetSearchResult>(
    ["search", keyword],
    () => searchData(keyword || ""),
    { useErrorBoundary: true }
  );

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
