import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function GameBoardListArticle() {
  const [pc, setPc] = useState(null);
  const [console, setConsole] = useState(null);
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    axios.get("/api/gameboard/pc").then((response) => {
      setPc(response.data);

      axios.get("/api/gameboard/console").then((response) => {
        setConsole(response.data);
      });

      axios.get("/api/gameboard/mobile").then((response) => {
        setMobile(response.data);
      });
    });
  }, []);

  return (
    <Card border="1px solid #F1F1F1" shadow="base">
      <CardHeader
        className="specialHeadings"
        fontWeight="bold"
        color="orange"
        fontSize="2xl"
        textAlign="center"
      >
        게임 관련 기사
      </CardHeader>
      <CardBody>
        <Tabs colorScheme="orange" isFitted variant="enclosed">
          <TabList mb={5}>
            <Tab fontSize="md" fontWeight="bold">
              PC
            </Tab>
            <Tab fontSize="md" fontWeight="bold">
              Console
            </Tab>
            <Tab fontSize="md" fontWeight="bold">
              Mobile
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {pc &&
                  pc.items !== null &&
                  pc.items.map((news) => (
                    <Box key={news.link}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => window.open(news.link, "_blank")}
                      >
                        {news.title
                          .replace(/&quot;/g, "") // &quot; 제거
                          .replace(/<b>/g, "") // <b> 제거
                          .replace(/<\/b>/g, "") + "..."}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {console &&
                  console.items !== null &&
                  console.items.map((news) => (
                    <Box key={news.link}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => window.open(news.link, "_blank")}
                      >
                        {news.title
                          .replace(/&quot;/g, "") // &quot; 제거
                          .replace(/<b>/g, "") // <b> 제거
                          .replace(/<\/b>/g, "") + "..."}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack divider={<StackDivider />} spacing="4">
                {mobile &&
                  mobile.items !== null &&
                  mobile.items.map((news) => (
                    <Box key={news.link}>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        _hover={{ cursor: "pointer" }}
                        onClick={() => window.open(news.link, "_blank")}
                      >
                        {news.title
                          .replace(/&quot;/g, "") // &quot; 제거
                          .replace(/<b>/g, "") // <b> 제거
                          .replace(/<\/b>/g, "") + "..."}
                      </Heading>
                    </Box>
                  ))}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
}
