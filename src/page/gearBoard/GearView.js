import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { GearCommentContainer } from "./GearCommentContainer";
import {
  faClock,
  faComments,
  faEnvelope,
  faEye,
  faPenNib,
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../component/LoginProvider";

function LikeContainer({ like, onClick }) {
  if (like === null) {
    return <Spinner />;
  }
  return (
    <Button
      mt={5}
      variant={like.gearLike ? "outline" : "solid"}
      colorScheme={like.gearLike ? "gray" : "orange"}
      onClick={onClick}
      leftIcon={
        like.gearLike ? (
          <FontAwesomeIcon icon={faThumbsDown} />
        ) : (
          <FontAwesomeIcon icon={faThumbsUp} />
        )
      }
    >
      {like.gearLike ? "비추천" : "추천"}
    </Button>
  );
}

export function GearView() {
  const { gear_id } = useParams();
  const [gearboard, setGearboard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [like, setLike] = useState(null);
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + gear_id)
      .then((response) => setGearboard(response.data));

    axios
      .get("/api/gearlike/board/" + gear_id)
      .then((response) => setLike(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  function handleRemove() {
    axios.delete("/api/gearboard/remove/" + gear_id).then(() => {
      toast({ description: "삭제되었습니다.", status: "success" });
      navigate("/gearlistlayout");
    });
  }

  function handleLike() {
    if (isAuthenticated()) {
      axios
        .post("/api/gearlike", { gearboardId: gearboard.gear_id })
        .then((response) => setLike(response.data))
        .catch((error) =>
          toast({
            title: "추천 도중 에러가 발생했습니다",
            description: error.response.status + ": " + error.response,
            status: "error",
          }),
        );
    } else {
      toast({
        title: "비회원은 추천을 누를 수 없습니다",
        description: "로그인 후 시도해주세요",
        status: "warning",
      });
    }
  }

  return (
    <Box>
      {/* ---------- 이미지 헤더 ---------- */}
      <Box w="full" h="350px" overflow="hidden" position="relative">
        {gearboard.files.length > 0 && (
          <Box
            w="100%"
            key={gearboard.files[0].id}
            position="absolute"
            top="25%"
            transform="translateY(-25%)"
          >
            <Image
              width="100%"
              src={gearboard.files[0].url}
              alt={gearboard.files[0].name}
              objectFit="contain"
            />
          </Box>
        )}
      </Box>
      <Box w={{ base: "90%", md: "70%" }} mx="auto" mt={5}>
        <Heading size="lg" mt={10}>
          {gearboard.gear_title}
        </Heading>
        <Tag variant="undefined" size="md" my={3}>
          <Avatar
            src={gearboard.file_url}
            size="xs"
            mr={2}
            name={gearboard.file_name}
          />
          <TagLabel>{gearboard.member_name}</TagLabel>
        </Tag>
        <Flex w="100%" justify="space-between" alignItems="center" mb={3}>
          <Box>
            <Tag variant="undefined" size="md" color="gray">
              <TagLeftIcon as={FontAwesomeIcon} icon={faClock} />
              <TagLabel>
                {new Date(gearboard.gear_inserted).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(gearboard.gear_inserted)
                  .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                  .replace(/\s/g, " ")}
              </TagLabel>
            </Tag>
            <Tag variant="undefined" size="md" color="gray">
              <TagLeftIcon as={FontAwesomeIcon} icon={faEye} />
              <TagLabel>{gearboard.gear_views}</TagLabel>
            </Tag>
            <Tag variant="undefined" size="md" color="gray">
              <TagLeftIcon as={FontAwesomeIcon} icon={faThumbsUp} />
              <TagLabel>{gearboard.countLike}</TagLabel>
            </Tag>
            <Tag variant="undefined" size="md" color="gray">
              <TagLeftIcon as={FontAwesomeIcon} icon={faComments} />
              <TagLabel>
                {gearboard.commentcount !== null ? gearboard.commentcount : 0}
              </TagLabel>
            </Tag>
          </Box>
          {(hasAccess(gearboard.member_id) || isAdmin()) && (
            <ButtonGroup variant="ghost" size="md">
              <IconButton
                colorScheme="orange"
                icon={<FontAwesomeIcon icon={faPenNib} />}
                onClick={() => navigate("/gearlist/edit/" + gear_id)}
              />
              <IconButton
                colorScheme="gray"
                icon={<FontAwesomeIcon icon={faTrashCan} />}
                onClick={handleRemove}
              />
            </ButtonGroup>
          )}
        </Flex>
        <Text whiteSpace="pre-wrap" fontSize="md" lineHeight="30px" my={10}>
          {gearboard.gear_content}
        </Text>
        {/* 이미지 출력*/}
        {gearboard.files.map((file) => (
          <Box key={file.id} my="5px">
            <Image width="100%" src={file.url} alt={file.name} />
          </Box>
        ))}
        <Center>
          <LikeContainer like={like} onClick={handleLike} />
        </Center>
        {/*  게시물 작성자  */}
        <Flex
          my={10}
          borderRadius={10}
          border="1px solid #E1E1E1"
          p={3}
          _hover={{ bgColor: "gray.100" }}
        >
          <Avatar src={gearboard.file_url} alt={gearboard.file_name} />
          <Box ml={3}>
            <Text fontWeight="bold">
              {gearboard.member_name}
              <Tag ml={3} colorScheme="orange" size="sm">
                <TagLeftIcon as={FontAwesomeIcon} icon={faEnvelope} />
                <TagLabel>{gearboard.member_email}</TagLabel>
              </Tag>
            </Text>
            <Text mt={1}>{gearboard.member_introduce}</Text>
          </Box>
        </Flex>
        <Box w="full" borderY="1px solid #E1E1E1" my={10} py={3}>
          <Text className="specialHeadings" fontWeight="bold" fontSize="xl">
            첨부파일
          </Text>
          <Flex mt={2} px={3}>
            {[...Array(Math.ceil(gearboard.files.length / 4))].map(
              (_, columnIndex) => (
                <Box key={columnIndex} flex="1">
                  <List spacing={2}>
                    {gearboard.files
                      .slice(columnIndex * 4, (columnIndex + 1) * 4)
                      .map((file) => (
                        <ListItem key={file.id}>
                          <Flex gap={2} color="gray">
                            <Image
                              width="20px"
                              height="20px"
                              src={file.url}
                              alt={file.name}
                            />
                            {file.name}
                          </Flex>
                        </ListItem>
                      ))}
                  </List>
                </Box>
              ),
            )}
          </Flex>
        </Box>
        {/* 댓글 기능 추가 */}
        <Text fontSize="xl" className="specialHeadings" fontWeight="bold">
          댓글
          <Text as="span" color="orange" fontSize="xl" ml={2}>
            {gearboard.commentcount}
          </Text>
        </Text>
        <GearCommentContainer />
      </Box>
    </Box>
  );
}
