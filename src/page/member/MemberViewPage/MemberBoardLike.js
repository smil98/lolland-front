import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  HStack,
  IconButton,
  Select,
  StackDivider,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBan,
  faCaretLeft,
  faCaretRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ScreenContext } from "../../../component/ScreenContext";

// 회원 게임 게시물 좋아요의 페이지 버튼
function MemberBoardLikePageButton({
  pageBg,
  pageColor,
  pageHove,
  pageNumber,
  children,
}) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClickButton() {
    params.set("page", pageNumber);
    navigate("?" + params);
  }

  return (
    <Button
      ml={2}
      bg={pageBg}
      color={pageColor}
      _hover={pageHove}
      onClick={handleClickButton}
    >
      {children}
    </Button>
  );
}

function MemberBoardLikePagination({ pageInfo }) {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const listPage = params.get("page");

  const pageNumbers = [];
  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prvePageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          onClick={() => navigate("?page=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </Button>
      )}

      {pageNumbers.map((pageNumber) => (
        <MemberBoardLikePageButton
          pageBg={listPage === pageNumber.toString() ? "black" : "white"}
          pageColor={listPage === pageNumber.toString() ? "white" : "black"}
          pageHove={{ backgroundColor: "black", color: "whitesmoke" }}
          ml={2}
          key={pageNumber}
          pageNumber={pageNumber}
        >
          {pageNumber}
        </MemberBoardLikePageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          ml={2}
          onClick={() => navigate("?page=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </Button>
      )}
    </Box>
  );
}

export function MemberBoardLike() {
  // 버튼 css
  const buttonStyle = {
    border: "1px solid black",
    borderRadius: 0,
    bgColor: "white",
    variant: "undefined",
    _hover: { bgColor: "black", color: "white" },
  };

  // 회원이 좋아요 한 게임 게시글 목록
  const [gameBoardList, setGameBoardList] = useState([]);

  // 페이지 정보
  const [pageInfo, setPageInfo] = useState("");

  // 좋아요 삭제 인식
  const [deletedLikeStatus, setDeletedLikeStatus] = useState(false);

  // 체크 박스 에서 선택한 게임 게시글
  const [checkLikeGameBoard, setCheckLikeGameBoard] = useState([]);

  // 카테고리 타입 변화 인식
  const [categoryType, setCategoryType] = useState("전체");

  const toast = useToast();

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const location = useLocation();

  const { isSmallScreen } = useContext(ScreenContext);

  useEffect(() => {
    axios.get("/api/member/getGameBoardLike?" + params).then((response) => {
      setGameBoardList(response.data.gameBoardLikeList);
      setPageInfo(response.data.pageInfo);
    });
  }, [deletedLikeStatus, location]);

  // 카테고리 타입이 변할때에 사용하는 useEffect
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("categoryType", categoryType);

    navigate("?" + params);
  }, [categoryType]);

  // 게임 좋아요 하나 삭제
  const handleLikeDeleteClick = (gameBoardId) => {
    axios
      .delete("/api/member/deleteGameBoardLike", {
        data: [gameBoardId],
      })
      .then(() => {
        setDeletedLikeStatus((prev) => !prev);
      })
      .catch(() => {
        toast({
          description: "좋아요 삭제중 문제가 발생했습니다.",
          status: "error",
        });
      });
  };

  // 좋아요 게시글의 체크
  const handleLikeRowChange = (e, gameBoardId) => {
    if (e.target.checked === true) {
      setCheckLikeGameBoard((prev) => [...prev, gameBoardId]);
    } else {
      setCheckLikeGameBoard((prev) => prev.filter((id) => id !== gameBoardId));
    }
  };

  // 전체 선택 버튼 클릭시
  const handleSelectAll = () => {
    setCheckLikeGameBoard(gameBoardList.map((gameBoard) => gameBoard.id));
  };
  // 전체 해제 버튼 클릭시
  const handleDesSelectAll = () => {
    setCheckLikeGameBoard([]);
  };

  // 선택 삭제 클릭시 선택 한것들만 지우기
  function handleSelectDeleteClick() {
    console.log(checkLikeGameBoard);
    axios
      .delete("/api/member/deleteGameBoardLike", {
        data: checkLikeGameBoard,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setDeletedLikeStatus((prev) => !prev);
      })
      .catch(() => {
        toast({
          description: "좋아요 삭제중 문제가 발생했습니다.",
          status: "error",
        });
      });
  }

  // 카테고리 변할때에 작동
  function handleCategoryChange(e) {
    setCategoryType(e.target.value);
  }

  return (
    <Card
      w="full"
      minH={{ base: "full", md: "560px" }}
      mx={{ base: 0, md: "10%", lg: "15%", xl: "10%" }}
    >
      <CardHeader
        display="flex"
        alignItems="center"
        fontWeight="bold"
        textAlign="left"
        fontSize="2xl"
        className="specialHeadings"
      >
        <Text as="span" mr={3}>
          <FontAwesomeIcon icon={faThumbsUp} color={"orange"} />
        </Text>
        추천 게시글 목록
      </CardHeader>
      <CardBody alignItems="flex-start">
        <Flex justifyContent="space-between" w="100%">
          <Select
            defaultValue={"전체"}
            w={"100px"}
            onChange={handleCategoryChange}
          >
            <option value="전체">전체</option>
            <option value="잡담">잡담</option>
            <option value="질문">질문</option>
            <option value="정보">정보</option>
            <option value="공지">공지</option>
            <option>본문</option>
          </Select>
          <ButtonGroup>
            <Button {...buttonStyle} onClick={handleSelectAll}>
              전체 선택
            </Button>
            <Button {...buttonStyle} onClick={handleDesSelectAll}>
              선택 해제
            </Button>
            <Button
              bgColor="orange"
              color="white"
              borderRadius={0}
              onClick={handleSelectDeleteClick}
            >
              선택 삭제
            </Button>
          </ButtonGroup>
        </Flex>
        {isSmallScreen ? (
          <VStack mt={10} divider={<StackDivider />}>
            {gameBoardList.map((gameBoard) => (
              <Box
                border="1px solid #E1E1E1"
                borderRadius={5}
                w="full"
                p={5}
                key={gameBoard.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
              >
                <Flex justifyContent="space-between" className="labels">
                  <HStack spacing={3}>
                    <Tag
                      variant="outline"
                      colorScheme="orange"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {gameBoard.category}
                    </Tag>
                    <Text fontWeight="bold">
                      {gameBoard.title.length > 15
                        ? gameBoard.title.slice(0, 15) + "..."
                        : gameBoard.title}
                    </Text>
                  </HStack>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      size="md"
                      colorScheme="orange"
                      isChecked={checkLikeGameBoard.includes(gameBoard.id)}
                      onChange={(e) => handleLikeRowChange(e, gameBoard.id)}
                    />
                  </Box>
                </Flex>
                <Text mt={5} textAlign="left">
                  {gameBoard.board_content.length > 30
                    ? gameBoard.board_content.slice(0, 30) + "..."
                    : gameBoard.board_content}
                </Text>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  mt={5}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => handleLikeDeleteClick(gameBoard.id)}
                  />
                </Box>
              </Box>
            ))}
          </VStack>
        ) : (
          <Table mt={10} textAlign={"center"}>
            <Thead>
              <Tr>
                <Th textAlign="center">선택</Th>
                <Th textAlign="center">카테고리</Th>
                <Th textAlign="center">제목</Th>
                <Th textAlign="center">내용</Th>
                <Th textAlign="center">삭제</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gameBoardList.map((gameBoard) => (
                <Tr key={gameBoard.id}>
                  <Td textAlign={"center"}>
                    <Checkbox
                      size="md"
                      colorScheme={"orange"}
                      isChecked={checkLikeGameBoard.includes(gameBoard.id)}
                      onChange={(e) => handleLikeRowChange(e, gameBoard.id)}
                    />
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.category}
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.title.length > 10
                      ? gameBoard.title.slice(0, 10) + "..."
                      : gameBoard.title}
                  </Td>
                  <Td
                    textAlign={"center"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate("/gameboard/id/" + gameBoard.id)}
                  >
                    {gameBoard.board_content.length > 15
                      ? gameBoard.board_content.slice(0, 15) + "..."
                      : gameBoard.board_content}
                  </Td>
                  <Td textAlign="center">
                    <IconButton
                      variant="ghost"
                      colorScheme="red"
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => handleLikeDeleteClick(gameBoard.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <MemberBoardLikePagination pageInfo={pageInfo} />
      </CardFooter>
    </Card>
  );
}
