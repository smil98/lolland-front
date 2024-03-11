import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { GameBoardCommentItem } from "./GameBoardCommentItem";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export function GameBoardCommentList({
  commentList,
  onDelete,
  setIsSubmitting,
}) {
  return (
    <Card mt={"50px"} boxShadow={"md"}>
      <CardHeader className="specialHeadings" fontSize="xl" fontWeight="bold">
        <Text mr={3} as="span">
          <FontAwesomeIcon icon={faComment} />
        </Text>
        댓글 리스트
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={5}>
          {commentList.map((comment) => (
            <GameBoardCommentItem
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
