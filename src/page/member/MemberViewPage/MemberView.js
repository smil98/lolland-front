import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { MemberNavBar } from "./MemberNavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MemberNavBarTest } from "../../admin/MemberNavBarTest";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../../component/LoginProvider";
import { ScreenContext } from "../../../component/ScreenContext";

export function MemberView() {
  const { isAuthenticated } = useContext(LoginContext);
  const { isSmallScreen } = useContext(ScreenContext);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [location]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Card shadow="none">
      <Flex
        position="relative"
        flexDir={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
      >
        <MemberNavBarTest />
        <Box
          w="full"
          minH={isSmallScreen ? "full" : "560px"}
          my={isSmallScreen ? 2 : 5}
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          textAlign="center"
        >
          <Outlet />
        </Box>
      </Flex>
    </Card>
  );
}
