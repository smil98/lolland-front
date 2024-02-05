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
    <Card shadow={"none"}>
      <Flex
        position="relative"
        flexDir={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
      >
        <MemberNavBarTest />
        <Box
          w="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Outlet />
        </Box>
      </Flex>
    </Card>
  );
}
