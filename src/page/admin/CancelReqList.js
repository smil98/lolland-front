import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function CancelReqList() {
  // 버튼 css
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  const [cancelReqList, setCancelReqList] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [refundStatus, setRefundStatus] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("/api/payment/cancel-req-member?" + params)
      .then((response) => {
        setCancelReqList(response.data.orderCancelReqDto);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "주문 내역을 불러오는 도중 에러",
            description: "백엔드 코드를 확인하세요",
            status: "error",
          });
        } else {
          toast({
            title: "주문 내역을 불러오는 도중 에러",
            description: "다시 한 번 시도하시거나, 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      })
      .finally(() => {
        setRefundStatus(false);
      });
  }, [location, refundStatus]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 환불 버튼 클릭시 로직
  const handleRefundClick = (cancelInfo) => {
    axios
      .post("/api/payment/admin/cancel", {
        orderId: cancelInfo.order_nano_id,
      })
      .then(() =>
        toast({
          description: cancelInfo.order_name + "이 환불 처리 되었습니다.",
          status: "success",
        }),
      )
      .then(() => setRefundStatus(true))
      .catch(() => {
        toast({
          description: "환불 처리 중 문제가 발생하였습니다.",
          status: "error",
        });
      });
  };

  return (
    <Card w="full" mx={{ base: 0, lg: "5%" }}>
      <CardHeader
        fontSize="2xl"
        textAlign="left"
        fontWeight="bold"
        className="specialHeadings"
      >
        결제 취소 요청 목록
      </CardHeader>

      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3 }}
        spacing={{ md: 0, xl: 1 }}
      >
        {cancelReqList.map((cancelList) => (
          <CardBody key={cancelList.id}>
            <Box
              margin="auto"
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              shadow="base"
            >
              <Flex
                borderRadius="5px"
                px={2}
                h="40px"
                lineHeight="40px"
                fontSize="sm"
                fontWeight="bold"
                bg="black"
                color="white"
                justifyContent="space-between"
              >
                <Text>주문번호 : {cancelList.id}</Text>
                <Text>주문일 : {formatDate(cancelList.order_reg_time)}</Text>
              </Flex>
              <Box mt={2}>
                <Text borderRadius={5} fontSize="sm" bgColor="gray.200">
                  결제 상품 정보
                </Text>
                <Flex gap={4} mt={2}>
                  <Box alignSelf="flex-start">
                    <Image src={cancelList.main_img_uri} w="100px" h="100px" />
                  </Box>
                  <Box textAlign="left">
                    <Text fontSize="md">{cancelList.order_name}</Text>
                    <Text mt={2} gap={1} fontSize="md">
                      <Text as="span" fontWeight="bold" color="orange" mr={1}>
                        {cancelList.total_price.toLocaleString()}
                      </Text>
                      원
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box mt={2}>
                <Text borderRadius={5} fontSize="sm" bgColor="gray.200">
                  환불 요청 회원 정보
                </Text>
                <Flex mt={2} justifyContent="space-evenly">
                  <Box textAlign="left" ml={2} fontWeight="bold">
                    <Text mt={1}>이름</Text>
                    <Text mt={1}>아이디</Text>
                    <Text mt={1}>이메일</Text>
                    <Text mt={1}>전화번호</Text>
                  </Box>
                  <Center>
                    <Divider orientation="vertical" />
                  </Center>
                  <Box textAlign="left">
                    <Text mt={1}>{cancelList.membersDto.member_name}</Text>
                    <Text mt={1}>{cancelList.membersDto.member_login_id}</Text>
                    <Text mt={1}>{cancelList.membersDto.member_email}</Text>
                    <Text mt={1}>
                      {cancelList.membersDto.member_phone_number}
                    </Text>
                  </Box>
                  <Center>
                    <Divider orientation="vertical" />
                  </Center>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      size={{ base: "md", md: "sm", xl: "md" }}
                      onClick={() => {
                        handleRefundClick(cancelList);
                      }}
                      _hover={{ bgColor: "orange", color: "white" }}
                    >
                      환불
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </CardBody>
        ))}
      </SimpleGrid>

      {/* 페이지 버튼  */}
      <Box mt={10} mb={10}>
        {pageInfo.prevPageNumber && (
          <Button
            bg={"white"}
            color={"black"}
            _hover={{ backgroundColor: "black", color: "whitesmoke" }}
            onClick={() => navigate("?page=" + pageInfo.prevPageNumber)}
          >
            <Flex gap={1}>
              <FontAwesomeIcon icon={faCaretLeft} />
              이전
            </Flex>
          </Button>
        )}

        {pageInfo.nextPageNumber && (
          <Button
            bg={"white"}
            color={"black"}
            _hover={{ backgroundColor: "black", color: "whitesmoke" }}
            ml={2}
            onClick={() => navigate("?page=" + pageInfo.nextPageNumber)}
          >
            <Flex gap={1}>
              다음
              <FontAwesomeIcon icon={faCaretRight} />
            </Flex>
          </Button>
        )}
      </Box>
    </Card>
  );
}
