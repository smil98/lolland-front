import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  faArrowRightFromBracket,
  faBagShopping,
  faUser,
  faUserPlus,
  faMagnifyingGlass,
  faPowerOff,
  faUsersGear,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "./LoginProvider";
import { HamburgerIcon } from "@chakra-ui/icons";

export function NavBar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(null);
  const toast = useToast();
  const { fetchLogin, isAdmin, isAuthenticated, hasAccess } =
    useContext(LoginContext);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 카테고리 불러오기
  useEffect(() => {
    axios
      .get("/api/product/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast({
          title: "카테고리 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      });
  }, []);

  // 카테고리 재배열 함수 4x4, 변경 시 chuckSize 수정
  const createSubcategoryArrays = (subCategories) => {
    const result = [];
    const chunkSize = 4;

    for (let i = 0; i < subCategories.length; i += chunkSize) {
      result.push(subCategories.slice(i, i + chunkSize));
    }

    return result;
  };

  //로그아웃
  function handleLogoutClick() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그 아웃 되었습니다.",
          status: "success",
        });
        localStorage.removeItem("orderDetail");
        localStorage.removeItem("purchaseInfo");
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그 아웃 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => fetchLogin());
  }

  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <>
      <Box>
        {/* ------------------- 상단 네브 바 ------------------- */}
        <Flex
          top={0}
          justifyContent="space-between"
          p={5}
          w="full"
          shadow="sm"
          position="fixed"
          zIndex={100}
          backgroundColor="white"
        >
          {isSmallScreen ? (
            <IconButton
              variant="undefined"
              fontSize="xl"
              mr={5}
              p={0}
              onClick={() => onOpen()}
              icon={<HamburgerIcon />}
              transition="all 1s ease"
            />
          ) : (
            <>
              <Flex>
                <ButtonGroup
                  variant="undefined"
                  size="md"
                  alignItems={"center"}
                >
                  <Button onClick={() => navigate("/")}>HOME</Button>
                  <Button onClick={() => navigate("/product/list/")}>
                    신상품
                  </Button>
                  <Button onClick={() => navigate("/productEvent")}>
                    이벤트
                  </Button>
                </ButtonGroup>
              </Flex>

              <Box
                w={"100%"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box>
                  {/* --------- 로고 --------- */}
                  <Box
                    w="100px"
                    // border="1px dashed black"
                    textAlign="center"
                    onClick={() => navigate("/")}
                    _hover={{
                      cursor: "pointer",
                    }}
                  >
                    <Image src="/logo.png" boxSize="100%" objectFit="fit" />
                  </Box>
                </Box>
              </Box>
            </>
          )}
          <ButtonGroup
            variant="undefined"
            display="flex"
            alignItems="center"
            justifyContent="center"
            size="lg"
          >
            {/*<IconButton icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />*/}
            <IconButton
              icon={<FontAwesomeIcon icon={faBagShopping} />}
              onClick={() => {
                if (isAuthenticated()) {
                  navigate("/cart");
                } else {
                  navigate("/login");
                }
              }}
            />
            {isAuthenticated() ? (
              <>
                <IconButton
                  icon={<FontAwesomeIcon icon={faUser} />}
                  onClick={() => navigate("/memberPage")}
                />
                {isAdmin() && (
                  <IconButton
                    icon={
                      <FontAwesomeIcon
                        icon={faUsersGear}
                        onClick={() => {
                          navigate("adminPage");
                        }}
                      />
                    }
                  />
                )}
                <IconButton
                  icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                  onClick={handleLogoutClick}
                />
              </>
            ) : (
              <>
                <Tooltip
                  label="로그인 해주세요!"
                  hasArrow
                  fontSize="xs"
                  bgColor="orange"
                  color="black"
                  fontWeight="bold"
                  borderRadius={10}
                  gutter={0}
                  isOpen={true}
                >
                  <IconButton
                    icon={<FontAwesomeIcon icon={faPowerOff} />}
                    onClick={() => navigate("/login")}
                  />
                </Tooltip>
                <IconButton
                  icon={<FontAwesomeIcon icon={faUserPlus} />}
                  onClick={() => navigate("/signup")}
                />
              </>
            )}
          </ButtonGroup>
        </Flex>

        {/* 화면 작을 때 나오는 Drawer */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader fontSize="3xl" className="logo">
              LOLLAND
              <DrawerCloseButton mt={1} size="lg" />
            </DrawerHeader>
            <DrawerBody>
              <Accordion
                id="myAccordian"
                w={"100%"}
                allowMultiple
                defaultIndex={[0, 1]}
              >
                <AccordionItem className="accordianItem">
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight="bold"
                      fontSize="xl"
                      className="specialHeadings"
                    >
                      <Text as="span" mr={5}>
                        <FontAwesomeIcon icon={faHouse} />
                      </Text>
                      커뮤니티
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel whiteSpace="pre-wrap" pb={4} px={7}>
                    <List spacing={3} className="labels" fontSize="md">
                      <ListItem onClick={() => navigate("/gameboard/list")}>
                        게임 커뮤니티
                      </ListItem>
                      <ListItem onClick={() => navigate("/gearlistlayout")}>
                        게임 장비 커뮤니티
                      </ListItem>
                    </List>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem className="accordianItem">
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight="bold"
                      fontSize="xl"
                      className="specialHeadings"
                    >
                      <Text as="span" mr={5}>
                        <FontAwesomeIcon icon={faBagShopping} />
                      </Text>
                      쇼핑
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <Accordion w="100%" allowMultiple id="myAccordian">
                          <AccordionItem
                            key={category.category_id}
                            className="accordianItem"
                          >
                            <AccordionButton>
                              <Box
                                as="span"
                                flex="1"
                                textAlign="left"
                                className="labels"
                              >
                                {category.category_name}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                              <List spacing={3} className="labels">
                                <ListItem
                                  onClick={() =>
                                    navigate(
                                      `/category/${category.category_id}`,
                                    )
                                  }
                                >
                                  {category.category_name} 전체보기
                                </ListItem>
                                {category.subCategory &&
                                  category.subCategory.map((subCategory) => (
                                    <ListItem
                                      key={subCategory.subcategory_id}
                                      onClick={() =>
                                        navigate(
                                          `/category/${category.category_id}/${subCategory.subcategory_id}`,
                                        )
                                      }
                                    >
                                      {subCategory.subcategory_name}
                                    </ListItem>
                                  ))}
                              </List>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </DrawerBody>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* ------------------- 하단 네브바 ------------------- */}
        {isSmallScreen || (
          <Tabs
            index={index}
            variant="soft-rounded"
            colorScheme="blackAlpha"
            mt="100px"
            justifyContent={"center"}
            display={"flex"}
            alignItems={"center"}
            background={"white"}
          >
            <TabList w={"900px"} py={3}>
              <HStack spacing={2}>
                <Tab
                  onClick={() => navigate("/gameboard/list")}
                  onMouseEnter={() => {
                    setIndex(0);
                    setOverlayVisible(true);
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                    setOverlayVisible(false);
                  }}
                >
                  커뮤니티
                </Tab>
                {categories.map((category) => (
                  <Tab
                    key={category.category_id}
                    onMouseEnter={() => {
                      setIndex(category.category_id);
                      setOverlayVisible(true);
                    }}
                    onMouseLeave={() => {
                      setIndex(null);
                      setOverlayVisible(false);
                    }}
                    onClick={() =>
                      navigate(`/category/${category.category_id}`)
                    }
                  >
                    {category.category_name}
                  </Tab>
                ))}
              </HStack>
            </TabList>
            <TabPanels
              px={10}
              left={0}
              right={0}
              top="53px"
              zIndex={100}
              backgroundColor="white"
              position="absolute"
              justifyContent={"center"}
              display={"flex"}
              alignItems={"center"}
            >
              <TabPanel
                py={10}
                w={"900px"}
                fontSize="sm"
                onMouseEnter={() => {
                  setIndex(0);
                  setOverlayVisible(true);
                }}
                onMouseLeave={() => {
                  setIndex(null);
                  setOverlayVisible(false);
                }}
              >
                <VStack
                  _hover={{ cursor: "pointer" }}
                  spacing={2}
                  align="flex-start"
                >
                  <Text onClick={() => navigate("/gameboard/list")}>
                    게임 커뮤니티
                  </Text>
                  <Text onClick={() => navigate("/gearlistlayout")}>
                    게임 장비 커뮤니티
                  </Text>
                </VStack>
              </TabPanel>
              {categories.map((category) => (
                <TabPanel
                  key={category.category_id}
                  display="flex"
                  py={10}
                  w={"900px"}
                  onMouseEnter={() => {
                    setIndex(category.category_id);
                    setOverlayVisible(true);
                  }}
                  onMouseLeave={() => {
                    setIndex(null);
                    setOverlayVisible(false);
                  }}
                >
                  {createSubcategoryArrays(category.subCategory).map(
                    (subCategoryArray, arrayIndex) => (
                      <VStack
                        _hover={{
                          cursor: "pointer",
                        }}
                        key={arrayIndex}
                        align="start"
                        spacing={2}
                        w="200px"
                        mr={10}
                      >
                        {subCategoryArray.map((subCategory) => (
                          <Text
                            key={subCategory.subcategory_id}
                            fontSize="sm"
                            _hover={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(
                                `/category/${category.category_id}/${subCategory.subcategory_id}`,
                              )
                            }
                          >
                            {subCategory.subcategory_name}
                          </Text>
                        ))}
                      </VStack>
                    ),
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </Box>
      {overlayVisible && (
        <Box
          w="full"
          h="100vh"
          bgColor="#000000"
          opacity={0.2}
          position="fixed"
          zIndex={99}
        />
      )}
    </>
  );
}
