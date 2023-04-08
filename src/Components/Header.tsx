import styled from "styled-components";
import { Link, useMatch, PathMatch, useNavigate } from "react-router-dom";
import { motion, useAnimation, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { isMobile } from "../atoms";
import { useForm } from "react-hook-form";
import { BsArrowUpRight } from "react-icons/bs";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 10%,
    transparent
  );
  padding: 2rem 6rem;
  font-size: 1.4rem;
  z-index: 98;
  @media only screen and (max-width: 500px) {
    padding: 2rem 3rem;
  }
  @media screen {
    max-width: 1440px;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.h1)`
  color: #a30303;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  font-size: 3.5rem;
  font-weight: 600;
  font-stretch: condensed;
  margin-right: 2rem;
  @media only screen and (max-width: 500px) {
    margin-right: 2rem;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 2rem;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  font-size: 1.5rem;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  right: -0.8rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  background-color: ${(props) => props.theme.red};
  transition: transformX(-50%);
`;

const Search = styled.form<{ searchOpen: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  .searchIcon {
    width: 2.5rem;
    height: 2.5rem;
  }
  .searchBtn {
    position: absolute;
    top: -0.9rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    opacity: ${(props) => (props.searchOpen ? 1 : 0)};
    z-index: 0;
    cursor: pointer;
  }
`;

const SearchIcon = styled(motion.svg)`
  position: absolute;
  top: -1.2rem;
  left: 0;
  z-index: 1;
  cursor: pointer;
`;

const Input = styled(motion.input)`
  position: absolute;
  right: 0px;
  padding: 0.5rem 4rem;
  font-size: 1.6rem;
  transform-origin: right center;
  &::placeholder {
    font-size: 1.2rem;
  }
  @media only screen and (max-width: 650px) {
    width: 15rem;
  }
`;

const logoVariants = {
  normal: {
    opacity: 1,
  },
  active: {
    opacity: [1, 0.3, 1],
    transition: {
      repeat: Infinity,
      ease: "easeInOut",
      duration: 2,
    },
  },
};

const navVariants = {
  top: { backgroundColor: "rgba(0, 0, 0, 0)" },
  scroll: { backgroundColor: "rgba(0, 0, 0, 1)" },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLocate, setSearchLocate] = useState(0);
  const homeMatch: PathMatch<string> | null = useMatch("/");
  const homeMatch2: PathMatch<string> | null = useMatch("/home/*");
  const movieMatch: PathMatch<string> | null = useMatch("/movie/*");
  const navAnimation = useAnimation();
  const inputAnimation = useAnimation();
  const logoAnimation = useAnimation();
  const { scrollY } = useScroll();
  const mobile = useRecoilValue(isMobile);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      keyword: "",
    },
  });
  const initializationInput = () => {
    if (mobile) {
      setSearchOpen(false);
      inputAnimation.start({
        scaleX: 0,
      });
    }
  };
  const { ref, ...rest } = register("keyword", {
    required: "Input keyword.",
    minLength: 2,
    onBlur: initializationInput,
  });
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };

  useEffect(() => {
    function updateNavAnimation() {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    }

    const unsubscribeScroll = scrollY.on("change", updateNavAnimation);

    return () => {
      unsubscribeScroll();
    };
  }, []);

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }

    setSearchOpen((prev) => !prev);
    setSearchLocate((inputRef.current?.clientWidth || -25) - 6);
  };

  useEffect(() => {
    const debouncedResizeHandler = () => {
      setSearchLocate((inputRef.current?.clientWidth || -25) - 6);
    };
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, [setSearchLocate]);

  return (
    <Nav variants={navVariants} animate={navAnimation} initial="top">
      <Col>
        <Link to="/">
          <Logo
            variants={logoVariants}
            animate={logoAnimation}
            whileHover="active"
            initial="normal"
          >
            Movie Around
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">
              Home {(homeMatch || homeMatch2) && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/movie">
              Movie {movieMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)} searchOpen={searchOpen}>
          <SearchIcon
            onClick={toggleSearch}
            animate={{ x: searchOpen ? searchLocate * -1 : -25 }}
            transition={{ ease: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="searchIcon"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </SearchIcon>

          <Input
            {...rest}
            name="keyword"
            ref={(elem) => {
              if (!elem) return;
              ref(elem);
              inputRef.current = elem;
            }}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ ease: "linear" }}
            placeholder="Search"
            type="text"
          />
          <BsArrowUpRight
            onClick={handleSubmit(onValid)}
            className="searchBtn"
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
