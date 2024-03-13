import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { LoginContext } from "../../component/LoginProvider";

export function GearCommentContainer() {
  const { gear_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const { isAuthenticated, hasAccess, isAdmin } = useContext(LoginContext);

  useEffect(() => {
    fetchCommentList();
  }, []);

  function fetchCommentList() {
    axios
      .get("/api/gcomment/list?gear_id=" + gear_id)
      .then((response) => setCommentList(response.data));
  }

  function handleDelete(comment) {
    if (isAdmin() || hasAccess(comment.member_login_id)) {
      axios
        .delete("/api/gcomment/remove/" + comment.id)
        .then(() => {
          fetchCommentList();
          navigate(`/gearlist/gear_id/${comment.boardid}`);
        })
        .catch((error) => {
          toast({
            title: "댓글 삭제 중 에러가 발생",
            description: error.response.status + ": " + error.response,
            status: "error",
          });
        });
    }
  }

  function handleSubmit() {
    if (isAuthenticated()) {
      axios
        .post("/api/gcomment/add", {
          boardid: gear_id,
          comment: newComment,
        })
        .then(() => {
          fetchCommentList();
        });
    } else
      toast({
        title: "비회원은 댓글을 작성할 수 없습니다",
        description: "로그인 후 시도해주세요",
        status: "warning",
      });
  }

  return (
    <Box my={5}>
      <Flex gap={2} mb={5}>
        <Textarea
          placeholder={"칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button colorScheme="orange" w="80px" h="80px" onClick={handleSubmit}>
          등록
        </Button>
      </Flex>
      <Stack divider={<StackDivider />} spacing={4}>
        {commentList.map((comment) => (
          <Box key={comment.id}>
            <Flex alignItems="center" gap={2}>
              <Text fontWeight="bold" as="span" fontSize="md">
                {comment.member_name}
              </Text>
              <Text
                fontSize="sm"
                color="gray"
                as="span"
                fontWeight="normal"
                ml={2}
              >
                {new Date(comment.inserted).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(comment.inserted)
                  .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                  .replace(/\s/g, " ")}
              </Text>
              <IconButton
                display={
                  isAdmin() || hasAccess(comment.member_login_id)
                    ? "block"
                    : "none"
                }
                icon={<DeleteIcon />}
                onClick={() => {
                  handleDelete(comment);
                }}
                size="sm"
                variant="ghost"
                colorScheme="red"
              />
            </Flex>
            <Text pt="2" whiteSpace="pre-wrap" fontSize="sm">
              {comment.comment}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
