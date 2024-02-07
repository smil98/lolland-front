import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  StackDivider,
  Table,
  TableContainer,
  Tag,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ScreenContext } from "../../component/ScreenContext";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function PurchasePagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  if (!pageInfo) {
    return null;
  }

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mb={10} mt={10} display="flex" justifyContent="center">
      {pageInfo.prevPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PageButton>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <PageButton variant={"ghost"} pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faAngleRight} />
        </PageButton>
      )}
    </Box>
  );
}

export function MemberPurchase() {
  const [orderList, setOrderList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [pageInfo, setPageInfo] = useState(null);

  const { isSmallScreen } = useContext(ScreenContext);

  useEffect(() => {
    axios
      .get("/api/payment/my?" + params)
      .then((response) => {
        setOrderList(response.data.orderList);
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
      });
  }, [location]);

  const getStatusStyle = (orderStatus) => {
    switch (orderStatus) {
      case "ORDERED":
        return { color: "#6FA7DD", colorScheme: "blue", content: "결제 완료" };
      case "ORDERING":
        return { color: "orange", colorScheme: "orange", content: "주문 중" };
      case "CANCEL_WAIT":
        return {
          color: "red",
          colorScheme: "red",
          content: "결제 취소 대기 중",
        };
      case "CANCELED":
        return { color: "gray", colorScheme: "gray", content: "결제 취소" };
      default:
        return {
          color: "orange",
          colorScheme: "orange",
          content: "Unknown Status",
        };
    }
  };

  const formatOrderDate = (orderRegTime) => {
    const formattedDate = format(new Date(orderRegTime), "yyyy.MM.dd HH:mm");
    return formattedDate;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Card mx={{ base: "0", md: "10%", lg: "15%", xl: "20%" }} w="full">
      <CardHeader
        px={10}
        pt={10}
        display="flex"
        alignItems="center"
        fontWeight="bold"
        textAlign="left"
        fontSize="2xl"
        className="specialHeadings"
      >
        결제 내역
      </CardHeader>
      <CardBody pb={10} px={10}>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={7}
          align="stretch"
        >
          {orderList &&
            orderList.map((order) => (
              <Box
                key={order.id}
                display="flex"
                justifyContent="space-between"
                textAlign="left"
                alignItems="center"
                opacity={
                  order.order_status === "CANCELED" ||
                  order.order_status === "CANCEL_WAIT"
                    ? 0.4
                    : 1
                }
                onClick={() => navigate(`order/${order.id}`)}
              >
                <HStack alignItems="center" spacing={2}>
                  <Image
                    src={order.main_img_uri}
                    w={isSmallScreen ? "50px" : "90px"}
                    h={isSmallScreen ? "50px" : "90px"}
                  />
                  <VStack alignItems="flex-start" h="90px" spacing={2}>
                    <HStack alignItems="center" mt={4}>
                      <Tag
                        borderRadius="full"
                        variant="outline"
                        size={isSmallScreen ? "sm" : "base"}
                        px={3}
                        colorScheme={
                          getStatusStyle(order.order_status).colorScheme
                        }
                      >
                        {getStatusStyle(order.order_status).content}
                      </Tag>
                      <Text
                        opacity={0.5}
                        as={order.order_status === "CANCELED" ? "s" : "p"}
                      >
                        {formatOrderDate(order.order_reg_time)}
                      </Text>
                    </HStack>
                    <Text
                      fontWeight="bold"
                      className="labels"
                      fontSize={isSmallScreen ? "sm" : "md"}
                    >
                      {order.order_name}
                    </Text>
                  </VStack>
                </HStack>
                <HStack spacing={isSmallScreen ? 1 : 5}>
                  <Text
                    fontWeight="bold"
                    className="labels"
                    color={getStatusStyle(order.order_status).color}
                    fontSize={isSmallScreen ? "sm" : "lg"}
                  >
                    {formatPrice(order.total_price)} 원
                  </Text>
                  <Text fontSize={isSmallScreen ? 0 : "md"} opacity={0.4}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Text>
                </HStack>
              </Box>
            ))}
        </VStack>
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <PurchasePagination pageInfo={pageInfo} />
      </CardFooter>
    </Card>
  );
}
