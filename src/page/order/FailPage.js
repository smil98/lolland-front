import React from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FailPage(props) {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message");
  const navigate = useNavigate();

  let code = "";
  let message = "";

  try {
    const startIndex = errorMessage.indexOf("{");
    const endIndex = errorMessage.lastIndexOf("}");
    const jsonString = errorMessage.substring(startIndex, endIndex + 1);
    const errorData = JSON.parse(jsonString);
    code = errorData.code || "";
    message = errorData.message || "";
  } catch (error) {
    console.error("Error parsing error message:", error);
    message = errorMessage;
  }

  return (
    <Card
      mx="auto"
      w={{ base: "90%", md: "50%", lg: "40%", xl: "30%" }}
      my="5%"
      maxW="450px"
      shadow="md"
    >
      <CardHeader textAlign="center">
        <Text color="#EC7500" fontSize="6xl">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </Text>
        <Heading>결제에 실패했습니다</Heading>
      </CardHeader>
      <CardBody my={5}>
        <Box bgColor="#FDF1E5" color="#EC7500" p={3} borderRadius={10}>
          <Text fontSize="sm">
            ERROR CODE:
            <Text as="span" fontWeight="bold" ml={2}>
              {code}
            </Text>
          </Text>
          <Text fontSize="sm">
            실패 사유:{" "}
            <Text as="span" fontWeight="bold">
              {message}
            </Text>
          </Text>
        </Box>
      </CardBody>
      <CardFooter display="flex" justifyContent="center" gap={3}>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
        <Button onClick={() => navigate("/pay")}>결제창으로 돌아가기</Button>
      </CardFooter>
    </Card>
  );
}

export default FailPage;
