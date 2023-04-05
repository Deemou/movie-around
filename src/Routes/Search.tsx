import styled from "styled-components";
import { useLocation } from "react-router-dom";
import SearchContent from "./SearchContent";

const Wrapper = styled.div`
  padding: 11rem 6rem;
  @media only screen and (max-width: 500px) {
    padding: 9rem 3rem;
  }
  @media screen {
    max-width: 1440px;
  }
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
