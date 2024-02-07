import {
  background,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessRook, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { ScreenContext } from "../../component/ScreenContext";

export function MemberLogin() {
  const { isAuthenticated, fetchLogin } = useContext(LoginContext);

  // 회원 로그인 정보 입력
  const [member_login_id, setMember_login_id] = useState("");
  const [member_password, setMember_password] = useState("");
  // 비밀번호 보여주기
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  const location = useLocation();

  // 이미 로그인 된 회원 이라면 메인페이지로 이동 시키기
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, location]);

  // 이미 로그인된 회원 은 아무것도 출력 하지 않게 한다.
  if (isAuthenticated()) {
    return null;
  }

  // 로그인 버튼 클릭
  function handleLoginClick() {
    axios
      .post("/api/member/login", {
        member_login_id,
        member_password,
      })
      .then(() => {
        toast({ description: "로그인에 성공 하였습니다.", status: "success" });
        navigate(-1);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          let errorMessage = error.response.data;
          toast({
            description: errorMessage,
            status: "error",
          });
        } else {
          // 기타 오류에 대한 처리
          toast({
            description: "로그인 중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        fetchLogin();
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <Card mx={{ base: "full", md: "15%", lg: "20%", xl: "25%" }} my="5%">
      <CardHeader
        textAlign="center"
        fontSize="4xl"
        alignItems="center"
        className="logo"
        mt={5}
      >
        <IconButton
          icon={<FontAwesomeIcon icon={faChessRook} />}
          color="white"
          bgColor="orange"
          size="sm"
          mt={-2}
          mr={2}
          variant="undefined"
        />
        LOLLAND
      </CardHeader>
      <CardBody>
        <FormControl>
          <Flex justifyContent="center" alignItems="center" mx="5%">
            <FormLabel w="20%" h="100%" fontSize="md" lineHeight="50px" my="1%">
              아이디
            </FormLabel>
            <Input
              h="50px"
              lineHeight="50px"
              borderRadius="full"
              value={member_login_id}
              placeholder="아이디"
              onChange={(e) => setMember_login_id(e.target.value)}
            />
          </Flex>
        </FormControl>
        <FormControl mt={2}>
          <Flex justifyContent="center" alignItems="center" mx="5%">
            <FormLabel w="20%" h="100%" fontSize="md" lineHeight="50px" my="1%">
              비밀번호
            </FormLabel>
            <InputGroup>
              <Input
                placeholder="비밀번호"
                onKeyDown={handleKeyDown}
                value={member_password}
                type={showPassword ? "text" : "password"}
                h="50px"
                borderRadius="full"
                lineHeight="50px"
                onChange={(e) => setMember_password(e.target.value)}
              />
              <InputRightElement width="5rem" h="50px">
                <IconButton
                  isDisabled={member_password.length <= 0}
                  w="3rem"
                  size="md"
                  color="gray.300"
                  variant="undefined"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </FormControl>
        <FormControl mt={5}>
          <Flex justifyContent={"center"}>
            <Button
              mx="5%"
              w="full"
              h="50px"
              onClick={handleLoginClick}
              bgColor="orange"
              color="white"
            >
              로그인
            </Button>
          </Flex>
        </FormControl>
        <FormControl mt={4}>
          <Flex justifyContent={"center"}>
            <Button
              w="200px"
              h="20px"
              variant="undefined"
              onClick={() => navigate("/findId")}
            >
              아이디 찾기
            </Button>
            <Box>|</Box>
            <Button
              w="200px"
              h="20px"
              variant="undefined"
              onClick={() => navigate("/findPassword")}
            >
              비밀번호 찾기
            </Button>
          </Flex>
        </FormControl>
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <Button
          mx="5%"
          w="full"
          h="50px"
          color="black"
          bg="whitesmoke"
          onClick={() => navigate("/signup")}
        >
          회원 가입하기
        </Button>
      </CardFooter>
    </Card>
  );
}
