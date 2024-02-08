import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ScreenContext } from "../../component/ScreenContext";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    console.log(params.get("p"));
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

export function QnaAnswer() {
  const [questionList, setQuestionList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const location = useLocation();
  const { isSmallScreen } = useContext(ScreenContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);

    axios
      .get("/api/qna/view?" + params)
      .then((response) => {
        setQuestionList(response.data.questionList);
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
            description: "문의 불러오는 도중 에러 발생, 관리자에게 문의하세요",
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

  return (
    <VStack spacing={5} w="full">
      <Card w="full" mx={{ base: "0", md: "10%", lg: "15%", xl: "20%" }}>
        <CardHeader
          fontSize="2xl"
          textAlign="left"
          fontWeight="bold"
          className="specialHeadings"
        >
          <Text as="span" mr={3} color="orange">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Text>
          문의 목록
        </CardHeader>
        <Box mx={5} border="1px solid black" p={2}>
          최근 수정되었거나 답변이 없는 문의 순으로 불러옵니다.
        </Box>
        <CardBody>
          {isSmallScreen ? (
            <VStack>
              {questionList && questionList.length > 0 ? (
                questionList.map((q) => (
                  <Card
                    key={q.question_id}
                    onClick={() => {
                      navigate(`write/${q.question_id}`);
                      const targetElement =
                        document.getElementById("answerSection");
                      if (targetElement) {
                        targetElement.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                    w="full"
                    textAlign="left"
                    border="1px solid #F1F1F1"
                  >
                    <CardBody>
                      <Text display="flex" justifyContent="space-between">
                        {q.product_name.length > 40
                          ? q.product_name.slice(0, 40) + "..."
                          : q.product_name}
                        <Text as="span" color="#BBBBBB" ml={1}>
                          {formattedDate(q.question_reg_time)}
                        </Text>
                      </Text>
                      <Text fontWeight="bold" fontSize="md" className="labels">
                        {q.question_title}
                      </Text>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Card p={5}>등록된 문의가 없습니다</Card>
              )}
            </VStack>
          ) : (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th textAlign="center">상품명</Th>
                    <Th textAlign="center">문의 제목</Th>
                    <Th textAlign="center">문의 등록일자</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {questionList && questionList.length > 0 ? (
                    questionList.map((q) => (
                      <Tr
                        key={q.question_id}
                        onClick={() => {
                          navigate(`write/${q.question_id}`);
                          const targetElement =
                            document.getElementById("answerSection");
                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <Td textAlign="center">
                          {q.product_name.length > 40
                            ? q.product_name.slice(0, 40) + "..."
                            : q.product_name}
                        </Td>
                        <Td textAlign="center">{q.question_title}</Td>
                        <Td textAlign="center">
                          {formattedDate(q.question_reg_time)}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={3} h={5} textAlign="center">
                        아직 등록된 문의가 없습니다
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Pagination pageInfo={pageInfo} />
        </CardFooter>
      </Card>
      <Outlet />
    </VStack>
  );
}
