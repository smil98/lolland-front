import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";

export function GameBoardCommentItem({
  comment,
  onDelete,
  setIsSubmitting,
  isSubmitting,
}) {
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
    <Box>
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        ml={`${comment.depth * 20}px`}
      >
        <Image
          borderRadius="full"
          boxSize="50px"
          src={comment.file_url}
          alt="프로필 이미지"
        />
        <Box w="100%" ml="10px">
          <Flex justifyContent="space-between">
            <Text fontSize="md" fontWeight="bold">
              {comment.member_id}
            </Text>
            <Text fontSize="md">{comment.ago}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Text
                sx={{ whiteSpace: "pre-wrap" }}
                pt="2"
                display={isEditing ? "none" : "block"}
                fontSize="md"
              >
                {comment.comment_content}
              </Text>
              {isEditing && (
                <Textarea
                  value={commentEdited}
                  onChange={(e) => setCommentEdited(e.target.value)}
                />
              )}
            </Box>
            <Box display="flex" flexDir="column" ml={3}>
              <Box display="flex">
                {isAuthenticated() && (
                  <>
                    {isWriting ? (
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        icon={<CloseIcon />}
                        onClick={() => setIsWriting(false)}
                      />
                    ) : (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        colorScheme="orange"
                        onClick={() => setIsWriting(true)}
                        icon={<AddIcon />}
                      />
                    )}
                  </>
                )}
                {(hasAccess(comment.member_id) || isAdmin()) && (
                  <>
                    {isEditing || (
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="purple"
                        icon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                      />
                    )}
                    {isEditing && (
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        icon={<CloseIcon />}
                        onClick={() => setIsEditing(false)}
                      />
                    )}
                    <IconButton
                      onClick={() => onDelete(comment.id)}
                      size="sm"
                      variant="ghost"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                    />
                  </>
                )}
              </Box>
              <Button
                display={isEditing ? "block" : "none"}
                colorScheme="purple"
                variant="outline"
                size="sm"
                isDisabled={isSubmitting}
                onClick={handleEditSubmit}
              >
                수정 등록
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
      {isWriting && (
        <Box display="flex" mt={5} ml="70px" gap={2}>
          <Textarea
            value={replyComment}
            onChange={(e) => setReplyComment(e.target.value)}
            placeholder="답글 입력"
          />
          <Button
            w="70px"
            h="80px"
            colorScheme="orange"
            isDisabled={isSubmitting}
            onClick={handleDuplicateSubmit}
            글
          >
            등록
          </Button>
        </Box>
      )}
    </Box>
  );
}
