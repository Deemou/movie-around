import styled from "styled-components";
import { useLocation } from "react-router-dom";
import SearchContent from "./SearchContent";

const Wrapper = styled.div`
  padding: 10rem 0 3rem 0;
`;

const KeywordResult = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  return (
    <Wrapper>
      {keyword && <KeywordResult>Results for: {keyword}</KeywordResult>}
      {keyword && <SearchContent keyword={keyword} />}
    </Wrapper>
  );
}

export default Search;
