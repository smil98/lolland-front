import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Select,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faChevronRight,
  faHouse,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import SwiperMainList from "./SwiperMainList";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function CategoryPagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  if (!pageInfo) {
    // pageInfo가 null이면 빈 배열을 반환하여 렌더링하지 않음
    return null;
  }

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mb={10} mt={10} display={"flex"} justifyContent={"center"}>
      {pageInfo.prevPageNumber && (
        <PageButton variant={"ghost"} pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PageButton>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <PageButton variant={"ghost"} pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faAngleRight} />
        </PageButton>
      )}
    </Box>
  );
}

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

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <InputGroup display="flex" w={{ base: "80%", md: "50%" }} mt={10}>
      <InputLeftElement w="25%">
        <Select
          borderRadius={0}
          defaultValue="all"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="product_name">상품명</option>
          <option value="company_name">회사명</option>
        </Select>
      </InputLeftElement>
      <Input
        textIndent="25%"
        borderRadius={0}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <InputRightElement>
        <IconButton
          onClick={handleSearch}
          bgColor="black"
          color="white"
          borderRadius={0}
          icon={<FontAwesomeIcon icon={faSearch} />}
        />
      </InputRightElement>
    </InputGroup>
  );
}

export function ProductMainList() {
  const { category_id } = useParams();
  const toast = useToast();
  const [category, setCategory] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/category/${category_id}?` + params)
      .then((response) => {
        setProductList(response.data.products);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        toast({
          title: "카테고리 대분류 별 상품 로딩 중 에러",
          description: error.description,
          status: "error",
        });
      });
  }, [category_id, location]);

  useEffect(() => {
    axios
      .get(`/api/product/category/detail/${category_id}`)
      .then((response) => {
        const { category, subcategories } = response.data;
        setCategory(category);
        setCategoryList(subcategories);
      })
      .catch((error) => {});
  }, [category_id]);

  if (productList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // 전체 너비는 mx 퍼센테이지 증감으로 조절
  return (
    <>
      <Flex flexDir="column" mx={{ base: 5, md: "5%", lg: "15%" }} mt="4%">
        <Breadcrumb
          spacing={3}
          separator={<FontAwesomeIcon icon={faChevronRight} />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/")}>
              <Text
                fontSize="2xl"
                className="specialHeadings"
                fontWeight="bold"
              >
                전체보기
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate(`/category/${category_id}`)}
            >
              <Text
                fontSize="2xl"
                className="specialHeadings"
                fontWeight="bold"
              >
                {category && category.category_name
                  ? category.category_name
                  : ""}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Divider borderWidth="1px" my={5} />
        <SimpleGrid
          columns={{ base: 3, md: 4, lg: 5 }}
          spacing={{ base: 2, md: 5 }}
        >
          {categoryList.map((subcategory) => (
            <Tag
              size={{ base: "md", md: "lg" }}
              py={2}
              px={{ sm: 2, md: 4 }}
              _hover={{
                cursor: "pointer",
                bgColor: "black",
                color: "white",
                transition: "0.4s all ease",
              }}
              borderRadius="full"
              bgColor="white"
              justifyContent="center"
              border="1px solid #E8E8E8"
              key={subcategory.subcategory_id}
              onClick={() => {
                navigate(
                  `/category/${category_id}/${subcategory.subcategory_id}`,
                );
              }}
            >
              {subcategory.subcategory_name}
            </Tag>
          ))}
        </SimpleGrid>
      </Flex>
      <Flex
        mx={{ base: 5, md: "5%", lg: "15%" }}
        my="1%"
        flexDir="column"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          my={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          overflow={"hidden"}
          w="full"
          h="300px"
        >
          <SwiperMainList />
        </Box>
        <SimpleGrid
          h={"100%"}
          w={"100%"}
          columns={{ base: 2, md: 4 }}
          spacing={{ base: 4, md: 9 }}
        >
          {productList.map((product, index) => (
            <Box
              key={index}
              onMouseEnter={() => {
                if (product.mainImgs && product.mainImgs.length > 1) {
                  setHoveredBoardId(product.product_id);
                }
              }}
              onMouseLeave={() => setHoveredBoardId(null)}
              borderRadius={0}
              _hover={{
                cursor: "pointer",
              }}
              overflow="hidden"
              onClick={() => navigate("/product/" + product.product_id)}
              border={"1px solid #E8E8E8"}
              alignItems={"center"}
              h={"100%"}
            >
              <Box
                position="relative" // 상대 위치 설정
                p={5}
                height="180px"
                width="100%"
                bg="white"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {/* 마우스 호버 시 2번째 이미지로 변경 */}
                {/* 기본 이미지 */}
                <Image
                  position="absolute"
                  src={product.mainImgs[0]?.main_img_uri}
                  alt="Board Image"
                  width="85%"
                  height="85%"
                  zIndex={1}
                  transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                  opacity={product.id === hoveredBoardId ? 0 : 1} // 호버 상태에 따른 투명도
                />
                {/* 호버 시 이미지 */}
                <Image
                  position="absolute"
                  src={product.mainImgs[1]?.main_img_uri}
                  alt="Hover Image"
                  width="85%"
                  height="85%"
                  zIndex={2}
                  transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                  opacity={product.product_id === hoveredBoardId ? 1 : 0} // 호버 상태에 따른 투명도
                />
              </Box>

              <Flex direction="column" p={4} justifyContent={"center"}>
                <Text>
                  [{product.company_name}] {product.product_name}
                </Text>
                <Text mt={2} fontWeight={"bold"} fontSize={"1.2rem"}>
                  {formatPrice(product.product_price)}원
                </Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>

      <Center>
        <VStack w="full">
          <SearchComponent />
          <CategoryPagination pageInfo={pageInfo} />
        </VStack>
      </Center>
    </>
  );
}
