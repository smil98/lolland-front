import { createContext } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

export const ScreenContext = createContext(null);

function ScreenProvider({ children }) {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <ScreenContext.Provider value={{ isSmallScreen }}>
      {children}
    </ScreenContext.Provider>
  );
}

export default ScreenProvider;
