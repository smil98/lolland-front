import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../component/LoginProvider";

export function MemberManage() {
  const [member, setMember] = useState(null);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const navigate = useNavigate();

  const { isAuthenticated, fetchLogin } = useContext(LoginContext);

  // 버튼 css
  const buttonStyle = {
    background: "none",
    border: "1px solid black",
    variant: "none",
    color: "black",
    borderRadius: 0,
    _hover: { border: "1px solid orange", color: "white", bgColor: "orange" },
  };

  // FormLabel 스타일
  const formLabelStyle = {
    width: "130px",
    height: "50px",
    lineHeight: "50px",
    fontSize: "md",
    fontWeight: "bold",
  };

  // readonly input 스타일
  const readOnlyStyle = {
    height: "50px",
    py: "0",
    textIndent: "15px",
    fontSize: "md",
    border: "none",
    _focus: {
      border: "none",
      shadow: "none",
    },
  };

  // TextArea 스타일
  const textAreaStyle = {
    ml: "15px",
    h: "150px",
    border: "none",
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    } else {
      axios.get("/api/member/memberInfo").then((response) => {
        setMember(response.data);
      });
    }
  }, [isAuthenticated]);

  if (member == null) {
    return <Spinner />;
  }

  if (!isAuthenticated()) {
    return null;
  }

  // 회원 탈퇴 버튼 클릭
  function handleMemberDeleteClick() {
    // 탈퇴 처리 로직 실행
    axios
      .delete("/api/member")
      .then(() =>
        toast({ description: "회원자격을 상실 하셨습니다.", status: "error" }),
      )
      .then(() => navigate("/"))
      .catch(() =>
        toast({
          description: "탈퇴 처리중 문제가 발생하였습니다.",
          colorScheme: "gray",
        }),
      );

    // 탈퇴처리 완료 후 로그아웃 처리
    axios
      .post("/api/member/logout")
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그 아웃 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => fetchLogin());
  }

  return (
    <>
      <Card w="full" mx={{ base: 0, md: "10%", lg: "15%", xl: "25%" }}>
        <CardHeader
          display="flex"
          alignItems="center"
          fontWeight="bold"
          textAlign="left"
          fontSize="2xl"
          className="specialHeadings"
        >
          <Text as="span" fontSize="3xl" color="orange" mr={1}>
            {member.member_name}
          </Text>
          님 정보 입니다.
        </CardHeader>
        <CardBody px={10}>
          {/* 프로필 사진 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>프로필 사진</FormLabel>

              <img
                src={member.memberImageDto.file_url}
                style={{
                  borderRadius: "100%",
                  blockSize: "250px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
                alt={member.memberImageDto.file_name}
              />
            </Flex>
            {member.memberImageDto.image_type === "default" && (
              <FormHelperText ml={"110px"}>기본 이미지입니다.</FormHelperText>
            )}
          </FormControl>

          {/* 이름 */}
          <FormControl mt={6}>
            <Flex>
              <FormLabel {...formLabelStyle}>이름</FormLabel>
              <Input {...readOnlyStyle} readOnly value={member.member_name} />
            </Flex>
          </FormControl>

          {/* 아이디 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>아이디</FormLabel>
              <Input
                readOnly
                {...readOnlyStyle}
                value={member.member_login_id}
              />
            </Flex>
          </FormControl>

          {/* 휴대폰 번호 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>휴대폰번호</FormLabel>
              <Input
                {...readOnlyStyle}
                readOnly
                value={member.member_phone_number}
              />
            </Flex>
          </FormControl>

          {/* 이메일 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>이메일</FormLabel>
              <Input {...readOnlyStyle} readOnly value={member.member_email} />
            </Flex>
          </FormControl>

          {/* 우편번호 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>우편번호</FormLabel>
              <Input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_post_code}
              />
            </Flex>
          </FormControl>

          {/* 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>주소</FormLabel>
              <Input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_address}
              />
            </Flex>
          </FormControl>

          {/* 상세 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>상세주소</FormLabel>
              <Input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_detail_address}
              />
            </Flex>
          </FormControl>

          {/* 자기 소개 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>자기소개</FormLabel>
              {member.member_introduce.length !== 0 ? (
                <Textarea
                  readOnly
                  {...textAreaStyle}
                  value={member.member_introduce}
                />
              ) : (
                <Textarea
                  {...textAreaStyle}
                  readOnly
                  value={"자기 소개를 작성해 주세요."}
                />
              )}
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter display="flex" justifyContent="center">
          {/* 내 주소록 조회 버튼 */}
          <ButtonGroup w="80%" display="flex" justifyContent="space-between">
            <Button
              maxW="40%"
              {...buttonStyle}
              onClick={() => navigate("/memberPage/addressInfo")}
            >
              내 주소록 조회하기
            </Button>
            <Flex gap={2} maxW="60%">
              <Button
                {...buttonStyle}
                onClick={() => navigate("/memberPage/memberEdit")}
              >
                수정하기
              </Button>
              <Button
                bg="red"
                color="white"
                borderRadius="none"
                onClick={onOpen}
              >
                회원 탈퇴
              </Button>
            </Flex>
          </ButtonGroup>
        </CardFooter>
      </Card>

      {/* 삭제 모달창 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 탈퇴 😭</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>정말 탈퇴 하시겠습니까?</Box>
            <Box color={"red"}>탈퇴 버튼 클릭시 즉시 탈퇴 처리 됩니다.</Box>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme={"red"} onClick={handleMemberDeleteClick}>
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
