import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  IconButton,
  Input,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slide,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import * as PropTypes from "prop-types";
import { ScreenContext } from "../../component/ScreenContext";

// 관리자 회원 관리 페이지 버튼
function AdminMemberPageButton({
  pageBg,
  pageColor,
  pageHove,
  pageNumber,
  children,
}) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClickButton() {
    params.set("page", pageNumber);
    navigate("?" + params);
  }

  return (
    <Button
      ml={2}
      bg={pageBg}
      color={pageColor}
      _hover={pageHove}
      onClick={handleClickButton}
    >
      {children}
    </Button>
  );
}

// 페이지 버튼
function AdminMemberPagination({ pageInfo }) {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const listPage = params.get("page");

  const pageNumbers = [];

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mt={10} mb={10}>
      {pageInfo.prevPageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          onClick={() => navigate("?page=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <AdminMemberPageButton
          pageBg={listPage === pageNumber.toString() ? "black" : "white"}
          pageColor={listPage === pageNumber.toString() ? "white" : "black"}
          pageHove={{ backgroundColor: "black", color: "whitesmoke" }}
          key={pageNumber}
          pageNumber={pageNumber}
        >
          {pageNumber}
        </AdminMemberPageButton>
      ))}
      {pageInfo.nextPageNumber && (
        <Button
          bg={"white"}
          color={"black"}
          _hover={{ backgroundColor: "black", color: "whitesmoke" }}
          ml={2}
          onClick={() => navigate("?page=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </Button>
      )}
    </Box>
  );
}

// 회원 이름으로 찾기 버튼
function SearchMember() {
  // 인풋 css
  const inputStyle = {
    border: "1px solid black",
    borderRadius: 0,
    _hover: { border: "1px solid black" },
    _focus: { border: "2px solid orange", shadow: "none" },
    placeholder: "검색어 입력",
  };

  const [keyword, setKeyword] = useState("");
  const [findType, setFindType] = useState("id");

  const navigate = useNavigate();

  // 회원명 검색 클릭
  function handleSearch() {
    const params = new URLSearchParams();
    params.set(findType, keyword);

    navigate("/adminPage/memberList?" + params);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Flex
      justifyContent="center"
      mx={{ base: "5%", md: "10%", lg: "15%" }}
      gap={2}
    >
      <Menu>
        <MenuButton
          fontWeight="normal"
          {...inputStyle}
          as={Button}
          rightIcon={<ChevronDownIcon />}
          minW="100px"
          h="35px"
          bg="white"
          border="1px solid gray"
        >
          {findType === "id" && "아이디"}
          {findType === "name" && "이름"}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setFindType("id")}>아이디</MenuItem>
          <MenuItem onClick={() => setFindType("name")}>이름</MenuItem>
        </MenuList>
      </Menu>
      <Input
        border="1px solid black"
        borderRadius={0}
        h="35px"
        _hover={{ border: "1px solid black" }}
        _focus={{ border: "2px solid orange", shadow: "none" }}
        placeholder="검색어 입력"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        icon={<FontAwesomeIcon icon={faSearch} />}
        border="1px solid black"
        borderRadius={0}
        variant="none"
        color="white"
        bgColor="black"
        minW="80px"
        h="35px"
        _hover={{ bgColor: "orange", border: "1px solid orange" }}
        onClick={handleSearch}
      />
    </Flex>
  );
}

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [selectMember, setSelectMember] = useState("");
  const { isSmallScreen } = useContext(ScreenContext);

  // 회원 탈퇴 처리 인식
  const [checkMember, setCheckMember] = useState(false);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    axios
      .get("/api/member/listAll?" + params)
      .then((response) => {
        setMemberList(response.data.allMember);
        setPageInfo(response.data.pageInfo);
      })
      .catch(() => {
        toast({
          description: "회원 목록 조회에 실패 했습니다.",
          status: "error",
        });
      })
      .finally(() => {
        setCheckMember(false);
      });
  }, [checkMember, location]);

  // 삭제 버튼 클릭시 동작
  const handleMemberDeleteClick = (e) => {
    setSelectMember(e);
    onOpen();
  };

  // 모달내 삭제 버튼 클릭시 실제 삭제
  const handleModalDeleteClick = (e) => {
    axios
      .delete("/api/member/DeleteMember/" + e.id)
      .then(() => {
        toast({
          description: e.member_login_id + " 님 이 삭체 처리 되었습니다.",
          status: "success",
        });
      })
      .then(() => {
        setCheckMember(true);
      })
      .catch(() => {
        toast({
          title: "탈퇴는 관리자만 가능합니다.",
          description: "로그인 상태를 확인해주세요.",
          status: "error",
        });
      })
      .finally(() => onClose());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <Card w="full" mx={{ base: "0", md: "3%", xl: "15%" }}>
      <CardHeader>
        <Text
          fontSize="2xl"
          textAlign="left"
          fontWeight="bold"
          className="specialHeadings"
          mb={5}
        >
          회원 목록
        </Text>
        <SearchMember />
      </CardHeader>
      <CardBody p={3}>
        {isSmallScreen ? (
          <Accordion allowMultiple>
            {memberList.map((member) => (
              <AccordionItem key={member.id}>
                <Text>
                  <AccordionButton _expanded={{ bgColor: "gray.200" }}>
                    <Text flex="1" textAlign="left">
                      {member.member_login_id}
                    </Text>
                    <Tooltip hasArrow label="탈퇴 처리" placement="top">
                      <IconButton
                        colorScheme="red"
                        variant="ghost"
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMemberDeleteClick(member);
                        }}
                      />
                    </Tooltip>
                  </AccordionButton>
                </Text>
                <AccordionPanel textAlign="left">
                  <List spacing={1}>
                    <ListItem display="flex">
                      <Text as="span" w="80px" mr={3} fontWeight="bold">
                        아이디
                      </Text>
                      {member.member_login_id}
                    </ListItem>
                    <ListItem display="flex">
                      <Text as="span" w="80px" mr={3} fontWeight="bold">
                        이름
                      </Text>
                      {member.member_name}
                    </ListItem>
                    <ListItem display="flex">
                      <Text as="span" w="80px" mr={3} fontWeight="bold">
                        휴대폰번호
                      </Text>
                      {member.member_phone_number}
                    </ListItem>
                    <ListItem display="flex">
                      <Text as="span" w="80px" mr={3} fontWeight="bold">
                        이메일
                      </Text>
                      {member.member_email}
                    </ListItem>
                    <ListItem display="flex">
                      <Text as="span" w="80px" mr={3} fontWeight="bold">
                        가입일
                      </Text>
                      {formatDate(member.reg_time)}
                    </ListItem>
                  </List>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th textAlign="center">아이디</Th>
                <Th textAlign="center">이름</Th>
                <Th textAlign="center"> 핸드폰번호</Th>
                <Th textAlign="center"> 이메일</Th>
                <Th textAlign="center">가입일</Th>
                <Th textAlign="center">탈퇴</Th>
              </Tr>
            </Thead>
            <Tbody>
              {memberList.map((member) => {
                return (
                  <Tr key={member.id}>
                    <Td textAlign={"center"}>{member.member_login_id}</Td>
                    <Td textAlign={"center"}>{member.member_name}</Td>
                    <Td textAlign={"center"}>{member.member_phone_number}</Td>
                    <Td textAlign={"center"}>{member.member_email}</Td>
                    <Td textAlign={"center"}>{formatDate(member.reg_time)}</Td>
                    <Td textAlign={"center"}>
                      <IconButton
                        colorScheme="red"
                        variant="ghost"
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                        onClick={() => handleMemberDeleteClick(member)}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
        <AdminMemberPagination pageInfo={pageInfo} />
      </CardBody>

      {/* 탈퇴 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="specialHeadings">회원 탈퇴 처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              <Text as="span" fontSize="2xl" fontWeight="bold">
                {selectMember.member_login_id}
              </Text>
              님을 탈퇴 처리하시겠습니까?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              닫기
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleModalDeleteClick(selectMember);
              }}
            >
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
