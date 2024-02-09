import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  faAngleLeft,
  faAngleRight,
  faChevronRight,
  faMinus,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

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

function SubCategoryPagination({ pageInfo }) {
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
          w={"140px"}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value={"product_name"}>상품명</option>
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

export function ProductSubList() {
  const { category_id, subcategory_id } = useParams();
  const toast = useToast();
  const [productList, setProductList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/category/${category_id}/${subcategory_id}?` + params)
      .then((response) => {
        setProductList(response.data.products); // response.data.products
        setPageInfo(response.data.pageInfo);
        console.log(response.data.pageInfo);
      })
      .catch((error) => {
        toast({
          title: "카테고리 소분류 별 상품 로딩 중 에러",
          description: error.description,
          status: "error",
        });
      });
  }, [category_id, subcategory_id, location]);

  useEffect(() => {
    axios
      .get(`/api/product/subcategory/detail/${category_id}/${subcategory_id}`)
      .then((response) => {
        const { categories, companies, category_name, subcategory_name } =
          response.data;
        setCategoryList(categories);
        setCompanyList(companies);
        setCategoryName(category_name);
        setSubcategoryName(subcategory_name);
      });
  }, []);

  if (productList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Flex my="3%" mx={{ base: 5, md: "5%", lg: "10%" }} flexDir="column">
      <Breadcrumb
        w="full"
        py={3}
        spacing={3}
        separator={<FontAwesomeIcon icon={faChevronRight} />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate(`/category/${category_id}`)}>
            <Text fontSize="2xl" className="specialHeadings" fontWeight="bold">
              {categoryName ? categoryName : ""}
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() =>
              navigate(`/category/${category_id}/${subcategory_id}`)
            }
          >
            <Text fontSize="2xl" className="specialHeadings" fontWeight="bold">
              {subcategoryName ? subcategoryName : ""}
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider borderWidth="1px" borderColor="black" mb={5} />
      <Flex justifyContent="space-between" gap={1}>
        <Accordion
          id="myAccordian"
          allowMultiple
          w={{ base: "30%", md: "25%", lg: "20%" }}
          defaultIndex={[0, 1]}
        >
          <AccordionItem className="accordianItem">
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    카테고리
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                  <List spacing={3}>
                    {categoryList.map((category) => (
                      <ListItem
                        _hover={{ cursor: "pointer" }}
                        key={category.category_id}
                        onClick={() =>
                          navigate(`/category/${category.category_id}`)
                        }
                        opacity={category.category_id == category_id ? 1 : 0.5} //TODO: 왜 toString 아닐 때 적용 안 되는지 물어보기 (=== 세개는 타입까지 비교함, ==는 타입 비교 안함)
                        fontWeight={
                          category.category_id == category_id
                            ? "bold"
                            : "normal"
                        }
                      >
                        {category.category_name}
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
          <AccordionItem className="accordianItem">
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    브랜드
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                  <List spacing={3}>
                    {companyList.map((company) => (
                      <ListItem
                        key={company.company_id}
                        _hover={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/company/${company.company_id}`)
                        }
                      >
                        {company.company_name}
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
        <SimpleGrid
          h={"100%"}
          w={{ base: "70%", md: "75%", lg: "80%" }}
          columns={{ base: 2, md: 3, lg: 4 }}
          spacing={{ base: 3, md: 4, lg: 5 }}
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
                height={{ base: "150px", md: "180px" }}
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
          <SubCategoryPagination pageInfo={pageInfo} />
        </VStack>
      </Center>
    </Flex>
  );
}
