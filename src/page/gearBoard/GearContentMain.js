import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function GearContentMain() {
  const navigate = useNavigate();
  const [gearboard, setGearboard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + 91)
      .then((response) => setGearboard(response.data));
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + gearboard.files.length) % gearboard.files.length,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gearboard.files.length);
  };

  return (
    <Box w="100%" h="auto" position="relative" overflow="hidden">
      {/* 이미지 출력 */}
      {gearboard &&
        gearboard.files.map((file, index) => (
          <Box
            onClick={() => navigate("/gearlist/gear_id/91")}
            key={file.id}
            mb={5}
            display={index === currentIndex ? "block" : "none"}
          >
            <Image width="100%" src={file.url} alt={file.name} />
          </Box>
        ))}
      {/* 좌우 버튼 */}
      <Box
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        left={5}
        px={3}
        py={2}
        opacity={0.6}
        bgColor="white"
        _hover={{ opacity: 1 }}
        cursor="pointer"
        borderRadius={2}
        onClick={handlePrevClick}
        display={gearboard && currentIndex > 0 ? "block" : "none"}
      >
        <FontAwesomeIcon icon={faArrowLeft} color="black" />
      </Box>
      <Box
        position="absolute"
        top="50%"
        transform="translateY(-50%)"
        right={5}
        bgColor="white"
        cursor="pointer"
        px={3}
        py={2}
        opacity={0.6}
        borderRadius={2}
        _hover={{ opacity: 1 }}
        onClick={handleNextClick}
        display={
          gearboard && currentIndex < gearboard.files.length - 1
            ? "block"
            : "none"
        }
      >
        <FontAwesomeIcon icon={faArrowRight} color="black" />
      </Box>
      {/* 추가 이미지 및 텍스트 */}
      {gearboard && (
        <Box
          textAlign="left"
          position="absolute"
          bottom={5}
          width="100%"
          p={5}
          color="white"
        >
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="bold"
            color="white"
            mb={3}
            textShadow="1px 1px #000"
          >
            {gearboard.gear_title}
          </Text>
          <Flex gap={3} alignItems={"center"}>
            <Image
              objectFit="cover"
              width={{ base: "5%", md: "40px", lg: "55px" }}
              height={{ base: "5%", md: "40px", lg: "55px" }}
              src={gearboard.file_url}
              alt={gearboard.file_name}
              borderRadius="50%"
            />
            <Text fontSize={{ base: "sm", md: "md", lg: "lg" }}>
              {gearboard.member_name}
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
