import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  HStack,
  Spinner,
  Image,
  useToast,
  Text,
  Flex,
  Badge,
  AccordionPanel,
  AccordionIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  TabPanel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Table,
  Tr,
  TableCaption,
  Tbody,
  IconButton,
  ButtonGroup,
  Tag,
  TagLeftIcon,
  TagLabel,
  Avatar,
} from "@chakra-ui/react";
import GameBoardCommentContainer from "./GameBoardCommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faClock,
  faComments,
  faEnvelope,
  faEye,
  faPenNib,
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { useNavigate, useParams } from "react-router-dom";

async function fetchBoardData(
  id,
  setBoard,
  setLike,
  setWritten,
  setWriterInfo,
  setWrittenComment,
) {
  try {
    const boardResponse = await axios.get(`/api/gameboard/id/${id}`);
    setBoard(boardResponse.data);

    const likeResponse = await axios.get(`/api/like/gameboard/${id}`);
    setLike(likeResponse.data);

    if (boardResponse.data !== null) {
      const writtenResponse = await axios.get(
        `/api/gameboard/list/written/post/${boardResponse.data.member_id}`,
      );
      setWritten(writtenResponse.data);

      const writerInfoResponse = await axios.get(
        `/api/gameboard/list/info/${boardResponse.data.member_id}`,
      );
      setWriterInfo(writerInfoResponse.data);

      const writtenCommentResponse = await axios.get(
        `/api/comment/list/written/comment/${boardResponse.data.member_id}`,
      );
      setWrittenComment(writtenCommentResponse.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }

  return (
    <HStack spacing={2} align="center">
      <Button
        variant={like.like ? "outline" : "solid"}
        colorScheme={like.like ? "blackAlpha" : "orange"}
        size="sm"
        onClick={onClick}
        isDisabled={!isAuthenticated()}
        leftIcon={
          like.like ? (
            <FontAwesomeIcon icon={faThumbsDown} />
          ) : (
            <FontAwesomeIcon icon={faThumbsUp} />
          )
        }
      >
        {like.like ? "비추천" : "추천"} {like.countLike}
      </Button>
    </HStack>
  );
}

export function GameBoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);
  const [written, setWritten] = useState(null);
  const [writerInfo, setWriterInfo] = useState(null);
  const [writtenComment, setWrittenComment] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBoardData(
        id,
        setBoard,
        setLike,
        setWritten,
        setWriterInfo,
        setWrittenComment,
      );
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/gameboard/remove/${id}`);
      toast({
        description: `${id}번 게시물 삭제 완료`,
        status: "success",
      });
      navigate(-1);
    } catch (error) {
      toast({
        description: "실패",
        status: "error",
      });
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post("/api/like", {
        game_board_id: board.id,
      });
      setLike(response.data);
    } catch (error) {
      toast({
        description: "로그인 후 이용 해주세요.",
        status: "error",
      });
    } finally {
      console.log("done");
    }
  };

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box mx="auto" w={{ base: "90%", md: "80%", lg: "70%", xl: "50%" }}>
      <HStack w="100%" justify="space-between">
        <IconButton
          variant="ghost"
          colorScheme="twitter"
          size="lg"
          onClick={() => navigate(-1)}
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
        />
        {(hasAccess(board.member_id) || isAdmin()) && (
          <ButtonGroup variant="ghost">
            <IconButton
              colorScheme="orange"
              size="lg"
              icon={<FontAwesomeIcon icon={faPenNib} />}
              onClick={() => navigate(`/gameboard/edit/${id}`)}
            />
            <IconButton
              colorScheme="blackAlpha"
              size="lg"
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={handleDelete}
            />
          </ButtonGroup>
        )}
      </HStack>
      <Text
        className="specialHeadings"
        fontSize="2xl"
        textAlign="left"
        w="full"
        mt={3}
      >
        {board.title}
      </Text>
      <Tag variant="undefined" size="md" color="gray">
        <TagLeftIcon as={FontAwesomeIcon} icon={faClock} />
        <TagLabel>
          {new Date(board.reg_time).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}{" "}
          {new Date(board.reg_time)
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
            .replace(/\s/g, " ")}
        </TagLabel>
      </Tag>
      <Flex
        w="100%"
        justify="space-between"
        borderTop="1px solid #E1E1E1"
        borderBottom="1px solid #E1E1E1"
        alignItems="center"
        py={3}
        my={3}
      >
        <Box spacing={3} alignItems="center">
          <Tag variant="undefined" size="md">
            <TagLeftIcon as={FontAwesomeIcon} icon={faUser} />
            <TagLabel>{board.member_id}</TagLabel>
          </Tag>
          <Tag variant="undefined" size="md">
            <TagLeftIcon as={FontAwesomeIcon} icon={faComments} />
            <TagLabel>{board.count_comment}</TagLabel>
          </Tag>
          <Tag variant="undefined" size="md">
            <TagLeftIcon as={FontAwesomeIcon} icon={faEye} />
            <TagLabel>{board.board_count}</TagLabel>
          </Tag>
        </Box>
        <LikeContainer like={like} onClick={handleLike} />
      </Flex>
      <Box my={10}>
        <Text fontSize="lg">{board.board_content}</Text>
        {board.files.map((file) => (
          <Image
            key={file.id}
            src={file.file_url}
            alt={file.file_name}
            borderRadius="md"
            boxSize="100%"
            my={4}
          />
        ))}
      </Box>
      <Accordion allowMultiple w="100%" as="span" isLazy defaultIndex={[0]}>
        <AccordionItem>
          <Flex>
            <AccordionButton _expanded={{ bg: "whitesmoke", color: "black" }}>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                width="100%"
                paddingX={2}
                paddingY={2}
                fontSize="md"
                fontWeight="bold"
              >
                {board.member_id} 의 정보
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Flex>
          <AccordionPanel py={4}>
            {writerInfo && (
              <Flex
                borderRadius={10}
                border="1px solid #E1E1E1"
                p={3}
                _hover={{ bgColor: "gray.100" }}
              >
                <Avatar src={writerInfo.file_url} />
                <Box ml={3}>
                  <Text fontWeight="bold">
                    {writerInfo.member_name}
                    <Tag ml={3} colorScheme="orange" size="sm">
                      <TagLeftIcon as={FontAwesomeIcon} icon={faEnvelope} />
                      <TagLabel>{writerInfo.member_email}</TagLabel>
                    </Tag>
                  </Text>
                  <Text>{writerInfo.member_introduce}</Text>
                </Box>
              </Flex>
            )}
            <Tabs isFitted variant="enclosed" mt={"30px"}>
              <TabList mb="1em">
                <Tab fontSize="xl">최근 글</Tab>
                <Tab fontSize="lg">최근 댓글</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {written && (
                    <Table variant="simple">
                      <Tbody>
                        {written.map((posties) => (
                          <Tr
                            fontSize={"1.1rem"}
                            key={posties.id}
                            onClick={() => {
                              navigate(`/gameboard/id/${posties.id}`);
                              window.scrollTo(0, 0);
                            }}
                            _hover={{ cursor: "pointer" }}
                          >
                            <Box
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                              boxShadow="sm"
                              onClick={() => {
                                navigate(`/gameboard/id/${posties.id}`);
                                window.scrollTo(0, 0);
                              }}
                              _hover={{ cursor: "pointer", bg: "gray.100" }}
                            >
                              {posties.title}
                            </Box>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </TabPanel>
                <TabPanel>
                  {writtenComment && (
                    <Table variant="simple">
                      <Tbody>
                        {writtenComment.map((comment) => (
                          <Tr
                            fontSize={"1.1rem"}
                            key={comment.id}
                            onClick={() => {
                              navigate(
                                `/gameboard/id/${comment.game_board_id}`,
                              );
                              window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                              });
                            }}
                            _hover={{ cursor: "pointer" }}
                          >
                            <Box
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                              boxShadow="sm"
                              onClick={() => {
                                navigate(
                                  `/gameboard/id/${comment.game_board_id}`,
                                );
                                window.scrollTo({
                                  top: document.body.scrollHeight,
                                  behavior: "smooth",
                                });
                              }}
                              _hover={{ cursor: "pointer", bg: "gray.100" }}
                            >
                              {comment.comment_content}
                            </Box>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <GameBoardCommentContainer />
    </Box>
  );
}

export default GameBoardView;
