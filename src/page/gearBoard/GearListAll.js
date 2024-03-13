import {
  Badge,
  Box,
  Spinner,
  Stack,
  StackItem,
  Table,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Tfoot,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faComment,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-regular-svg-icons";
import Pagination from "./Pagination";

export function GearListAll() {
  const [gearboardList, setGearboardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const toast = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    axios.get("/api/gearboard/listAll?" + params).then((response) => {
      setGearboardList(response.data.gearboardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  const formatKoreanDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <Box w="100%">
      <Stack>
        {gearboardList == null ? (
          <Spinner />
        ) : (
          gearboardList.map((item) => (
            <StackItem key={item.gear_id}>
              <Box
                p={5}
                border="1px solid #E1E1E1"
                onClick={() => navigate("/gearlist/gear_id/" + item.gear_id)}
              >
                <Badge>{item.category}</Badge>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  my={3}
                  alignItems="center"
                >
                  {item.gear_title.slice(0, 30)}
                  {item.countFile > 0 && (
                    <Tag colorScheme="gray" size="sm" ml={2}>
                      <TagLeftIcon as={FontAwesomeIcon} icon={faImages} />
                      <TagLabel>{item.countFile}</TagLabel>
                    </Tag>
                  )}
                  {item.commnetcount > 0 && (
                    <Tag colorScheme="orange" size="sm" ml={2}>
                      <TagLeftIcon as={FontAwesomeIcon} icon={faComment} />
                      <TagLabel>{item.commnetcount}</TagLabel>
                    </Tag>
                  )}
                  <Tag colorScheme="orange" variant="outline" size="sm" ml={2}>
                    <TagLeftIcon as={FontAwesomeIcon} icon={faThumbsUp} />
                    <TagLabel>{item.countLike}</TagLabel>
                  </Tag>
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
      <Box mt={5} textAlign="center">
        <Pagination pageInfo={pageInfo} />
      </Box>
    </Box>
  );
}
