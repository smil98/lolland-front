import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export function ProductWrite() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seletedSubCategory, setSeletedSubCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(""); // 제목
  const [content, setContent] = useState(""); // 상품설명
  const [price, setPrice] = useState(""); // 금액
  const [manufacturer, setManufacturer] = useState(""); // 제조사
  const [stock, setStock] = useState("");
  const [mainImg, setMainImg] = useState(null); // 메인이미지
  const [contentImg, setContentImg] = useState(null); // 설명 이미지
  const [options, setOptions] = useState([{ option_name: "", stock: 0 }]); // 초기값 수정
  const [showAddOptionMessage, setShowAddOptionMessage] = useState(true);

  // ---------------------------------- 대분류,소분류 렌더링 로직 ----------------------------------
  useEffect(() => {
    axios
      .get("/api/product/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast({
          title: "카테고리 불러오는 도중 에러 발생",
          description: error.response.data,
          status: "error",
        });
      });
  }, []);

  // ---------------------------------- 대분류 관련 로직 ----------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category.category_id === parseInt(selectedCategoryId),
    );
    setSelectedCategory(selectedCategory);
    setSelectedCategoryName(selectedCategory?.category_name); // 이름 저장
  };

  // ---------------------------------- 소분류 관련 로직 ----------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    const selectedSubCategory = selectedCategory.subCategory.find(
      (subCategory) =>
        subCategory.subcategory_id === parseInt(selectedSubCategoryId),
    );
    setSeletedSubCategory(selectedSubCategoryId); // ID 저장
    setSelectedSubCategoryName(selectedSubCategory?.subcategory_name); // 이름 저장
  };

  // ---------------------------------- 저장 버튼 클릭 로직 ----------------------------------
  function handleSubmit() {
    options.map((option) => console.log(option));
    setIsSubmitting(true);

    axios
      .postForm("/api/product/add", {
        product_name: name,
        product_content: content,
        product_price: price,
        company_name: manufacturer,
        mainImg,
        contentImg,
        category_id: selectedCategory?.category_id,
        subcategory_id: seletedSubCategory,
        options: JSON.stringify(options),
      })

      .then((response) => {
        toast({
          description: "상품이 등록되었습니다.",
          status: "success",
        });
        navigate("/product/list/");
      })
      .catch((error) => {
        toast({
          description: "오류발생",
          status: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  // ---------------------------------- 상세옵션선택 관련 로직 ----------------------------------
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = options.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  // ---------------------------------- 상세옵션선택 추가 로직 ----------------------------------
  const handleAddOption = () => {
    setOptions([...options, { option_name: "", stock: 1 }]);
  };

  // ---------------------------------- 상세옵션선택 감소 로직 ----------------------------------
  const handleRemoveOption = (index) => {
    if (index !== 0) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // ------------- 연속 클릭 방지 -------------
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모든 입력 필드가 유효한지 확인하는 함수
  const isFormValid = () => {
    const hasMainImage = mainImg && mainImg.length > 0;
    const hasContentImage = contentImg && contentImg.length > 0;
    const hasValidOptions = options.every(
      (option) => option.option_name.trim() && option.stock > 0,
    );

    return (
      name.trim() &&
      manufacturer.trim() &&
      price.trim() &&
      hasMainImage &&
      hasValidOptions
    );
  };

  const inputStyle = {
    border: "1px solid black",
    borderRadius: 0,
    _hover: "1px solid black",
    _focus: {
      border: "2px solid orange",
      shadow: "none",
    },
  };

  return (
    <Box
      p={5}
      mb={5}
      w="full"
      mx={{ base: 0, md: "15%", lg: "25%", xl: "30%" }}
    >
      <Text
        fontSize="3xl"
        fontWeight="bold"
        textAlign="left"
        className="specialHeadings"
        mb={5}
      >
        <Text as="span" color="orange" mr={3}>
          <FontAwesomeIcon icon={faGift} />
        </Text>
        상품 등록
      </Text>
      {/* ---------------------------------- 대분류 , 소분류 나누는 로직 ---------------------------------- */}
      <Box>
        <VStack w="full" spacing={5}>
          <FormControl isRequired>
            <FormLabel>카테고리 선택</FormLabel>
            {/* categories가 없을 때 (초기값, 에러) 대비해 null return으로 처리 */}
            {categories.length === 0 ? null : (
              <Select
                onChange={handleCategoryChange}
                border="1px solid black"
                borderRadius={0}
                _focus={{ border: "1px solid black", shadow: "none" }}
                _hover={{ border: "1px solid black" }}
              >
                <option value="">대분류 선택</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </Select>
            )}
            {selectedCategory && (
              <Select
                onChange={handleSubCategoryChange}
                mt={3}
                border="1px solid black"
                borderRadius={0}
                _focus={{ border: "1px solid black", shadow: "none" }}
                _hover={{ border: "1px solid black" }}
              >
                <option value="">소분류 선택</option>
                {selectedCategory.subCategory.map((subCategory) => (
                  <option
                    key={subCategory.subcategory_id}
                    value={subCategory.subcategory_id}
                  >
                    {subCategory.subcategory_name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>상품명</FormLabel>
            <Input
              {...inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>상품설명</FormLabel>
            <Textarea
              {...inputStyle}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>제조사</FormLabel>
            <Input
              {...inputStyle}
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>판매가</FormLabel>
            <Input
              {...inputStyle}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>메인 이미지</FormLabel>
            <Input
              {...inputStyle}
              lineHeight="32px"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setMainImg(e.target.files)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>설명 이미지</FormLabel>
            <FormHelperText textAlign="left" mb={3}>
              미선택 시 기본 설명 이미지가 삽입됩니다
            </FormHelperText>
            <Input
              {...inputStyle}
              lineHeight="32px"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setContentImg(e.target.files)}
            />
          </FormControl>

          {options.map((option, index) => (
            <Flex
              w="full"
              key={index}
              alignItems="flex-end"
              justifyContent="space-between"
            >
              <FormControl mr={2} isRequired>
                <FormLabel>
                  {index !== 0 ? `옵션 ${index}` : "기본 옵션"}
                </FormLabel>
                <Input
                  {...inputStyle}
                  value={option.option_name}
                  placeholder="ex. 화이트 / 청축"
                  onChange={(e) =>
                    handleOptionChange(index, "option_name", e.target.value)
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>수량</FormLabel>
                <Input
                  type="number"
                  {...inputStyle}
                  value={option.stock}
                  onChange={(e) =>
                    handleOptionChange(index, "stock", e.target.value)
                  }
                />
              </FormControl>
              {index !== 0 && (
                <IconButton
                  isRound
                  mb={1}
                  ml={2}
                  size="sm"
                  icon={<FontAwesomeIcon icon={faMinus} />}
                  onClick={() => handleRemoveOption(index)}
                  colorScheme="red"
                />
              )}
            </Flex>
          ))}
          {showAddOptionMessage && (
            <Text color="red" fontSize="md">
              옵션은 최소 1개 이상 작성해주세요.
              <br />
              ex) 옵션 : 기본제품 / 수량 : 5
            </Text>
          )}
          <ButtonGroup
            w="full"
            display="flex"
            spacing={{ base: 0, md: 3 }}
            flexDir={{ base: "column", md: "row" }}
          >
            <Button
              w="full"
              leftIcon={<FontAwesomeIcon icon={faPlus} size="sm" />}
              onClick={() => {
                handleAddOption();
                setShowAddOptionMessage(false);
              }}
            >
              상세 옵션 추가
            </Button>
            <Button
              w="full"
              mt={{ base: 5, md: 0 }}
              isDisabled={!isFormValid() || isSubmitting}
              bgColor="orange"
              color="white"
              onClick={handleSubmit}
            >
              저장
            </Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </Box>
  );
}
