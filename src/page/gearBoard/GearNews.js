import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function GearNews() {
  const [naver, setNaver] = useState(null);
  useEffect(() => {
    axios.get("/api/gear/gearnews").then((response) => setNaver(response.data));
  }, []);

  return (
    <Card mb={5}>
      <CardHeader
        className="specialHeadings"
        fontWeight="bold"
        color="orange"
        fontSize="2xl"
        textAlign="center"
      >
        컴퓨터 장비 최신 기사
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {naver &&
            naver.items !== null &&
            naver.items.map((news) => (
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
      </CardBody>
    </Card>
  );
}
