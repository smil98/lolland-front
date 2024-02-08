import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faComment,
  faCommentsDollar,
  faPeopleGroup,
  faPlus,
  faTableList,
  faUser,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ScreenContext } from "../../component/ScreenContext";

export function AdminNavBar() {
  const navigate = useNavigate();
  const { isSmallScreen } = useContext(ScreenContext);

  // 회원 목록 클릭시
  function handleMemberListClick() {
    navigate("/adminPage/memberList");
  }

  const buttonStyle = {
    variant: "undefined",
    isRound: true,
    _hover: { bgColor: "orange", color: "white" },
  };

  return (
    <Flex
      flexDir={isSmallScreen ? "row" : "column"}
      mx={isSmallScreen ? 2 : 5}
      mt={isSmallScreen ? -5 : 5}
      mb={5}
      px={2}
      py={isSmallScreen ? 2 : 5}
      justifyContent="center"
      borderRadius="full"
      textAlign="center"
      bgColor="#FFF"
      border="1px solid #F4F4F4"
      shadow="md"
    >
      <Stack
        direction={isSmallScreen ? "row" : "column"}
        spacing={{ base: 8, md: 10 }}
      >
        <Tooltip hasArrow label="상품 등록" placement="right">
          <IconButton
            {...buttonStyle}
            onClick={() => navigate("product/write/")}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </Tooltip>
        <Tooltip hasArrow label="상품 리스트" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faTableList} />}
            onClick={() => {
              navigate("/product/list/");
            }}
          />
        </Tooltip>
        {/*<Tooltip hasArrow label="판매 현황 보기" placement="right">*/}
        {/*  <IconButton*/}
        {/*    {...buttonStyle}*/}
        {/*    icon={<FontAwesomeIcon icon={faChartLine} />}*/}
        {/*  />*/}
        {/*</Tooltip>*/}
        <Tooltip hasArrow label="문의 답변 등록하기" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faComment} />}
            onClick={() => navigate("qna")}
          />
        </Tooltip>
        <Tooltip hasArrow label="회원 목록" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faPeopleGroup} />}
            onClick={() => navigate("/adminPage/memberList")}
          />
        </Tooltip>
        <Tooltip hasArrow label="취소 요청" placement="right">
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faCommentsDollar} />}
            onClick={() => navigate("/adminPage")}
          />
        </Tooltip>
      </Stack>
    </Flex>
  );
}
