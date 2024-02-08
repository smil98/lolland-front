import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
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

function Pagination({ pageInfo }) {
  if (!pageInfo) {
    return null;
  }

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center>
      <Box>
        <ButtonGroup justifyContent="center">
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
            <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </ButtonGroup>
      </Box>
    </Center>
  );
}

export function MemberReview() {
  const [reviewList, setReviewList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const location = useLocation();
  const [selectedReviews, setSelectedReviews] = useState([]);
  const { isSmallScreen } = useContext(ScreenContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    axios
      .get("/api/review/my?" + params)
      .then((response) => {
        setReviewList(response.data.reviewList);
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast({
            title: "세션이 만료되었습니다",
            description: "재로그인 후 시도해주세요",
            status: "warning",
          });
          navigate("/login");
        } else if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: error.response.data,
            description: "리뷰 불러오는 도중 에러 발생, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }, [location]);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  function StarRating({ rate }) {
    const maxRating = 5;
    const filledStars = rate || 0;

    const stars = Array.from({ length: maxRating }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        style={{ color: index < filledStars ? "#FFE000" : "#EAEAE7" }}
      />
    ));

    return <>{stars}</>;
  }

  function handleSelectAllReviews(checked) {
    if (checked) {
      setSelectedReviews(reviewList.map((review) => review.review_id));
    } else {
      setSelectedReviews([]);
    }
  }

  function handleCheckBoxChange(review) {
    const reviewIdentifier = review.review_id;

    setSelectedReviews((prevSelectedReviews) =>
      prevSelectedReviews.includes(reviewIdentifier)
        ? prevSelectedReviews.filter((id) => id !== reviewIdentifier)
        : [...prevSelectedReviews, reviewIdentifier],
    );
  }

  const buttonStyles = {
    variant: "outline",
    border: "1px solid black",
    _hover: { bgColor: "black", color: "white" },
    borderRadius: 0,
  };

  function handleDelete(selectedReviews) {
    axios
      .delete("/api/review/delete/selected", {
        headers: {
          "Content-Type": "application/json",
        },
        data: selectedReviews,
      })
      .then(() => {
        toast({
          description: "선택한 리뷰들을 삭제하였습니다",
          status: "success",
        });
        setSelectedReviews([]);
        navigate("/memberPage/review");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "선택한 리뷰들을 삭제하는데 실패하였습니다",
            description: "백엔드 로그를 확인해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "선택한 리뷰를 삭제하는데 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handleDeleteAll() {
    axios
      .delete("/api/review/delete/all")
      .then(() => {
        toast({
          description: "모든 리뷰를 삭제하였습니다",
          status: "success",
        });
        navigate("/memberPage/review");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "리뷰 전체 삭제에 실패하였습니다",
            description: "백엔드 코드를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request - 요청이 잘못되었습니다",
            description: "백엔드와 프론트엔드 코드 연동을 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 401) {
          toast({
            title: "접근 권한이 없습니다",
            description: "로그인 해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 전체 삭제에 실패하였습니다",
            description: "다시 시도하시거나 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function deleteReview(review_id) {
    const params = new URLSearchParams(location.search);
    axios
      .delete(`/api/review/delete?review_id=${review_id}`)
      .then((response) => {
        navigate("/memberPage/review" + params);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "리뷰 삭제 중 에러 발생",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "리뷰 삭제 중 에러 발생",
            description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  function updateReview(editingReview) {
    const params = new URLSearchParams(location.search);
    axios
      .put("/api/review/update", {
        review_id: editingReview.review_id,
        review_content: editingReview.review_content,
        rate: editingReview.rate,
      })
      .then(() => {
        toast({
          description: "리뷰를 성공적으로 수정하였습니다",
          status: "success",
        });
        navigate("/memberPage/review" + params);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "수정 중 오류 발생",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "수정 중 오류 발생",
            description: "다시 한번 시도해주시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  return (
    <Card w="full" mx={{ base: 0, md: "5%", lg: "15%", xl: "20%" }}>
      <CardHeader
        display="flex"
        alignItems="center"
        fontWeight="bold"
        textAlign="left"
        fontSize="2xl"
        className="specialHeadings"
      >
        내 리뷰 관리
      </CardHeader>
      <CardBody>
        <Flex justifyContent="space-between" mb={5}>
          <Checkbox
            py={2}
            px={3}
            colorScheme="orange"
            isChecked={
              reviewList?.length > 0 &&
              selectedReviews?.length === reviewList?.length
            }
            onChange={(e) => handleSelectAllReviews(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button
              {...buttonStyles}
              onClick={() => handleDelete(selectedReviews)}
            >
              선택 삭제
            </Button>
            <Button {...buttonStyles} onClick={() => handleDeleteAll()}>
              전체 삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <VStack spacing={5} align="stretch">
          {reviewList && reviewList?.length > 0 ? (
            reviewList.map((review) => (
              <Card
                key={review.review_id}
                onClick={() => {
                  navigate(`/product/${review.product_id}`);
                }}
                shadow="md"
                border="1px solid #F4F4F4"
                borderRadius={5}
              >
                <CardHeader
                  display="flex"
                  flexDir="column"
                  justifyContent="flex-start"
                  textAlign="left"
                  mb={-5}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text className="labels" fontWeight="bold" fontSize="md">
                      {review.product_name}
                    </Text>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        colorScheme="orange"
                        isChecked={selectedReviews.includes(review.review_id)}
                        onChange={() => {
                          handleCheckBoxChange(review);
                        }}
                      />
                    </Box>
                  </Flex>
                  <Text mt={2}>
                    <StarRating rate={review.rate} />
                    <Text as="span" ml={3} opacity={0.4}>
                      {formattedDate(review.review_reg_time)}
                    </Text>
                  </Text>
                </CardHeader>
                <CardBody textAlign="left">
                  {isEditing && editingReview.review_id === review.review_id ? (
                    <Textarea
                      onClick={(e) => e.stopPropagation()}
                      value={editingReview.review_content}
                      onChange={(e) => {
                        setEditingReview((prevReview) => ({
                          ...prevReview,
                          review_content: e.target.value,
                        }));
                      }}
                      mb={6}
                      whiteSpace="pre-wrap"
                    />
                  ) : (
                    <Text>{review.review_content}</Text>
                  )}
                  <ButtonGroup
                    size="sm"
                    display="flex"
                    justifyContent="flex-end"
                    mt={5}
                  >
                    {isEditing &&
                    editingReview.review_id === review.review_id ? (
                      <>
                        <Button
                          border="1px solid #E1E1E1"
                          bgColor="white"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReview(editingReview);
                            setIsEditing(false);
                            setEditingReview(null);
                          }}
                        >
                          전송
                        </Button>
                        <Button
                          border="1px solid #E1E1E1"
                          bgColor="white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(false);
                            setEditingReview(null);
                          }}
                        >
                          취소 {/* TODO: 수정 로직 추가 */}
                        </Button>
                      </>
                    ) : (
                      <Button
                        border="1px solid #E1E1E1"
                        bgColor="white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setEditingReview(review);
                        }}
                      >
                        수정 {/* TODO: 수정 로직 추가 */}
                      </Button>
                    )}
                    <Button
                      border="1px solid #E1E1E1"
                      bgColor="white"
                      onClick={() => deleteReview(review.review_id)}
                    >
                      삭제
                    </Button>
                  </ButtonGroup>
                </CardBody>
              </Card>
            ))
          ) : (
            <Text textAlign="center" my={10}>
              리뷰 없음
            </Text>
          )}
        </VStack>
      </CardBody>
      <CardFooter display="flex" justifyContent="center" id="reviewSection">
        <Pagination pageInfo={pageInfo} />
      </CardFooter>
    </Card>
  );
}
