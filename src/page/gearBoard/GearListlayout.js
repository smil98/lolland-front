import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { GearList } from "./GearList";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GearListAll } from "./GearListAll";
import axios from "axios";
import { TodayBest } from "./TodayBest";
import { FreeBest } from "./FreeBest";
import { GearNews } from "./GearNews";
import { GearNotice } from "./GearNotice";
import { GearContentMain } from "./GearContentMain";
import { GearAppleNews } from "./GearAppleNews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessRook } from "@fortawesome/free-solid-svg-icons";

function Pageing() {
  return null;
}

export function GearListlayout() {
  const [category, setCategory] = useState("전체");
  const navigate = useNavigate();
  const [naver, setNaver] = useState(null);

  useEffect(() => {
    axios.get("/api/gear/naver").then((response) => setNaver(response.data));
  }, []);

  return (
    <Box w={{ base: "98%", md: "95%" }} mx="auto">
      <Box
        w="full"
        mt={{ base: 0, md: 5 }}
        mx="auto"
        borderTop="1px solid black"
        borderBottom="1px solid black"
      >
        <Text
          className="specialHeadings"
          fontSize="3xl"
          color="black"
          my={3}
          pl={{ base: 0, md: 5 }}
          textAlign={{ base: "center", md: "left" }}
          fontWeight="bold"
        >
          <Text as="span" mr={5}>
            <FontAwesomeIcon icon={faChessRook} />
          </Text>
          게임 장비 커뮤니티
        </Text>
      </Box>
      <Flex flexDir={{ base: "column", md: "row" }} mt={5}>
        {/* 오른쪽 30%  자유게시판BEST , 최신 공식기사 */}
        <Box w={{ base: "100%", md: "30%" }} mr={{ base: 0, md: 4 }} mx="auto">
          <SimpleGrid columns={1} w="100%" h="520px" spacing={5} mb={5}>
            <iframe
              title="YouTube Video"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/luFGI13Mv8o`}
              allowFullScreen
            />
            <iframe
              title="YouTube Video"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/CUwg_JoNHpo`}
              allowFullScreen
            />
          </SimpleGrid>
          <GearNews />
          <Card>
            <CardHeader
              className="specialHeadings"
              fontWeight="bold"
              color="orange"
              fontSize="2xl"
              textAlign="center"
            >
              게임 관련 최신 기사
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {naver &&
                  naver.items !== null &&
                  naver.items.map((news) => (
                    <Box key={news.link}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => window.open(news.link, "_blank")}
                      >
                        {news.title
                          .replace(/&quot;/g, "") // &quot; 제거
                          .replace(/<b>/g, "") // <b> 제거
                          .replace(/<\/b>/g, "") + "..."}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </CardBody>
          </Card>
        </Box>
        {/* 왼쪽 70%  오늘의 베스트 , 게시판 리스트 */}
        <Box w={{ base: "100%", md: "70%" }} mx="auto">
          <GearContentMain />
          {/*/!* 오늘의 베스트*!/*/}
          {/*<Flex>*/}
          {/*  <Box w={"48%"} mr={"1%"}>*/}
          {/*    <FreeBest />*/}
          {/*  </Box>*/}
          {/*  <Box w={"50%"} ml={"1%"}>*/}
          {/*    <TodayBest />*/}
          {/*  </Box>*/}
          {/*</Flex>*/}
          <TodayBest />
          {/*공지사항*/}
          <GearNotice />
          {/*게시판 리스트*/}
          <Tabs variant="unstyled" alignItems="center" isFitted mt={5}>
            <TabList>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("전체")}
              >
                전체
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("모니터")}
              >
                모니터
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("키보드")}
              >
                키보드
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("마우스")}
              >
                마우스
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("오디오")}
              >
                오디오
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                _selected={{ color: "white", bg: "orange.400" }}
                onClick={(e) => setCategory("최신기기")}
              >
                최신기기
              </Tab>
              <Tab
                fontSize={{ base: "xs", md: "xs", lg: "md" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/gearboard");
                }}
              >
                글쓰기
              </Tab>
            </TabList>
            <TabPanels>
              {/* 전체 정보 */}
              <TabPanel>
                <GearListAll category={category} />
              </TabPanel>
              {/* 모니터 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 키보드 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 마우스 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 오디오  */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 최신기기 */}
              <TabPanel>
                <GearList category={category} />
              </TabPanel>
              {/* 인사정보 */}
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
}
