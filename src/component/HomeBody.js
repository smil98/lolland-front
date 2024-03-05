import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";

import "./swiper.css";
import { Autoplay, EffectFade, Thumbs } from "swiper/modules";
import SwiperImg from "./SwiperImg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Recent } from "./RecentViewed";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ScreenContext } from "./ScreenContext";

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);

    navigate("?" + params);
  }

  return (
    <Box mx="35%">
      <InputGroup>
        <InputLeftElement w="25%">
          <Select
            border="1px solid black"
            borderRadius={0}
            defaultValue="all"
            _focus={{ border: "1px solid black", shadow: "none" }}
            _hover={{ border: "1px solid black" }}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="product_name">상품명</option>
            <option value="company_name">회사명</option>
          </Select>
        </InputLeftElement>
        <Input
          borderRadius={0}
          textIndent="25%"
          placeholder="검색어를 입력해주세요"
          border="1px solid black"
          _focus={{ border: "1px solid black", shadow: "none" }}
          _hover={{ border: "1px solid black" }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputRightElement bgColor="black" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

export function HomeBody() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  const [productList, setProductList] = useState([]); // 상품 목록 상태

  const [mostReviewedProducts, setMostReviewedProducts] = useState([]); // 리뷰많은 3개 상품 상태
  const [boardList, setBoardList] = useState(null); // 게임장비커뮤니티 베스트게시물 상태
  const [top, setTop] = useState(null); // 게임커뮤니티 베스트게시물 상태
  const [naver, setNaver] = useState(null); // 뉴스기사 상태
  const [categoryProducts, setCategoryProducts] = useState({}); // 카테고리별 상품 상태

  const { isSmallScreen } = useContext(ScreenContext);

  // -------------------------------- 리뷰많은 상품 3개 불러오기 --------------------------------
  useEffect(() => {
    axios
      .get("/api/product/most-reviewed")
      .then((response) => {
        setMostReviewedProducts(response.data);
      })
      .catch((error) => {
        console.error("에러메세지 :", error);
      });
  }, []);

  // -------------------------------- 게임장비, 게임 커뮤니티 베스트게시물 가져오기 --------------------------------
  useEffect(() => {
    const fetchGameGearAndCommunity = async () => {
      try {
        const [gearResponse, communityResponse] = await Promise.all([
          axios.get("/api/gearboard/today"),
          axios.get("/api/gameboard/list/top"),
        ]);
        setBoardList(gearResponse.data);
        setTop(communityResponse.data);
      } catch (error) {
        toast({
          title: "데이터 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      }
    };
    fetchGameGearAndCommunity();
  }, []);

  // -------------------------------- 커뮤니티 뉴스API 가져오기 --------------------------------
  useEffect(() => {
    axios.get("/api/gameboard/pc").then((response) => {
      setNaver(response.data);
    });
  }, []);

  // -------------------------------- 카테고리 & 카테고리별 상품 불러오기 --------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function fetchInitialData() {
      try {
        // 카테고리 데이터 가져오기
        const categoryResponse = await axios.get("/api/product/mainCategory");
        if (!isCancelled) {
          setCategories(categoryResponse.data);

          // 각 카테고리별 상품 데이터 가져오기
          const categoryRequests = categoryResponse.data.map((category) =>
            axios.get(`/api/product/list?c=${category.category_id}&limit=8`),
          );
          const productResponses = await axios.all(categoryRequests);
          if (!isCancelled) {
            const newCategoryProducts = productResponses.reduce(
              (acc, response, index) => {
                const categoryId = categoryResponse.data[index].category_id;
                acc[categoryId] = response.data.product;
                return acc;
              },
              {},
            );
            setCategoryProducts(newCategoryProducts);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          toast({
            title: "데이터 불러오는 도중 에러 발생",
            description: error.response.data,
            status: "error",
          });
        }
      }
    }
    fetchInitialData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // -------------------------------- 최근본상품 로컬스토리지 & 애니메이션 --------------------------------
  const [scrollPosition, setScrollPosition] = useState(0);
  const fixedTopPosition = 700;
  const stickyTopPosition = 100;
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const menuStyle = {
  //   position: "fixed",
  //   bottom: { base: 5, md: 120 },
  //   right: { base: "15%", md: 10, lg: 5, xl: 5 },
  //   zIndex: 10,
  //   padding: "4px",
  //   backgroundColor: "rgba(255, 255, 255, 0.7)",
  //   boxShadow: "base",
  //   border: "1px solid #E1E1E1",
  //   maxW: "sm",
  //   overflow: "hidden",
  //   borderRadius: "15px",
  //   transition: "top 0.3s ease-in-out",
  // };

  const menuStyle = {
    position: "fixed",
    bottom: isSmallScreen ? { base: 5, md: "50%" } : { base: 5, md: 120 },
    right: isSmallScreen
      ? { base: "50%", md: "auto" }
      : { base: "15%", md: 10, lg: 5, xl: 5 },
    transform: isSmallScreen ? { translateX: "-50%" } : undefined,
    zIndex: 10,
    padding: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    boxShadow: "base",
    border: "1px solid #E1E1E1",
    maxW: "sm",
    overflow: "hidden",
    borderRadius: "15px",
    transition: "top 0.3s ease-in-out",
  };

  // -------------------------------- 글자수가 특정개수 이상일때 자르기 --------------------------------
  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  // -------------------------------- 가격 ex) 1,000 ,로 구분지어 보여지게 처리 --------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // -------------------------------- 버튼 디자인 --------------------------------
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  // -------------------------------- 중간2 카테고리 버튼 디자인 --------------------------------
  const categoryStyle = {
    m: "auto",
    height: "150px",
    w: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  // -------------------------------- null 오류 방지 --------------------------------
  if (boardList === null) {
    return <Spinner />;
  } else if (naver === null) {
    return <Spinner />;
  } else if (top === null) {
    return <Spinner />;
  } else if (productList === null) {
    return <Spinner />;
  }

  // -------------------------------- 카테고리 아이콘 이미지 --------------------------------
  const categoryMenuIcon = [
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/154/31347470_3.jpg", // 노트북
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/157/979307_3_600.jpg", // 모니터
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/166/707105_600.jpg", // pc/헤드셋
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/173/980228_2_600.jpg", // 태블릿
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/177/1084277_600.jpg", // Apple
    "https://lollandproject0108.s3.ap-northeast-2.amazonaws.com/lolland/product/productMainImg/183/710668_2_600.jpg", // 키보드
    "https://image3.compuzone.co.kr/img/product_img/2023/0512/1026628/1026628_600.jpg", // 마우스
    "https://image3.compuzone.co.kr/img/product_img/2019/0410/562726/562726_600.jpg", // 마우스패드
    "https://image3.compuzone.co.kr/img/product_img/2018/0207/447472/447472_600.jpg", // 외장하드
  ];

  // -------------------------------- 카테고리별 상품목록 이미지 --------------------------------
  const categoryImages = {
    1: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176425.jpg",
    2: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174694.jpg",
    3: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174769.jpg",
    4: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174698.jpg",
    5: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_171282.jpg",
    6: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176479.jpg",
    7: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_176493.jpg",
    8: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_178064.jpg",
    9: "https://image5.compuzone.co.kr/img/images/main2014/H/MainCategoryRolling_174682.jpg",
  };
  // -------------------------------- 카테고리별 상품목록 문구 --------------------------------
  const categoryDescriptions = {
    1: ["게임은 역시 장비빨", "고성능 노트북으로 승부하라!"],
    2: ["구매왕 챌린지!", "화질의 한계를 넘어서세요."],
    3: ["최상의 게임 경험을 위한 필수품", "몰입감을 높여줄 최적의 선택."],
    4: ["휴대성과 성능의 완벽한 조화", "언제 어디서나 당신의 일터."],
    5: ["비즈니스를 위한", "막강한 파워"],
    6: ["타이핑이 즐거워지는 느낌", "손끝에서 시작되는 기적."],
    7: ["빠르고 정밀한 마우스플레이", "정확한 클릭, 빠른 반응."],
    8: ["부드러운 슬립감", "안정성과 정확성의 기반."],
    9: ["레노버 서버 사은품행사", "강력한 성능, 놀라운 혜택."],
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      gap="80px"
    >
      {/* ------------------------ 상단 배너 슬라이드 ------------------------ */}
      <Box borderRadius="20px" w="90%" h="100%">
        <SwiperImg />
      </Box>

      {/* ------------------------ 최근본상품 ------------------------ */}
      {/*<Box {...menuStyle}>*/}
      {/*  <Recent />*/}
      {/*</Box>*/}

      {/* 뜨는 상품, 최신 기사, 커뮤니티 베스트 추출*/}
      <SimpleGrid
        w="90%"
        display={{ base: "normal", md: "flex" }}
        column={{ md: 1, lg: 2, xl: 2 }}
        spacing={10}
        mt={-10}
      >
        <Box border="1px solid #E1E1E1" w={{ base: "100%", md: "30%" }} p={5}>
          <Text
            fontSize="sm"
            color="orange"
            className="specialHeadings"
            fontWeight="bold"
          >
            <FontAwesomeIcon icon={faFire} /> 핫한 상품들을 한 번에
          </Text>
          <Text fontSize="2xl" className="specialHeadings" fontWeight="bold">
            실시간 뜨고 있는 상품
          </Text>
          <Box
            w="full"
            mt={5}
            h="500px"
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <Swiper
              alignItems="center"
              modules={[EffectFade, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              effect="fade"
            >
              {mostReviewedProducts.map((product) => (
                <SwiperSlide
                  key={product.product_id}
                  style={{
                    alignItems: "center",
                    textAlign: "left",
                    justifyContent: "center",
                  }}
                  onClick={() => navigate("/product/" + product.product_id)}
                >
                  {product.productImgs && product.productImgs.length > 0 && (
                    <Image
                      src={product.productImgs[0].main_img_uri}
                      alt="Product Image"
                      mx="auto"
                      maxW="300px"
                      maxH="300px"
                      mb={5}
                    />
                  )}
                  <Text opacity={0.7} fontSize="md">
                    [{product.company_name}]
                  </Text>
                  <Text fontSize="lg" className="labels">
                    {product.product_name}
                  </Text>
                  <Text
                    fontWeight="bold"
                    color="orange"
                    className="specialHeadings"
                    fontSize="2xl"
                    mt={5}
                  >
                    {product.product_price.toLocaleString()}원
                  </Text>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
        <Stack
          w={{ base: "100%", md: "70%" }}
          mt={{ base: 5, md: 0 }}
          direction="column"
          spacing={5}
          justifyContent="center"
          alignItems="center"
        >
          <Stack direction={{ base: "column", md: "row" }} w="full" spacing={5}>
            <Box
              p={5}
              border="1px solid #E1E1E1"
              w={{ base: "100%", md: "50%" }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text
                    fontSize="sm"
                    color="orange"
                    className="specialHeadings"
                    fontWeight="bold"
                  >
                    게임 장비 커뮤니티
                  </Text>
                  <Text
                    fontSize="2xl"
                    className="specialHeadings"
                    fontWeight="bold"
                  >
                    추천 게시물
                  </Text>
                </Box>
                <Button
                  color="gray"
                  variant="undefined"
                  size="xs"
                  onClick={() => navigate("/gearlistlayout")}
                >
                  더보기
                </Button>
              </Flex>
              <Stack divider={<StackDivider />} spacing="3">
                {boardList.slice(0, 3).map((item) => (
                  <Flex
                    key={item.gear_id}
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Box mt={3}>
                      <Heading
                        _hover={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/gearlist/gear_id/" + item.gear_id)
                        }
                        size="xs"
                        textTransform="uppercase"
                      >
                        {item.gear_title}
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {truncateText(item.gear_content, 30)}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
            <Box
              p={5}
              border="1px solid #E1E1E1"
              w={{ base: "100%", md: "50%" }}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Text
                    fontSize="sm"
                    color="orange"
                    className="specialHeadings"
                    fontWeight="bold"
                  >
                    게임 커뮤니티
                  </Text>
                  <Text
                    fontSize="2xl"
                    className="specialHeadings"
                    fontWeight="bold"
                  >
                    BEST 게시물
                  </Text>
                </Box>
                <Button
                  color="gray"
                  variant="undefined"
                  size="xs"
                  onClick={() => navigate("/gameboard/list?s=")}
                >
                  더보기
                </Button>
              </Flex>
              <Stack divider={<StackDivider />} spacing="3">
                {top.slice(0, 3).map((item) => (
                  <Flex key={item.id} justify="flex-start" alignItems="center">
                    <Box mt={3}>
                      <Heading
                        _hover={{ cursor: "pointer" }}
                        onClick={() => navigate("/gameboard/id/" + item.id)}
                        size="xs"
                        textTransform="uppercase"
                      >
                        {item.title}
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {truncateText(item.board_content, 30)}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Stack>
          <Box p={5} w="full" border="1px solid #E1E1E1">
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text
                  fontSize="sm"
                  color="orange"
                  className="specialHeadings"
                  fontWeight="bold"
                >
                  리그오브레전드
                </Text>
                <Text
                  fontSize="2xl"
                  className="specialHeadings"
                  fontWeight="bold"
                >
                  최신 뉴스 기사
                </Text>
              </Box>
              <Button
                color="gray"
                variant="undefined"
                size="xs"
                onClick={() => navigate("/gameboard/list?s=")}
              >
                더보기
              </Button>
            </Flex>
            <Stack mt={3} divider={<StackDivider />} spacing="4">
              {naver &&
                naver.items !== null &&
                naver.items.slice(0, 4).map((news) => (
                  <Box mt={1} key={news.link}>
                    <Heading
                      size="xs"
                      textTransform="uppercase"
                      _hover={{ cursor: "pointer" }}
                      onClick={() => window.open(news.link, "_blank")}
                    >
                      {news.title
                        .replace(/&quot;/g, "") // &quot; 제거
                        .replace(/<b>/g, "") // <b> 제거
                        .replace(/<\/b>/g, "")}
                    </Heading>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </SimpleGrid>

      {/* ------------------------ 카테고리 ------------------------ */}
      <Box
        w={{ base: "80%", md: "90%" }}
        mt={-10}
        mx="auto"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Text
          fontWeight="bold"
          className="specialHeadings"
          fontSize="2xl"
          my={5}
        >
          상품 카테고리
        </Text>
        <SimpleGrid
          columns={{ base: 3, md: 9 }}
          spacing={5}
          mx="auto"
          w="100%"
          maxW="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          {categories.map((category, index) => (
            <Box
              _hover={{
                cursor: "pointer",
                transform: "scale(1.1)",
              }}
              transition="0.3s ease-in-out"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              key={category.category_id}
              onClick={() => navigate(`/category/${category.category_id}`)}
            >
              <Img
                mx="auto"
                h={{ base: "70%", md: "80%" }}
                src={categoryMenuIcon[category.category_id - 1]}
                alt={category.category_name}
              />
              <Text className="specialHeadings">{category.category_name}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* ------------------------- 임시 카테고리별 상품목록 및 텍스트/이미지 ------------------------- */}
      {categories.map((category) => (
        <Box key={category.category_id} w="90%" mx="auto">
          <Text
            className="specialHeadings"
            fontSize="2xl"
            fontWeight="bold"
            textAlign="left"
            mb={5}
          >
            {category.category_name}
          </Text>
          <Flex flexDir={{ base: "column", md: "row" }}>
            <Box
              position="relative"
              w={{ base: "100%", md: "40%" }}
              display={{ base: "none", md: "block" }}
              borderRadius={15}
              mr={5}
              shadow="md"
            >
              <Image
                src={categoryImages[category.category_id]}
                objectFit="contain"
                w="full"
                display="block"
                borderRadius={15}
              />
              <Box
                position="absolute"
                w="full"
                h="30%"
                bottom={0}
                left={0}
                pt="20%"
                px={5}
                className="opacityGradient"
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="black"
                  className="specialHeadings"
                >
                  {categoryDescriptions[category.category_id][0]}
                </Text>
                <Text fontSize="md" color="black" className="labels">
                  {categoryDescriptions[category.category_id][1]}
                </Text>
              </Box>
            </Box>
            <SimpleGrid
              columns={{ base: 3, md: 4 }}
              spacing={5}
              w={{ base: "100%", md: "80%" }}
            >
              {categoryProducts[category.category_id]
                ?.slice(0, 8)
                .map((product) => (
                  <Box
                    key={product.product_id}
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                    onClick={() => navigate(`/product/${product.product_id}`)}
                  >
                    <Flex alignItems="center" justify="center">
                      <Image
                        src={
                          product.mainImgs[0]?.main_img_uri ||
                          "default-product-image.jpg"
                        }
                        alt={product.product_name}
                        maxH="200px"
                        objectFit="contain"
                      />
                    </Flex>
                    <Box p="3">
                      <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                      >
                        [{product.company_name}]
                      </Box>
                      <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                      >
                        {product.product_name}
                      </Box>
                      <Box>
                        {product.product_price.toLocaleString("ko-KR")}원
                        <Box as="span" color="gray.600" fontSize="sm"></Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </SimpleGrid>
          </Flex>
        </Box>
      ))}
      <SearchComponent />
    </Box>
  );
}
