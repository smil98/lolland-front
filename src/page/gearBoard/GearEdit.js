import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function GearEdit() {
  const { gear_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [gearboard, updateGearboard] = useImmer(null);
  const categories = [
    "전체",
    "모니터",
    "키보드",
    "마우스",
    "오디오",
    "최신기기",
  ];
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);

  useEffect(() => {
    axios
      .get("/api/gearboard/gear_id/" + gear_id)
      .then((response) => updateGearboard(response.data));
  }, []);

  if (gearboard == null) {
    return <Spinner />;
  }

  function handleSave() {
    axios
      .putForm("/api/gearboard/saveup", {
        removeFileIds,
        uploadFiles,
        gear_id: gearboard.gear_id,
        category: selectedCategory,
        gear_title: gearboard.gear_title,
        gear_content: gearboard.gear_content,
      })
      .then(() => {
        toast({ description: "수정이 완료 되었습니다", status: "success" });
        navigate("/gearlistlayout");
      });
  }

  console.log(removeFileIds);

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removeFileIds 에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      // removeFileIds 에서 삭제
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
  }

  return (
    <Box w={{ base: "95%", md: "80%" }} textAlign="center" mx="auto" mt={10}>
      <Text className="specialHeadings" fontWeight="bold" fontSize="2xl">
        {gear_id}번 게시물 수정
      </Text>
      <FormControl mb={5}>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={5}>
        <FormLabel>제목</FormLabel>
        <Input
          value={gearboard.gear_title}
          onChange={(e) =>
            updateGearboard((draft) => {
              draft.gear_title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel>내용</FormLabel>
        <Textarea
          h="xs"
          value={gearboard.gear_content}
          onChange={(e) =>
            updateGearboard((draft) => {
              draft.gear_content = e.target.value;
            })
          }
        ></Textarea>
      </FormControl>{" "}
      {/* 이미지 출력 */}
      <Text textAlign="left" mb={3} fontSize="md">
        삭제할 이미지 선택
      </Text>
      <SimpleGrid
        w="full"
        columns={{ base: 2, md: 3, lg: 4 }}
        spacing={5}
        mb={5}
      >
        {gearboard.files.length > 0 &&
          gearboard.files.map((file) => (
            <Box key={file.id} position="relative">
              <Box
                display="flex"
                position="absolute"
                alignItems="center"
                top={3}
                right={3}
                p={3}
                bgColor="#F6F5F5"
                borderRadius={5}
                opacity={0.8}
                _hover={{ opacity: 1 }}
              >
                <FontAwesomeIcon color="red" icon={faTrashCan} />
                <Switch
                  ml={2}
                  value={file.id}
                  colorScheme="red"
                  onChange={handleRemoveFileSwitch}
                />
              </Box>
              <Image
                objectFit="cover"
                src={file.url}
                alt={file.name}
                borderRadius="5%"
                w="100%"
                h="100%"
              />
            </Box>
          ))}
      </SimpleGrid>
      {/* 추가할 파일 선택 */}
      <FormControl>
        <FormLabel>새 이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
        </FormHelperText>
      </FormControl>
      <ButtonGroup
        w="full"
        mt={8}
        mb={10}
        spacing={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button w="45%" maxW="350px" colorScheme="orange" onClick={handleSave}>
          저장
        </Button>
        <Button
          w="45%"
          maxW="350px"
          colorScheme="gray"
          variant="outline"
          onClick={() => navigate(-2)}
        >
          취소
        </Button>
      </ButtonGroup>
    </Box>
  );
}
