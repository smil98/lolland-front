import {
  Badge,
  Box,
  Spinner,
  Stack,
  StackDivider,
  StackItem,
  Table,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComment, faImage } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-regular-svg-icons";

export function GearList({ category }) {
  const [gearboardList, setGearboardList] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  useEffect(() => {
    axios
      .get("/api/gearboard/list?category=" + category)
      .then((response) => setGearboardList(response.data));
  }, [category]);

  // Function to format the date in "YYYY년 M월 D일" format
  const formatKoreanDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <Stack spacing={3}>
      {gearboardList == null ? (
        <Spinner />
      ) : (
        gearboardList.map((item) => (
          <StackItem key={item.gear_id}>
            <Box
              p={5}
              _hover={{ bgColor: "#E1E1E1" }}
              border="1px solid #E1E1E1"
              onClick={() => navigate("/gearlist/gear_id/" + item.gear_id)}
            >
              <Badge>{item.category}</Badge>
              <Text fontSize="md" fontWeight="bold" my={3} alignItems="center">
                {item.gear_title.slice(0, 40)}
                {item.countFile > 0 && (
                  <Tag colorScheme="gray" size="sm" mx={2}>
                    <TagLeftIcon as={FontAwesomeIcon} icon={faImages} />
                    <TagLabel>{item.countFile}</TagLabel>
                  </Tag>
                )}
                {item.commentcount > 0 && (
                  <Tag colorScheme="orange" size="sm">
                    <TagLeftIcon as={FontAwesomeIcon} icon={faComment} />
                    <TagLabel> {item.commentcount}</TagLabel>
                  </Tag>
                )}
              </Text>
              <Text>{item.gear_content.slice(0, 150)}</Text>
              <Tag variant="ghost" colorScheme="gray" mt={3}>
                <TagLeftIcon as={FontAwesomeIcon} icon={faClock} />
                <TagLabel>{formatKoreanDate(item.gear_inserted)}</TagLabel>
              </Tag>
            </Box>
          </StackItem>
        ))
      )}
    </Stack>
  );
}
