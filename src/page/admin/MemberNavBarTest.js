import { Flex, IconButton, Stack, Tooltip } from "@chakra-ui/react";
import {
  faAddressBook,
  faCircleQuestion,
  faComments,
  faCreditCard,
  faHeart,
  faLock,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ScreenContext } from "../../component/ScreenContext";

export function MemberNavBarTest() {
  const [member, setMember] = useState("");
  const navigate = useNavigate();
  const { isSmallScreen } = useContext(ScreenContext);

  const buttonStyle = {
    variant: "undefined",
    isRound: true,
    _hover: { bgColor: "orange", color: "white" },
  };

  const toolTipDir = {
    placement: isSmallScreen ? "top" : "right",
  };

  return (
    <Flex
      flexDir={isSmallScreen ? "row" : "column"}
      mx={isSmallScreen ? 2 : 5}
      mt={isSmallScreen ? -5 : 5}
      mb={5}
      px={2}
      py={5}
      justifyContent="center"
      borderRadius="full"
      textAlign="center"
      bgColor="#FFF"
      shadow="md"
    >
      <Stack
        direction={isSmallScreen ? "row" : "column"}
        spacing={{ base: 5, md: 10 }}
      >
        <Tooltip hasArrow label="내 정보 관리" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            aria-label={"memberInfo"}
            icon={<FontAwesomeIcon icon={faLock} />}
            onClick={() => navigate("memberInfo")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내 주소록 관리" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faAddressBook} />}
            onClick={() => navigate("addressInfo")}
          />
        </Tooltip>
        <Tooltip hasArrow label="결제 내역" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faCreditCard} />}
            onClick={() => navigate("/memberPage")}
          />
        </Tooltip>
        <Tooltip hasArrow label="찜 목록" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faHeart} />}
            onClick={() => navigate("productLike")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내 문의 보기" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faCircleQuestion} />}
            onClick={() => navigate("qna")}
          />
        </Tooltip>
        <Tooltip hasArrow label="내가 남긴 리뷰 보기" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faComments} />}
            onClick={() => navigate("review")}
          />
        </Tooltip>
        <Tooltip hasArrow label="추천한 게시물 보기" {...toolTipDir}>
          <IconButton
            {...buttonStyle}
            icon={<FontAwesomeIcon icon={faThumbsUp} />}
            onClick={() => navigate("boardLike")}
          />
        </Tooltip>
      </Stack>
    </Flex>
  );
}
