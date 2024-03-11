import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export function TodayBest() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("api/gearboard/today")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList == null) {
    return <Spinner />;
  }

  return (
    <Card border="1px solid #F1F1F1" mb={5}>
      <CardHeader
        className="specialHeadings"
        fontWeight="bold"
        color="orange"
        fontSize="2xl"
        textAlign="left"
      >
        최신글
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="5">
          {boardList.map((item) => (
            <Box
              key={item.gear_id}
              onClick={() => navigate("/gearlist/gear_id/" + item.gear_id)}
            >
              <Flex gap={5} justify="space-between" alignItems="center">
                <Box w="150px" h="150px" alignItems="center" overflow="hidden">
                  <Image
                    w="150px"
                    h="150px"
                    objectFit="cover"
                    src={item.mainfile}
                    alt="Gear Image"
                  />
                </Box>
                <Box w="80%">
                  <Heading size="md">{item.gear_title}</Heading>
                  <Text pt="2" fontSize="sm" my={2}>
                    {item.gear_content.slice(0, 150)}
                  </Text>
                  <Tag variant="ghost" color="gray">
                    <TagLeftIcon as={FontAwesomeIcon} icon={faClock} />
                    <TagLabel>
                      {new Date(item.gear_inserted).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </TagLabel>
                  </Tag>
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
