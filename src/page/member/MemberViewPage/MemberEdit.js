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
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { LoginContext } from "../../../component/LoginProvider";

export function MemberEdit() {
  // 인풋 css
  const inputStyle = {
    shadow: "1px 1px 3px 1px #dadce0 inset !important",
  };

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

  // readonly input 스타일
  const readOnlyStyle = {
    style: {
      boxShadow: "1px 1px 3px 2px #dadce0 inset",
      width: "500px",
      height: "50px",
      borderRadius: "6px",
      textIndent: "15px",
      fontSize: "16px",
    },
  };

  const { isAuthenticated } = useContext(LoginContext);

  const fileInputRef = useRef();

  // 맴버 고유 id --------------------------------------------------------------------------------
  const [id, setId] = useState("");

  // 맴버 이름 --------------------------------------------------------------------------------
  const [member_name, setMember_name] = useState("");

  // 맴버 로그인 id --------------------------------------------------------------------------------
  const [member_login_id, setMember_login_id] = useState("");

  // 맴버 핸드폰 번호 --------------------------------------------------------------------------------
  const [member_phone_number, setMember_phone_number] = useState("");
  const [member_phone_number1, setMember_phone_number1] = useState("");
  const [member_phone_number2, setMember_phone_number2] = useState("");
  const [member_phone_number3, setMember_phone_number3] = useState("");
  // 맴버 핸드폰 Ref --------------------------------------------------------------------------------
  const phoneInput2Ref = useRef();
  const phoneInput3Ref = useRef();

  // 맴버 이메일 ------------------------------------------------------------------------------------
  const [member_email, setMember_email] = useState("");
  const [member_email1, setMember_email1] = useState("");
  const [member_email2, setMember_email2] = useState("");

  // 주소 --------------------------------------------------------------------------------------
  const [member_post_code, setMember_post_code] = useState("");
  const [member_address, setMember_address] = useState("");
  const [member_detail_address, setMember_detail_address] = useState("");

  // 맴버 타입 --------------------------------------------------------------------------------------
  const [member_type, setMember_type] = useState("");

  // 회원 정보 변경 인식 --------------------------------------------------------------------------------------
  // true 면 수정하기 버튼 비활셩화 false 일때 수정하기 버튼 활성화 되게 함
  const [editChangeCheck, setEditChangeCheck] = useState(true);

  const navigate = useNavigate();

  const toast = useToast();

  // Daum Postcode 스크립트 URL
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  // Daum Postcode 팝업을 여는 함수
  const openPostcodePopup = useDaumPostcodePopup(scriptUrl);
  // 주소 검색 완료 핸들러
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setMember_address(fullAddress); // 선택된 주소를 상태에 저장
    setMember_post_code(data.zonecode);
    setEditChangeCheck(false);
  };

  // 회원 자기 소개 ----------------------------------------------------------------
  const [member_introduce, setMember_introduce] = useState("");

  // 회원 프로필 사진 ----------------------------------------------------------------
  // 이미지 이름
  const [file_name, setFile_name] = useState("");
  // 이미지 경로
  const [file_url, setFile_url] = useState("");
  // 이미지 타입
  const [image_type, setImage_type] = useState("");
  // 사진변경 체크박스 인식
  const [changeImageCheck, setChangeImageCheck] = useState(false);
  // 새로운 이미지
  const [file, setFile] = useState(null);
  // 이미지 업로드창 가능 불가능 하게 바꾸기
  const [fileInputStatus, setFileInputStatus] = useState(false);

  // 이메일 수정 중복 확인 번호 상태 (처음은 true -> 이메일이 변경 되면 false) -> true 상태여야 수정 하기가 활성화
  const [emailOverlapStatus, setEmailOverlapStatus] = useState(true);

  // 인증번호 발송 보일지 안보일지 상태
  const [sendCodeStatus, setSendCodeStatus] = useState(false);

  // 인증번호 입력 칸이 보일지 안보일지 상태
  const [inputRandomStatus, setInputRandomStatus] = useState(false);

  // 인증번호 생성
  const [randomNumber, setRandomNumber] = useState("");
  // 생성된 인증번호 비교군
  const [randomNumberCheck, setRandomNumberCheck] = useState("");

  // 인증 번호 확인 상태 값
  const [emailCodeCheckedState, setEmailCodeCheckedState] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    } else {
      axios.get("/api/member/memberInfo").then((response) => {
        setId(response.data.id);
        setMember_name(response.data.member_name);
        setMember_login_id(response.data.member_login_id);

        const phoneNumber = response.data.member_phone_number.split("-");
        setMember_phone_number1(phoneNumber[0]);
        setMember_phone_number2(phoneNumber[1]);
        setMember_phone_number3(phoneNumber[2]);

        const email = response.data.member_email.split("@");
        setMember_email1(email[0]);
        setMember_email2(email[1]);

        setMember_type(response.data.member_type);

        setMember_post_code(response.data.memberAddressDto.member_post_code);
        setMember_address(response.data.memberAddressDto.member_address);
        setMember_detail_address(
          response.data.memberAddressDto.member_detail_address,
        );

        // 회원 자기 소개
        setMember_introduce(response.data.member_introduce);

        // 회원 프로필 사진
        setFile_name(response.data.memberImageDto.file_name);
        setFile_url(response.data.memberImageDto.file_url);
        setImage_type(response.data.memberImageDto.image_type);
      });
    }
  }, [isAuthenticated]);

  // 이메일이나 핸드폰 번호가 input칸 하나라도 변경 되면 해당 데이터가 수정 되도록 작동 하는 useEffect ------------
  useEffect(() => {
    setMember_email(member_email1 + "@" + member_email2);
    setMember_phone_number(
      member_phone_number1 +
        "-" +
        member_phone_number2 +
        "-" +
        member_phone_number3,
    );
  }, [
    member_email1,
    member_email2,
    member_phone_number1,
    member_phone_number2,
    member_phone_number3,
  ]);

  // 주소 찾기 클릭시 ----------------------------------------------------------
  const handlePostCodeClick = () => {
    setMember_detail_address("");
    openPostcodePopup({ onComplete: handleComplete });
  };

  // 핸드폰 인풋 1 ---------------------------------------------------------------------------------------
  const handlePhoneInput1Change = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 3) {
      setMember_phone_number1(inputValue);
      setEditChangeCheck(false);
      if (inputValue.length === 3) {
        phoneInput2Ref.current.focus();
      }
    }
  };

  // 핸드폰 인풋 2 ---------------------------------------------------------------------------------------
  const handlePhoneInput2Change = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 4) {
      setMember_phone_number2(inputValue);
      setEditChangeCheck(false);
      if (inputValue.length === 4) {
        phoneInput3Ref.current.focus();
      }
    }
  };

  // 핸드폰 인풋 3 ---------------------------------------------------------------------------------------
  const handlePhoneInput3Change = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 4) {
      setMember_phone_number3(inputValue);
      setEditChangeCheck(false);
    }
  };

  // 수정 하기 버튼 클릭시 ----------------------------------------------------------
  async function handleEditClick() {
    try {
      await axios.put("/api/member/edit", {
        member: {
          id,
          member_name,
          member_login_id,
          member_phone_number,
          member_email,
          member_type,
          member_introduce,
        },
        memberAddress: {
          member_address,
          member_detail_address,
          member_post_code,
        },
      });
      await axios.putForm("/api/memberImage/editMemberImage", {
        file,
        image_type,
      });
      toast({
        description: "회원 정보가 수정 되었습니다.",
        status: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errorMessage = error.response.data[0];
        toast({
          description: errorMessage,
          status: "error",
        });
      } else {
        // 기타 오류에 대한 처리
        toast({
          description: "정보 수정중 문제가 발생하였습니다.",
          status: "error",
        });
      }
    } finally {
      navigate("/memberPage/memberInfo/memberManagePage");
    }
  }

  // 비밀번호 수정 버튼 클릭시 ---------------------------------------------
  function handleEditPasswordClick() {
    navigate("/memberPage/passwordEdit");
  }

  // 사진 변경 체크 박스 클릭시 로직
  function handleImageChangeClick(e) {
    setChangeImageCheck(e.target.checked);
    // 사진 변경을 다시 해제 할 경우
    if (e.target.checked === false) {
      setFile(null);
    }
  }

  // 이메일 중복 확인 클릭시 로직
  function handleEmailCheckClick() {
    axios
      .get("/api/memberEmail/emailCheck", {
        params: {
          member_email,
        },
      })
      .then(() => {
        toast({ description: "사용 가능한 이메일 입니다.", status: "success" });
      })
      .then(() => {
        setSendCodeStatus(true);
        setEmailOverlapStatus(true);
      })
      .catch(() => {
        toast({ description: "이미 사용중인 이메일 입니다.", status: "error" });
      });
  }

  // 인증번호 발송 클릭
  function handleSendEmailCodeClick() {
    setRandomNumberCheck("");
    const newRandomNumber = Math.floor(Math.random() * 100000); // 새로운 난수 생성
    setRandomNumber(newRandomNumber);
    setInputRandomStatus(true);

    axios
      .post("/api/memberEmail/sendCodeMail", {
        member_email,
        message: newRandomNumber,
      })
      .then(() => {
        toast({
          description: "이메일로 인증번호가 전송되었습니다",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "인증번호 발송중 문제가 발생하였습니다.",
          status: "error",
        });
      });
  }

  // 인증 번호 확인 클릭
  function handleCodeCheckClick() {
    if (randomNumberCheck === randomNumber.toString()) {
      toast({ description: "인증번호가 맞았습니다.", status: "success" });
      setEmailCodeCheckedState(true);
    } else {
      toast({ description: "인증번호가 틀렸습니다.", status: "error" });
      setEmailCodeCheckedState(false);
    }
  }

  const labelStyle = {
    fontSize: "md",
    fontWeight: "bold",
    w: "100px",
    minW: "100px",
    maxW: "100px",
    h: "50px",
    lineHeight: "50px",
  };

  return (
    <Card mx={{ base: 0, md: "10%", lg: "15%", xl: "25%" }}>
      <CardHeader textAlign="left" mt={4} fontSize="2rem" fontWeight="bold">
        회원 정보 수정
      </CardHeader>
      <CardBody>
        {/* 프로필 사진 */}
        <FormControl mt={2}>
          <Flex justifyContent="flex-start" mb={5}>
            <FormLabel {...labelStyle}>프로필 사진</FormLabel>
            <Flex flexDir="column">
              <Image
                src={file_url}
                style={{
                  borderRadius: "100%",
                  blockSize: "200px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
                alt={file_name}
              />
              <Checkbox
                mt={5}
                size="lg"
                colorScheme="orange"
                onChange={handleImageChangeClick}
              >
                사진을 변경합니다.
              </Checkbox>
            </Flex>
          </Flex>
          {image_type === "default" && (
            <FormHelperText ml={"180px"}>기본 이미지 입니다.</FormHelperText>
          )}
        </FormControl>

        {/* 새 프로필 사진 등록 하기 */}
        {changeImageCheck && (
          <FormControl mt={5}>
            <Flex>
              <FormLabel {...labelStyle}>사진 선택</FormLabel>
              <Flex flexDir="column">
                <Input
                  ref={fileInputRef}
                  mt={2}
                  px={0}
                  border="none"
                  type="file"
                  accept="image/*"
                  h="50px"
                  borderRadius="0"
                  alignItems="center"
                  isDisabled={fileInputStatus}
                  onChange={(e) => {
                    setEditChangeCheck(false);
                    setFile(e.target.files[0]);
                    setImage_type("new");
                  }}
                />
                <Checkbox
                  mt={-2}
                  size="md"
                  colorScheme="orange"
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      // 기본 이미지 체크 상태
                      setEditChangeCheck(false);
                      setFile(null); // 체크 전 추가 된 이미지 지우기
                      fileInputRef.current.value = ""; // 추가된 이미지 지운후 client에도 보이게 적용
                      setFileInputStatus(true); // 기본이미지로 사용 할꺼 라면 파일 선택 못 하도록 막기
                      setImage_type("default");
                    } else {
                      // 기본 이미지 체크가 해제된 상태
                      setEditChangeCheck(true);
                      fileInputRef.current.value = ""; // 기본 이미지가 해제 되면 다시 이미지 선택을 인식 시키도록
                      setFileInputStatus(false); // 기본 이미지 체크가 해제 되면 다시 파일 선택하도록 하기
                      setImage_type("new");
                    }
                  }}
                >
                  기본 이미지
                </Checkbox>
              </Flex>
            </Flex>
          </FormControl>
        )}

        {/* 이름 */}
        <FormControl mt={6}>
          <Flex justifyContent="center">
            <FormLabel {...labelStyle}>이름</FormLabel>
            <Input px={0} h="50px" border="none" readOnly value={member_name} />
          </Flex>
        </FormControl>

        {/* 아이디 */}
        <FormControl mt={2}>
          <Flex justifyContent="center">
            <FormLabel {...labelStyle}>아이디</FormLabel>
            <Input
              px={0}
              h="50px"
              border="none"
              readOnly
              value={member_login_id}
            />
          </Flex>
        </FormControl>

        {/* 비밀번호 */}
        <FormControl
          mt={2}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormLabel {...labelStyle}>비밀번호</FormLabel>
          <Button
            mt={-2}
            type="password"
            h="50px"
            _hover={{ bgColor: "orange", color: "white" }}
            onClick={handleEditPasswordClick}
          >
            비밀번호 수정
          </Button>
        </FormControl>

        {/* 핸드폰번호 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>휴대폰번호</FormLabel>
          <Box display="flex">
            <Input
              type="number"
              id="member_phone_number1"
              maxLength={3}
              textAlign="center"
              h="50px"
              maxW="130px"
              value={member_phone_number1}
              onChange={handlePhoneInput1Change}
            />
            <Box fontSize="lg" lineHeight="50px" mx={3}>
              -
            </Box>
            <Input
              type={"number"}
              id="member_phone_number2"
              textAlign="center"
              ref={phoneInput2Ref}
              maxLength={4}
              h="50px"
              maxW="130px"
              value={member_phone_number2}
              onChange={handlePhoneInput2Change}
            />
            <Box fontSize="lg" lineHeight="50px" mx={3}>
              -
            </Box>
            <Input
              type="number"
              id="member_phone_number3"
              ref={phoneInput3Ref}
              textAlign="center"
              maxLength={4}
              h="50px"
              maxW="130px"
              value={member_phone_number3}
              onChange={handlePhoneInput3Change}
            />
          </Box>
        </FormControl>

        {/* 이메일 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>이메일</FormLabel>
          <Input
            id="member_email1"
            h="50px"
            value={member_email1}
            onChange={(e) => {
              setMember_email1(e.target.value);
              setEmailOverlapStatus(false);
              setSendCodeStatus(false);
              setEmailCodeCheckedState(false);
              setEditChangeCheck(false);
            }}
          />
          <Box fontSize="lg" lineHeight="50px" mx={3}>
            @
          </Box>
          <Input
            id="member_email2"
            h={"50px"}
            value={member_email2}
            onChange={(e) => {
              setMember_email2(e.target.value);
              setEmailOverlapStatus(false);
              setSendCodeStatus(false);
              setEditChangeCheck(false);
            }}
          />
          <Button
            vairant="undefined"
            _hover={{ bgColor: "orange", color: "white" }}
            isDisabled={emailOverlapStatus}
            minW="80px"
            ml={3}
            h="50px"
            onClick={handleEmailCheckClick}
          >
            중복확인
          </Button>
        </FormControl>
        {/* 인증번호 발송 버튼 */}
        {sendCodeStatus && (
          <Flex justifyContent={"center"} mt={2} mb={4}>
            <Button
              w="full"
              h="50px"
              _hover={{
                bgColor: "orange",
                color: "white",
              }}
              onClick={handleSendEmailCodeClick}
            >
              인증번호 발송
            </Button>
          </Flex>
        )}

        {/* 인증번호 입력 */}
        {inputRandomStatus && (
          <FormControl mt={2} display="flex">
            <FormLabel {...labelStyle}>인증번호 입력</FormLabel>
            <Input
              placeholder="인증번호 입력"
              h="50px"
              type="number"
              value={randomNumberCheck}
              onChange={(e) => {
                setRandomNumberCheck(e.target.value);
              }}
            />
            <Button
              isDisabled={emailCodeCheckedState}
              ml={3}
              minW="100px"
              h="50px"
              onClick={handleCodeCheckClick}
              _hover={{
                bgColor: "orange",
                color: "white",
              }}
            >
              인증번호 확인
            </Button>
          </FormControl>
        )}

        {/* 우편번호 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>우편번호</FormLabel>
          <Input h="50px" readOnly value={member_post_code} />
          <Button
            minW="100px"
            h="50px"
            ml={3}
            onClick={handlePostCodeClick}
            bgColor="orange"
            color="white"
          >
            주소검색
          </Button>
        </FormControl>

        {/* 주소 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>주소</FormLabel>
          <Input h="50px" readOnly value={member_address} />
        </FormControl>

        {/* 상세주소 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>상세주소</FormLabel>
          <Input
            h="50px"
            value={member_detail_address}
            onChange={(e) => {
              setMember_detail_address(e.target.value);
              setEditChangeCheck(false);
            }}
          />
        </FormControl>

        {/* 자기소개 */}
        <FormControl mt={2} display="flex">
          <FormLabel {...labelStyle}>자기소개</FormLabel>
          <Textarea
            h="150px"
            value={member_introduce}
            onChange={(e) => {
              setMember_introduce(e.target.value);
              setEditChangeCheck(false);
            }}
          />
        </FormControl>
      </CardBody>

      <CardFooter display="flex">
        <ButtonGroup w="full" justifyContent="center" spacing={5}>
          <Button w="40%" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button
            w="40%"
            bgColor="orange"
            color="white"
            onClick={handleEditClick}
            isDisabled={
              editChangeCheck || !emailOverlapStatus || !emailCodeCheckedState
            }
          >
            수정
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
