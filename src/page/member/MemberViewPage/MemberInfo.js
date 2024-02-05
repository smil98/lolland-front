import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../../../component/LoginProvider";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MemberInfo() {
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

  const [password, setPassword] = useState("");

  const toast = useToast();

  const navigate = useNavigate();

  const { isAuthenticated } = useContext(LoginContext);

  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [location]);

  if (!isAuthenticated()) {
    return null;
  }

  function handleMemberInfoClick() {
    axios
      .get("/api/member/checkPassword", {
        params: {
          password,
        },
      })
      .then(() =>
        toast({
          description: "정보가 일치하여 회원 정보를 조회 합니다.",
          status: "success",
        }),
      )
      .then(() => navigate("/memberPage/memberInfo/memberManagePage"))
      .catch(() => {
        toast({
          description: "비밀번호가 틀립니다.",
          status: "error",
        });
      });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleMemberInfoClick();
    }
  };
  return (
    <Card w="350px" shadow="md">
      <CardHeader
        mt={4}
        textAlign="center"
        fontSize="2rem"
        fontWeight="bold"
        alignItems="center"
      >
        <Text as="span" mr={3}>
          <FontAwesomeIcon icon={faShieldHalved} />
        </Text>
        회원 정보 확인
      </CardHeader>
      <CardBody>
        <Box mb={8}>정보 보호를 위해 비밀번호를 확인합니다.</Box>
        <Input
          type="password"
          w="270px"
          onKeyDown={handleKeyDown}
          value={password}
          border="1px solid black"
          borderRadius="none"
          _hover="1px solid black"
          _focus={{ border: "1px solid black", shadow: "none" }}
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Flex justifyContent="center" gap={5} mt={8} mb={4}>
          <Button
            w="40%"
            variant="undefined"
            border="1px solid black"
            borderRadius="none"
            color="black"
            _hover={{
              bgColor: "orange",
              color: "white",
              border: "1px solid orange",
            }}
            onClick={() => navigate("/")}
          >
            취소
          </Button>
          <Button
            w="40%"
            border="1px solid black"
            bgColor="black"
            color="white"
            borderRadius="none"
            variant="undefined"
            _hover={{
              bgColor: "orange",
              color: "white",
              border: "1px solid orange",
            }}
            onClick={handleMemberInfoClick}
          >
            확인
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
}
