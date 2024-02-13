import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ScreenContext } from "./ScreenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const Recent = () => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const { isSmallScreen } = useContext(ScreenContext);

  useEffect(() => {
    // 로컬 스토리지에서 최근 본 상품 목록 로드
    const loadedRecent = JSON.parse(localStorage.getItem("recent")) || [];
    setRecent(loadedRecent);
  }, []);

  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  return (
    <Box display="flex" flexDir="column">
      <Text
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="specialHeadings"
        fontSize="xl"
        mb={1}
      >
        최근 본 상품
        {isSmallScreen && (
          <Button
            bg="black"
            p={0}
            mb={2}
            color="white"
            onClick={scrollToTop}
            size="xs"
            _hover={{
              color: "white",
              bg: "orange",
            }}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </Button>
        )}
      </Text>
      <Box
        display="flex"
        flexDir={{ base: "row", md: "column" }}
        fontSize="10px"
      >
        {recent.map((item, index) => (
          <Stack
            key={index}
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            onClick={() => handleNavigateToProduct(item.product_id)}
          >
            <Image
              src={item.mainImgUrl || "기본 이미지 URL"}
              alt={"Product Image"}
              boxSize="50px"
              borderRadius={5}
              mb={1}
              mt={1}
            />
            <Text fontWeight="bold" noOfLines={1}>
              {truncateText(item.productName, 10)}
            </Text>
          </Stack>
        ))}
        {isSmallScreen || (
          <Button
            mt={2}
            w="100%"
            bg="black"
            color="white"
            onClick={scrollToTop}
            _hover={{
              color: "white",
              bg: "orange",
            }}
          >
            TOP
          </Button>
        )}
      </Box>
    </Box>
  );
};
