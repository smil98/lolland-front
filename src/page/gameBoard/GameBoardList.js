import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  faArrowTrendUp,
  faCaretDown,
  faChessRook,
  faEye,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";
import { ChatIcon } from "@chakra-ui/icons";
import { GameBoardPagination } from "./GameBoardPagination";
import { SearchComponent } from "./SearchComponent";
import { GameBoardListArticle } from "./GameBoardListArticle";
import { GameBoardListYouTube } from "./GameBoardListYouTube";
import { GameBoardListTop6 } from "./GameBoardListTop6";

function GameBoardList() {
  const [gameBoardList, setGameBoardList] = useState(null);
  const [notice, setNotice] = useState(null);
  const [today, setToday] = useState(null);

  const [params] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();

  useEffect(() => {
    // params.set("s", sortBy);

    axios.get("/api/gameboard/list?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location, isAuthenticated, sortBy]);

  useEffect(() => {
    params.set("s", sortBy);
    navigate("/gameboard/list?" + params);
  }, [sortBy]);

  // today, notice
  useEffect(() => {
    axios
      .get("/api/gameboard/list/today")
      .then((response) => setToday(response.data));

    axios
      .get("/api/gameboard/list/notice")
      .then((response) => setNotice(response.data));
  }, []);

  // 각 카테고리에 대한 색상 매핑
  const categoryColors = {
    "리그 오브 레전드": "green",
    "로스트 아크": "blue",
    "콘솔 게임": "purple",
    "모바일 게임": "orange",
    자유: "gray",
  };

  if (gameBoardList === null || pageInfo === null) {
    return <Spinner />;
  }

  const sectionStyle = {
    borderRadius: 0,
    fontSize: "sm",
    _hover: {
      cursor: "pointer",
    },
  };

  return (
    <Box mx="auto" w="full">
      <Box
        w={{ base: "90%", md: "95%" }}
        mt={{ base: 0, md: 5 }}
        mx="auto"
        borderTop="1px solid black"
        borderBottom="1px solid black"
      >
        <Text
          className="specialHeadings"
          fontSize="3xl"
          color="black"
          my={3}
          pl={{ base: 0, md: 5 }}
          textAlign={{ base: "center", md: "left" }}
          fontWeight="bold"
        >
          <Text as="span" mr={5}>
            <FontAwesomeIcon icon={faChessRook} />
          </Text>
          게임 커뮤니티
        </Text>
      </Box>
      <Flex flexDir={{ base: "column", md: "row" }} w="full">
        {/* ------------ 사이드: 오늘의 BEST 게시물, 실시간 인기 게임 영상, 최신 기사 ------------ */}
        <Box w={{ base: "90%", md: "33%" }} ml={{ base: "5%", md: 5 }}>
          {/* ---------- 오늘의 BEST 게시물 ---------- */}
          <Card border="1px solid #F1F1F1" shadow="base" my={5}>
            <CardHeader
              className="specialHeadings"
              fontWeight="bold"
              color="orange"
              fontSize="2xl"
              textAlign="center"
            >
              오늘의 BEST 게시물
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {today &&
                  today.map((todayPost, index) => (
                    <Box key={todayPost.id}>
                      <Flex align={"center"}>
                        <Badge
                          variant={"subtle"}
                          colorScheme={"green"}
                          mr={"2"}
                        >
                          {" "}
                          {index + 1} 위{" "}
                        </Badge>
                        <Heading
                          size="xs"
                          textTransform="uppercase"
                          _hover={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate("/gameboard/id/" + todayPost.id)
                          }
                        >
                          {todayPost.title}
                        </Heading>
                      </Flex>
                    </Box>
                  ))}
              </Stack>
            </CardBody>
          </Card>
          {/* -------- 실시간 인기 게임 영상  -------- */}
          <GameBoardListYouTube />
          {/*TODO : 할당량 초과시 주석 처리*/}
          {/* -------- 최신 기사 -------- */}
          <GameBoardListArticle />
        </Box>
        {/* ------------ 메인 ------------ */}
        <Stack dir="column" w={{ base: "100%", md: "65%" }}>
          {/* ------------ 핫한 게시물 ------------ */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={5}
          >
            <Text
              as="span"
              mr={5}
              py={2}
              px={3}
              fontSize="md"
              bgColor="orange"
              color="white"
              borderRadius={5}
            >
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </Text>
            <Text
              as="span"
              fontSize="3xl"
              className="specialHeadings"
              fontWeight="bold"
              color="orange"
            >
              핫한 게시물
            </Text>
          </Box>

          {/* ------------ TOP6 삽입 부분 ------------ */}
          <GameBoardListTop6 />

          {/* ------------ 일반 게시물 ------------ */}
          <Text
            as="span"
            fontSize="3xl"
            textAlign="center"
            className="specialHeadings"
            fontWeight="bold"
            color="orange"
          >
            일반 게시물
          </Text>

          <Box w="90%" mx="auto">
            <SimpleGrid columns={{ base: 4, md: 8 }} spacing={3}>
              <Stack spacing={3}>
                <Select
                  variant="undefined"
                  placeholder="정렬"
                  textAlign="center"
                  fontSize="sm"
                  fontWeight="bold"
                  onChange={(e) => {
                    const selectedValue = e.target.value;

                    // 정렬 기준에 따라 상태 업데이트
                    if (selectedValue === "조회수") {
                      setSortBy((prevSortBy) =>
                        prevSortBy === "board_count" ? "" : "board_count",
                      );
                    } else if (selectedValue === "추천") {
                      setSortBy((prevSortBy) =>
                        prevSortBy === "count_like" ? "" : "count_like",
                      );
                    } else if (selectedValue === "날짜") {
                      setSortBy("");
                      params.set("s", sortBy);
                      navigate("/gameboard/list?" + params);
                    }
                  }}
                >
                  <option value="조회수">조회수</option>
                  <option value="추천">추천</option>
                  <option value="날짜">날짜</option>
                  {/* 다른 정렬 기준이 추가될 경우 option 추가 */}
                </Select>
              </Stack>
              <Button
                variant="undefined"
                onClick={() => navigate("")}
                {...sectionStyle}
              >
                전체
              </Button>
              <Button
                variant="undefined"
                onClick={() => navigate("?k=리그 오브 레전드")}
                {...sectionStyle}
              >
                리그 오브 레전드
              </Button>
              <Button
                variant="undefined"
                onClick={() => navigate("?k=로스트 아크")}
                {...sectionStyle}
              >
                로스트 아크
              </Button>
              <Button
                variant="undefined"
                onClick={() => navigate("?k=콘솔 게임")}
                {...sectionStyle}
              >
                콘솔 게임
              </Button>
              <Button
                variant="undefined"
                onClick={() => navigate("?k=모바일 게임")}
                {...sectionStyle}
              >
                모바일 게임
              </Button>
              <Button
                variant="undefined"
                onClick={() => navigate("?k=자유")}
                {...sectionStyle}
              >
                자유
              </Button>
              <Button
                variant="undefined"
                {...sectionStyle}
                onClick={() => {
                  if (isAuthenticated()) {
                    // 괄호 추가
                    navigate("write");
                  } else {
                    toast({ description: "로그인 후 글 작성" });
                  }
                }}
              >
                글 작성
              </Button>
            </SimpleGrid>
          </Box>

          <Box w="90%" mx="auto">
            <Stack
              w="full"
              pl={3}
              divider={<StackDivider />}
              display={{ base: "block", md: "none" }}
            >
              {gameBoardList &&
                gameBoardList.map((board) => (
                  <Box
                    py={5}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + board.id)}
                  >
                    <Flex mb={2} alignItems="center">
                      <Badge colorScheme={categoryColors[board.category]}>
                        {board.category}
                      </Badge>
                      <Text color="grey" mx={2}>
                        {new Date(board.reg_time).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                      <Text color="grey">
                        <FontAwesomeIcon icon={faEye} />{" "}
                        {Math.ceil(board.board_count)}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text
                        fontSize="md"
                        className="labels"
                        alignItems="center"
                      >
                        {board.title}
                        {board.countFile !== 0 && (
                          <Text as="span" color="grey" ml={2}>
                            <FontAwesomeIcon icon={faImage} />
                          </Text>
                        )}
                      </Text>
                      {board.count_comment !== 0 && (
                        <Text as="span" color="orange" fontWeight="bold" mr={5}>
                          <ChatIcon /> {board.count_comment}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                ))}
            </Stack>
          </Box>
          <TableContainer
            w="90%"
            mx="auto"
            shadow="1px 1px 3px 1px #dadce0"
            display={{ base: "none", md: "block" }}
          >
            <Table size="sm" border={"1px solid whitesmoke"}>
              <Thead>
                <Tr>
                  <Th
                    w="5%"
                    textAlign={"center"}
                    cursor={"pointer"}
                    onClick={() => {
                      setSortBy((prevSortBy) =>
                        prevSortBy === "count_like" ? "" : "count_like",
                      );
                    }}
                  >
                    추천 <FontAwesomeIcon icon={faCaretDown} />
                  </Th>
                  <Th w="5%" textAlign="center">
                    분류
                  </Th>
                  <Th w="40%" colSpan={2} textAlign={"center"}>
                    제목
                  </Th>
                  <Th
                    w="10%"
                    cursor="pointer"
                    textAlign="center"
                    onClick={() => {
                      setSortBy((prevSortBy) =>
                        prevSortBy === "board_count" ? "" : "board_count",
                      );
                    }}
                  >
                    조회수 <FontAwesomeIcon icon={faCaretDown} />
                  </Th>
                  <Th
                    w="10%"
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => {
                      setSortBy("");
                      params.set("s", sortBy);
                      navigate("/gameboard/list?" + params);
                    }}
                  >
                    날짜 <FontAwesomeIcon icon={faCaretDown} />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {notice &&
                  notice.map((noticies) => (
                    <Tr
                      key={noticies.id}
                      borderRadius="10px"
                      bgColor={"whitesmoke"}
                    >
                      <Td w="10%" textAlign={"center"}>
                        <Badge
                          colorScheme="green"
                          variant="outline"
                          mx={"2px"}
                          fontWeight={"bold"}
                          bgColor={`rgba(0, 128, 0, ${
                            noticies.count_like / 10
                          })`}
                        >
                          {noticies.count_like}
                        </Badge>
                      </Td>
                      <Td w="5%" textAlign="center">
                        <Badge colorScheme={categoryColors[noticies.category]}>
                          {noticies.category}
                        </Badge>
                      </Td>
                      <Td
                        w="40%"
                        colSpan={2}
                        textAlign={"center"}
                        onClick={() => navigate("/gameboard/id/" + noticies.id)}
                        _hover={{ cursor: "pointer" }}
                      >
                        {noticies.title}
                        {noticies.count_comment !== 0 && (
                          <Badge
                            colorScheme="orange"
                            variant="outline"
                            mx={"1%"}
                          >
                            <ChatIcon /> {noticies.count_comment}
                          </Badge>
                        )}
                        {noticies.countFile !== 0 && (
                          <Badge mx={"1%"}>
                            {noticies.countFile}{" "}
                            <FontAwesomeIcon icon={faImage} />
                          </Badge>
                        )}{" "}
                      </Td>
                      <Td w="10%" textAlign="center">
                        {Math.ceil(noticies.board_count)}
                      </Td>
                      <Td w="10%">
                        {new Date(noticies.reg_time).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          },
                        )}
                      </Td>
                    </Tr>
                  ))}

                {gameBoardList &&
                  gameBoardList.map((board) => (
                    <Tr key={board.id} borderRadius="10px">
                      <Td w="10%" textAlign="center" alignItems="center">
                        <Badge
                          colorScheme="green"
                          variant="outline"
                          mx="2px"
                          fontWeight="bold"
                          bgColor={`rgba(0, 128, 0, ${board.count_like / 10})`}
                        >
                          {board.count_like}
                        </Badge>
                      </Td>

                      <Td w="5%" textAlign="center">
                        <Badge colorScheme={categoryColors[board.category]}>
                          {board.category}
                        </Badge>
                      </Td>
                      <Td
                        w="40%"
                        colSpan={2}
                        textAlign="center"
                        alignItems="center"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => navigate("/gameboard/id/" + board.id)}
                      >
                        {board.title}
                        {board.count_comment !== 0 && (
                          <Badge colorScheme="orange" variant="outline" ml={1}>
                            <ChatIcon /> {board.count_comment}
                          </Badge>
                        )}{" "}
                        {board.countFile !== 0 && (
                          <Badge>
                            <FontAwesomeIcon icon={faImage} /> {board.countFile}
                          </Badge>
                        )}
                      </Td>
                      <Td w="10%" textAlign="center">
                        {Math.ceil(board.board_count)}
                      </Td>
                      <Td w="10%">
                        {new Date(board.reg_time).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit", // Use 2-digit to get leading zeros
                          day: "2-digit", // Use 2-digit to get leading zeros
                        })}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>

          <VStack>
            <SearchComponent />
            <GameBoardPagination pageInfo={pageInfo} />
          </VStack>
        </Stack>
      </Flex>
    </Box>
  );
}

export default GameBoardList;
