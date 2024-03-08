import {
  Badge,
  Box,
  Flex,
  Image,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faImage, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { ChatIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export function GameBoardListTop6() {
  const navigate = useNavigate();

  const [top, setTop] = useState(null);

  useEffect(() => {
    axios
      .get("/api/gameboard/list/top")
      .then((response) => setTop(response.data));
  }, []);

  const categoryColors = {
    "리그 오브 레전드": "green",
    "로스트 아크": "blue",
    "콘솔 게임": "purple",
    "모바일 게임": "orange",
    자유: "gray",
  };

  return (
    <SimpleGrid
      columns={{ base: 2, md: 3 }}
      spacing={4}
      w="90%"
      mx="auto"
      mb={5}
    >
      {top &&
        top.map((topTen) => (
          <Box
            minH="350px"
            position="relative"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxSizing="content-box"
            shadow="base"
            onClick={() => navigate("/gameboard/id/" + topTen.id)}
          >
            <Box
              position="absolute"
              w="100%"
              h="60%"
              top={0}
              left={0}
              style={{ overflow: "hidden" }}
            >
              {/* --------- 게시글 정보 (사진 개수, 조회수) 출력 --------- */}
              <Box
                w="100%"
                mx="auto"
                px={4}
                display="flex"
                justifyContent="space-between"
                position="absolute"
                top={3}
                zIndex={2}
                opacity={0.7}
              >
                {topTen.countFile !== 0 && (
                  <Badge px={2} borderRadius="full" fontSize="sm">
                    <FontAwesomeIcon icon={faImage} /> {topTen.countFile}
                  </Badge>
                )}
                {topTen.countFile !== 0 && (
                  <Badge px={2} borderRadius="full" fontSize="sm">
                    <FontAwesomeIcon icon={faEye} /> {topTen.board_count}
                  </Badge>
                )}
              </Box>
              {/* --------- 사진 출력란 --------- */}
              <Swiper
                slidesPerView={1}
                pagination={{
                  clickable: true,
                }}
                modules={[Navigation, SwiperPagination]}
                className="mySwiper"
              >
                {topTen.files.map((file) => (
                  <SwiperSlide key={file.id}>
                    <Image
                      src={file.file_url}
                      alt={file.file_name}
                      objectFit={"cover"}
                      boxSize={"100%"}
                      css={{
                        transition: "transform 0.3s ease-in-out", // 변환 애니메이션 적용
                        "&:hover": {
                          transform: "scale(1.1)", // 확대 효과
                        },
                      }}
                      _hover={{ cursor: "pointer" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* --------- 게시글 정보(카테고리, 추천, 날짜, 댓글, 제목, 작성자 아이디) 출력란 --------- */}
            <Box
              w="full"
              position="absolute"
              bottom={0}
              left={0}
              px={3}
              py={5}
              h="40%"
            >
              {/* --------- 카테고리 & 작성일 --------- */}
              <Flex justifyContent="space-between">
                <Badge
                  borderRadius="full"
                  fontSize="sm"
                  px={2}
                  colorScheme={categoryColors[topTen.category]}
                >
                  {topTen.category}
                </Badge>
                <Text color="grey">
                  {new Date(topTen.reg_time).toLocaleDateString("ko-KR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
              </Flex>
              {/* --------- 게시글 제목 출력 --------- */}
              <Text
                my={3}
                fontWeight="bold"
                className="labels"
                fontSize="lg"
                _hover={{ cursor: "pointer" }}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "200px",
                }}
              >
                {topTen.title.length > 20
                  ? `${topTen.title.slice(0, 20)}...`
                  : topTen.title}
              </Text>
              {/* --------- 작성 멤버 아이디 & 추천 댓글 수 출력 --------- */}
              <Box display="flex" justifyContent="space-between">
                <Text className="labels">{topTen.member_id}</Text>
                <Box display="flex">
                  <Badge
                    colorScheme="orange"
                    variant="outline"
                    mx="2px"
                    fontWeight="bold"
                    borderRadius="full"
                    px={2}
                    fontSize="sm"
                    // bgColor={`rgba(255, 130, 0, ${topTen.count_like / 10})`} 추천수에 따라 배경색 투명도 조절 가능
                  >
                    <FontAwesomeIcon icon={faThumbsUp} /> {topTen.count_like}
                  </Badge>
                  {topTen.count_comment !== 0 && (
                    <Badge
                      colorScheme="orange"
                      variant="outline"
                      mx="2%"
                      borderRadius="full"
                      fontSize="sm"
                      px={2}
                    >
                      <ChatIcon /> {topTen.count_comment}
                    </Badge>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
    </SimpleGrid>
  );
}
