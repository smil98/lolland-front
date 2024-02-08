import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../component/LoginProvider";
import { ScreenContext } from "../../component/ScreenContext";

export function AdminView() {
  const { isAdmin } = useContext(LoginContext);
  const { isSmallScreen } = useContext(ScreenContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [isAdmin]);

  if (!isAdmin()) {
    return null;
  }

  return (
    <Flex
      position="relative"
      flexDir={isSmallScreen ? "column" : "row"}
      justifyContent="space-between"
    >
      <AdminNavBar />
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
  );
}
