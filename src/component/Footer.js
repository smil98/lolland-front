import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  List,
  ListItem,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { ScreenContext } from "./ScreenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export function Footer() {
  const { isSmallScreen } = useContext(ScreenContext);

  return (
    <>
      <Spacer h={5} />
      {isSmallScreen ? (
        <Box bgColor="#F4F4F4" px={5} pt={8} pb={5}>
          <Heading size="md" className="labels">
            고객센터 >
          </Heading>
          <Text my={5}>
            <Text as="span" fontSize="md" fontWeight="bold" mr={3}>
              <FontAwesomeIcon icon={faPhone} /> 0000-0000
            </Text>
            09:00~18:00
          </Text>
          <List fontSize="xs" spacing={1}>
            <ListItem>평일: 전체 문의 상담</ListItem>
            <ListItem>토요일, 공휴일: 직접배송, 카톡 문의 상담</ListItem>
            <ListItem>일요일: 휴무</ListItem>
          </List>
          <Center my={5}>
            <Divider w="94%" />
          </Center>
          <Flex justifyContent="flex-start">
            <ButtonGroup
              size="xs"
              variant="undefined"
              display="flex"
              justifyContent="flex-start"
              flexWrap="wrap"
              variant="undefined"
              spacing={0}
            >
              <Button fontWeight="normal">회사소개</Button>
              <Button fontWeight="normal">이용약관</Button>
              <Button fontWeight="normal">개인정보</Button>
              <Button fontWeight="normal">청소년보호정책</Button>
              <Button fontWeight="normal">입점/제휴 문의</Button>
              <Button fontWeight="normal">대량구매</Button>
              <Button fontWeight="normal">공지사항</Button>
              <Button fontWeight="normal">채용공고</Button>
              <Button fontWeight="normal">Contact Us</Button>
            </ButtonGroup>
          </Flex>
          <Center my={5}>
            <Divider w="94%" />
          </Center>
          <Accordion id="myAccordian" allowToggle>
            <AccordionItem className="accordianItem">
              <AccordionButton
                p={0}
                _hover={{ shadow: "none", bgColor: "#F4F4F4" }}
              >
                <Box as="span" textAlign="left" fontSize="xs" fontWeight="bold">
                  LOLLAND (롤랜드)
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel whiteSpace="pre-wrap" pb={4} px={0}>
                <List spacing={3} fontSize="xs" mt={1}>
                  <ListItem>사업자등록번호 000-00-00000</ListItem>
                  <ListItem>소재지 서울시 마포구 신촌로 176</ListItem>
                  <ListItem>개인정보보호책임자 없음</ListItem>
                  <ListItem>조장 이승원</ListItem>
                  <ListItem>팀원 조대훈 최재희 이승원 이정훈 이승미</ListItem>
                  <ListItem fontWeight="bold">
                    본 페이지는 졸업 프로젝트로 어떠한 영리적 활동도 하지 않는
                    사이트임을 알립니다.
                  </ListItem>
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Text mt={2} fontSize="xs">
            Copyright © 0000 LOLLAND KOREA, INC. All rights reserved.
          </Text>
        </Box>
      ) : (
        <Box bgColor="#F4F4F4" px={10} pt={5} pb={10}>
          <Flex justifyContent="flex-start" mx="3%" p={5}>
            <ButtonGroup size="sm" variant="undefined">
              <Button>회사소개</Button>
              <Button>이용약관</Button>
              <Button>개인정보</Button>
              <Button>청소년보호정책</Button>
              <Button>입점/제휴 문의</Button>
              <Button>대량구매</Button>
              <Button>Contact Us</Button>
              <Button>고객센터</Button>
            </ButtonGroup>
          </Flex>
          <Center>
            <Divider w="94%" />
          </Center>
          <Flex justifyContent="space-between" mx="3%" p={5}>
            <Box>
              <HStack spacing={5} mb={2}>
                <HStack>
                  <Text fontSize="xs">상호명</Text>
                  <Text fontSize="xs">LOLLAND (롤랜드)</Text>
                </HStack>
                <HStack>
                  <Text fontSize="xs">조장</Text>
                  <Text as="span" fontSize="xs" fontWeight="bold">
                    이승원
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="xs">사업자등록번호</Text>
                  <Text fontSize="xs">000-00-00000</Text>
                  <Text as="ins" fontSize="xs">
                    사업자 정보 확인
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="xs">소재지</Text>
                  <Text fontSize="xs">서울시 마포구 신촌로 176</Text>
                </HStack>
              </HStack>
              <HStack spacing={5} mb={2}>
                <HStack>
                  <Text fontSize="xs">개인정보보호책임자</Text>
                  <Text fontSize="xs">없음</Text>
                </HStack>
                <HStack>
                  <Text fontSize="xs">통신판매업신고</Text>
                  <Text fontSize="xs">제 0000-XXXX-0000호</Text>
                </HStack>
              </HStack>
              <Text fontSize="xs" mb={2}>
                Copyright © 0000 LOLLAND KOREA, INC. All rights reserved.
              </Text>
              <HStack mb={2}>
                <Text fontSize="xs">관리자</Text>
                <Text fontSize="xs">조대훈 최재희 이승원 이정훈 이승미</Text>
              </HStack>
              <HStack>문의 번호 : 000-0000-0000</HStack>
              <Text fontSize="sm" fontWeight="bold">
                본 페이지는 졸업 프로젝트로 어떠한 영리적 활동도 하지 않는
                사이트임을 알립니다.
              </Text>
            </Box>
            <Box
              w="200px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Image src="/logo.png" boxSize="100%" objectFit="fit" />
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
}
