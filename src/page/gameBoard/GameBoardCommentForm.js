import React, { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider";
import { Box, Button, Textarea, Tooltip } from "@chakra-ui/react";

export function GameBoardCommentForm({ isSubmitting, onSubmit }) {
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
        w="100%"
        p={3}
        borderRadius="md"
        h="auto"
        placeholder="댓글 입력"
      />
      <Tooltip isDisabled={!isAuthenticated()} hasArrow label="로그인 하세요">
        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          ml={2}
          px={4}
          h="80px"
          w="80px"
        >
          등록
        </Button>
      </Tooltip>
    </Box>
  );
}
