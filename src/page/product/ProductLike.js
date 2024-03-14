import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ScreenContext } from "../../component/ScreenContext";

export function ProductLike() {
  const [productLike, setProductLike] = useState([]);
  const [productChecked, setProductChecked] = useState([]); // 각 상품의 체크박스 상태를 관리하는 배열

  const navigate = useNavigate();
  const toast = useToast();

  // --------------------------------------- 좋아요 목록 렌더링 ---------------------------------------
  useEffect(() => {
    axios.get("/api/productLike/details").then((response) => {
      setProductLike(response.data);
      // 상품 개수에 맞게 productChecked 배열 초기화
      setProductChecked(new Array(response.data.length).fill(false));
    });
  }, []);

  // --------------------------------------- 가격 ,(쉼표) 표시 ---------------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // --------------------------------------- x버튼 누를때 실행되는 로직 ---------------------------------------
  const handleDislike = async (productLikeId) => {
    try {
      const response = await axios.delete(
        `/api/productLike/like/${productLikeId}`,
      );
      if (response.status === 200) {
        // 상태 업데이트하여 UI에서 제거
        const updatedProductLike = productLike.filter(
          (item) => item.like_id !== productLikeId,
        );
        setProductLike(updatedProductLike);

        // 체크박스 상태도 업데이트
        const updatedProductChecked = productChecked.slice();
        updatedProductChecked.splice(productLikeId, 1); // 해당 상품의 체크박스 상태 삭제
        setProductChecked(updatedProductChecked);

        toast({
          description: "좋아요가 삭제되었습니다.",
          status: "success",
        });
      }
    } catch (error) {
      toast({
        description:
          "좋아요 삭제중 오류 발생, 관리자에게 문의해주시기 바랍니다.",
        status: "error",
      });
    }
  };

  // 전체선택 버튼을 눌렀을 때 실행되는 로직
  const handleSelectAll = (checked) => {
    if (checked) {
      setProductChecked(new Array(productLike.length).fill(true));
    } else {
      setProductChecked(new Array(productLike.length).fill(false));
    }
  };

  // 선택해제 버튼을 눌렀을 때 실행되는 로직
  const handleDeselectAll = () => {
    setProductChecked(new Array(productLike.length).fill(false));
  };

  // 체크박스를 클릭했을 때 실행되는 로직
  const handleCheckboxClick = (index) => {
    const updatedProductChecked = productChecked.slice();
    updatedProductChecked[index] = !updatedProductChecked[index];
    setProductChecked(updatedProductChecked);
  };

  // 전체삭제 버튼을 클릭했을 때 실행되는 로직
  const handleDeleteSelectedProducts = async () => {
    try {
      // 선택된 모든 상품의 ID 배열 생성
      const selectedProductIds = productLike
        .filter((_, index) => productChecked[index])
        .map((item) => item.like_id);

      if (selectedProductIds.length === 0) {
        toast({
          description: "선택된 상품이 없습니다.",
          status: "info",
        });
        return;
      }

      // 선택된 모든 상품에 대해 삭제 요청
      await Promise.all(
        selectedProductIds.map((productLikeId) =>
          axios.delete(`/api/productLike/like/${productLikeId}`),
        ),
      );

      // UI에서 선택된 상품들 제거
      const updatedProductLike = productLike.filter(
        (item) => !selectedProductIds.includes(item.like_id),
      );
      setProductLike(updatedProductLike);

      // 체크박스 초기화
      setProductChecked(new Array(updatedProductLike.length).fill(false));

      toast({
        description: "선택한 상품이 삭제되었습니다.",
        status: "success",
      });
    } catch (error) {
      console.error("Error during batch product deletion:", error);
      toast({
        description: "상품 삭제중 오류 발생, 관리자에게 문의해주시기 바랍니다.",
        status: "error",
      });
    }
  };

  // -------------------------------- 글자수가 특정개수 이상일때 자르기 --------------------------------
  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  return (
    <Card w="full" mx={{ base: 0, md: "5%", lg: "15%", xl: "20%" }}>
      <CardHeader
        display="flex"
        alignItems="center"
        fontWeight="bold"
        textAlign="left"
        fontSize="2xl"
        className="specialHeadings"
      >
        <Text as="span" mr={3}>
          <FontAwesomeIcon icon={faHeart} style={{ color: "#FFA4C7" }} />
        </Text>
        좋아요 한 상품 목록
      </CardHeader>
      <CardBody>
        <Flex display="flex" justifyContent="space-between">
          <Checkbox
            colorScheme="orange"
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button
              borderRadius={0}
              variant="undefined"
              bgColor="white"
              border="1px solid black"
              _hover={{ bgColor: "black", color: "white" }}
              onClick={handleDeselectAll}
            >
              선택 해제
            </Button>
            <Button
              borderRadius={0}
              variant="undefined"
              bgColor="white"
              border="1px solid black"
              _hover={{ bgColor: "black", color: "white" }}
              onClick={handleDeleteSelectedProducts}
            >
              선택 삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={5} mt={5}>
          {productLike.map((bucket, index) => (
            <Box
              key={bucket.product_id}
              px={5}
              pb={4}
              display="flex"
              flexDir="column"
              shadow="base"
              border="1px solid #F4F4F4"
              justifyContent="flex-start"
              _hover={{
                cursor: "pointer",
                transform: "scale(1.1)",
              }}
              transition="0.3s ease-in-out"
              onClick={() => navigate("/product/" + bucket.product_id)}
            >
              <Flex
                justifyContent="space-between"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  colorScheme="orange"
                  isChecked={productChecked[index]}
                  onChange={() => handleCheckboxClick(index)}
                />
                <IconButton
                  size="md"
                  mr={-4}
                  variant="undefined"
                  _hover={{ color: "red" }}
                  icon={<FontAwesomeIcon icon={faXmark} />}
                  onClick={() => handleDislike(bucket.like_id)}
                />
              </Flex>
              <Box display="flex" justifyContent="center">
                <Image
                  boxSize="150px"
                  objectFit="cover"
                  src={bucket.main_img_uri}
                  alt={bucket.product_name}
                />
              </Box>
              <Text
                textAlign="left"
                fontWeight="bold"
                fontSize="xs"
                opacity={0.5}
                mt={2}
              >
                {bucket.company_name}
              </Text>
              <Text textAlign="left" fontSize="sm">
                {truncateText(bucket.product_name, 40)}
              </Text>
              <Text
                textAlign="left"
                fontSize="md"
                fontWeight="bold"
                color="orange"
              >
                {formatPrice(bucket.product_price)}원
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}
