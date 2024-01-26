import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import LoginProvider, { LoginContext } from "../../component/LoginProvider";

function CommentForm({ isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useContext(LoginContext);

  function handleSubmit() {
    if (!comment.trim()) {
      // If the comment is empty or contains only whitespace, don't submit
      return;
    }
    onSubmit({ comment });
    setComment(""); // Clear the input field after submission
  }

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        width="100%"
        padding={2}
        borderRadius="md"
        boxShadow="md"
        height="auto" // 자동으로 높이 조절
      />
      <Tooltip isDisabled={!isAuthenticated()} hasArrow label="로그인 하세요">
        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          marginLeft={2}
          paddingX={4}
          height="80px" // 자동으로 높이 조절
          width={"80px"}
        >
          쓰기
        </Button>
      </Tooltip>
    </Box>
  );
}

function CommentItem({ comment, onDelete, setIsSubmitting, isSubmitting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment_content);
  const [replyComment, setReplyComment] = useState("");
  const toast = useToast();
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  function handleDuplicateSubmit() {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add/" + comment.game_board_id, {
        parent_id: comment.id,
        comment_content: replyComment,
        game_board_id: comment.game_board_id,
        member_id: comment.member_id,
      })
      .then(() => {
        toast({ description: "성공", status: "success" });
      })
      .catch((error) => {
        // handle errors
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsWriting(false);
        setReplyComment("");
      });
  }

  function handleEditSubmit() {
    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", {
        id: comment.id,
        comment_content: commentEdited,
      })
      .then(() => {
        toast({ description: "성공", status: "success" });
      })
      .catch((error) => {
        // handle errors
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Flex
      justifyContent={"flex-start"}
      alignItems={"center"}
      ml={`${comment.depth * 20}px`}
    >
      <Image
        borderRadius={"full"}
        boxSize={"70px"}
        src={comment.file_url}
        alt="프로필 이미지"
      ></Image>

      <Box w={"100%"} ml={"10px"}>
        <Flex justifyContent="space-between">
          <Heading fontSize="1.2rem">{comment.member_id}</Heading>
          <Text fontSize="1rem">{comment.ago}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="1rem">
              {comment.comment_content}
            </Text>
            {isEditing && (
              <Box>
                <Textarea
                  value={commentEdited}
                  onChange={(e) => setCommentEdited(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  isDisabled={isSubmitting}
                  onClick={handleEditSubmit}
                >
                  수정 - 저장
                </Button>
              </Box>
            )}

            {isWriting && (
              <Box>
                <Textarea
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  isDisabled={isSubmitting}
                  onClick={handleDuplicateSubmit}
                >
                  댓글-댓글 저장
                </Button>
              </Box>
            )}
          </Box>

          <Box>
            {isAuthenticated() && (
              <>
                {isWriting || (
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => setIsWriting(true)}
                  >
                    <AddIcon />
                  </Button>
                )}
                {isWriting && (
                  <Button
                    size="xs"
                    colorScheme="gray"
                    onClick={() => setIsWriting(false)}
                  >
                    <NotAllowedIcon />
                  </Button>
                )}
              </>
            )}
          </Box>

          {(hasAccess(comment.member_id) || isAdmin()) && (
            <Box>
              {isEditing || (
                <Button
                  size="xs"
                  colorScheme="purple"
                  onClick={() => setIsEditing(true)}
                >
                  <EditIcon />
                </Button>
              )}
              {isEditing && (
                <Button
                  size="xs"
                  colorScheme="gray"
                  onClick={() => setIsEditing(false)}
                >
                  <NotAllowedIcon />
                </Button>
              )}
              <Button
                onClick={() => onDelete(comment.id)}
                size="xs"
                colorScheme="red"
              >
                <DeleteIcon />
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

function CommentList({ commentList, onDelete, setIsSubmitting }) {
  return (
    <Card mt={"50px"} boxShadow={"md"}>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              isSubmitting={false}
              setIsSubmitting={setIsSubmitting}
              comment={comment}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function GameBoardCommentContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const toast = useToast();

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios.get("/api/comment/list/" + id).then((response) => {
      setCommentList(response.data);
    });
  }, [isSubmitting, id]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add/" + id, {
        game_board_id: id,
        comment_content: comment.comment,
        parent_id: null,
        member_id: comment.member_id,
      })
      .then(() => {
        toast({
          description: "등록 성공",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "로그인 후 이용 해주세요.",
          status: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDelete(id) {
    setIsSubmitting(true);

    axios
      .delete("/api/comment/" + id)
      .then(() => {
        toast({
          description: "삭제 성공",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "실패",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box w={"100%"} my={"50px"}>
      <CommentForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      <CommentList
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default GameBoardCommentContainer;
