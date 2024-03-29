import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ScreenContext } from "../../../component/ScreenContext";

export function MemberAddress() {
  const [memberAddress, setMemberAddress] = useState([]);
  const [member, setMember] = useState("");

  // 선택한 주소의 정보
  const [selectedAddress, setSelectedAddress] = useState("");

  // 주소록 주소가 삭제 되었는지 인식 코드 -----------------------------------------------------
  // 첫 랜더링 시 false 상태
  const [addressState, setAddressState] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { isSmallScreen } = useContext(ScreenContext);

  // 수정 모달 -----------------------------------------------------------------
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  // 삭제 모달 -----------------------------------------------------------------
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // 수정 모달 열기 -----------------------------------------------------------------
  const openEditModal = (address) => {
    setSelectedAddress(address);
    onEditOpen();
  };

  // 삭제 모달 열기 -----------------------------------------------------------------
  const openDeleteModal = (address) => {
    setSelectedAddress(address);
    onDeleteOpen();
  };

  // 페이지 랜딩시 -----------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/api/memberAddress/loginUser")
      .then((response) => {
        setMemberAddress(response.data);
      })
      .catch(() => {
        toast({
          description: "로그인후 서비스를 이용해주세요.",
          status: "error",
        });
        navigate("/login");
      })
      .finally(() => {
        setAddressState(false);
      });
  }, [addressState]);

  useEffect(() => {
    axios.get("/api/member/memberInfo").then((response) => {
      setMember(response.data);
    });
  }, []);

  // 삭제 모달의 삭제 버튼 클릭 -----------------------------------------------------------------
  function handleDeleteClick() {
    if (selectedAddress.member_address_type === "main") {
      toast({
        description: "기본 주소지는 삭제 불가능 합니다.",
        status: "error",
      });
    } else {
      axios
        .delete("/api/memberAddress/deleteAddress/" + selectedAddress.id)
        .then(() => {
          onDeleteClose();
          toast({
            description:
              selectedAddress.member_address_name + " 주소가 삭제 되었습니다.",
            status: "success",
          });
        })
        .then(() => {
          setAddressState(true);
        })
        .catch(() => {
          toast({
            description: "삭제 중 문제가 발생하였습니다.",
            status: "error",
          });
        });
    }
  }

  function handleMainAddressSwitch(e) {
    if (e.target.checked) {
      setSelectedAddress({ ...selectedAddress, member_address_type: "main" });
    } else {
      setSelectedAddress({ ...selectedAddress, member_address_type: "sub" });
    }
  }

  // Daum Postcode 스크립트 URL
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  // Daum Postcode 팝업을 여는 함수
  const openPostcodePopup = useDaumPostcodePopup(scriptUrl);
  // 주소 검색 완료 핸들러
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setSelectedAddress({
      ...selectedAddress,
      member_address: fullAddress,
      member_post_code: data.zonecode,
      member_detail_address: "",
    });
  };

  // 수정 모달에서 주소검색 클릭 ----------------------------------------------------------------
  function handlePostCodeClick() {
    openPostcodePopup({ onComplete: handleComplete });
  }

  // 수정 모달 에서 수정 버튼 클릭 ---------------------------------------------------------------
  function handleEditAddressClick() {
    axios
      .put("/api/memberAddress/editAddress", {
        id: selectedAddress.id,
        member_address: selectedAddress.member_address,
        member_address_name: selectedAddress.member_address_name,
        member_address_type: selectedAddress.member_address_type,
        member_detail_address: selectedAddress.member_detail_address,
        member_post_code: selectedAddress.member_post_code,
      })
      .then(() => {
        toast({ description: "주소가 수정 되었습니다.", status: "success" });
        setAddressState((prev) => !prev);
      })
      .catch((error) => {
        if (error) {
          toast({
            description: error.response.data,
            status: "error",
          });
        } else {
          toast({
            description: "수정중 문제가 발생 하였습니다.",
            status: "error",
          });
        }
      })
      .finally(onEditClose);
  }

  return (
    <>
      <Card
        w="full"
        minH={isSmallScreen ? "full" : "560px"}
        mx={{ base: 0, md: "10%", lg: "10%", xl: "15%" }}
      >
        <CardHeader
          display="flex"
          alignItems="center"
          fontWeight="bold"
          textAlign="left"
          fontSize="2xl"
          className="specialHeadings"
        >
          <Text as="span" color="orange" fontSize="3xl" mr={1}>
            {member.member_name}
          </Text>
          님의 주소 목록
        </CardHeader>
        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th textAlign="center">기본 주소</Th>
                <Th textAlign="center">주소 별명</Th>
                {!isSmallScreen && (
                  <>
                    <Th textAlign="center">우편 번호</Th>
                    <Th textAlign="center">주소</Th>
                    <Th textAlign="center">상세 주소</Th>
                  </>
                )}
                <Th textAlign="center">수정</Th>
                <Th textAlign="center">삭제</Th>
              </Tr>
            </Thead>
            {memberAddress != null &&
              memberAddress.map((address) => (
                <Tbody key={address.id}>
                  <Tr>
                    <Td textAlign="center">
                      {address.member_address_type === "main" ? (
                        <Box as="span">메인주소</Box>
                      ) : (
                        <Box as="span"> - </Box>
                      )}
                    </Td>
                    <Td textAlign="center">{address.member_address_name}</Td>
                    {!isSmallScreen && (
                      <>
                        <Td textAlign="center">{address.member_post_code}</Td>
                        <Td textAlign="center">{address.member_address}</Td>
                        <Td textAlign="center">
                          {address.member_detail_address}
                        </Td>
                      </>
                    )}
                    <Td>
                      <IconButton
                        variant="ghost"
                        _hover={{ bgColor: "black", color: "white" }}
                        icon={<FontAwesomeIcon icon={faPenNib} />}
                        onClick={() => openEditModal(address)}
                      ></IconButton>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => openDeleteModal(address)}
                        color="orange"
                        _hover={{ bgColor: "orange", color: "white" }}
                        variant="ghost"
                      />
                    </Td>
                  </Tr>
                </Tbody>
              ))}
          </Table>
        </CardBody>
        <CardFooter display="flex">
          <Button
            w="full"
            _hover={{ bgColor: "orange", color: "white" }}
            onClick={() => navigate("/memberPage/addressWrite")}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </CardFooter>
      </Card>

      {/* 수정 모달 */}
      <>
        <Modal
          isCentered
          onClose={onEditClose}
          isOpen={isEditOpen}
          motionPreset="slideInBottom"
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader py={5} className="specialHeadings">
              <Text as="span" mr={3}>
                <FontAwesomeIcon icon={faPenNib} />
              </Text>
              주소 수정
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CardBody>
                {/* 주소 별명 */}
                <FormControl mt={2} display="flex" justifyContent="center">
                  <FormLabel
                    minW="100px"
                    fontSize="md"
                    fontWeight="bold"
                    className="labels"
                    lineHeight="50px"
                  >
                    주소 별명
                  </FormLabel>
                  <Input
                    h="50px"
                    borderRadius={0}
                    placeholder={"주소 별명"}
                    value={selectedAddress.member_address_name}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        member_address_name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                {/* 우편번호 */}
                <FormControl mt={2} display="flex" justifyContent="center">
                  <FormLabel
                    minW="100px"
                    fontSize="md"
                    fontWeight="bold"
                    className="labels"
                    lineHeight="50px"
                  >
                    우편번호
                  </FormLabel>
                  <Input
                    placeholder={"주소 검색 클릭"}
                    h="50px"
                    borderRadius={0}
                    readOnly
                    value={selectedAddress.member_post_code}
                  />
                  <Button
                    minW="80px"
                    h="50px"
                    ml={3}
                    onClick={handlePostCodeClick}
                    className="labels"
                  >
                    주소검색
                  </Button>
                </FormControl>
                {/* 주소 */}
                <FormControl mt={2} display="flex" justifyContent="center">
                  <FormLabel
                    minW="100px"
                    fontSize="md"
                    fontWeight="bold"
                    className="labels"
                    lineHeight="50px"
                  >
                    주소
                  </FormLabel>
                  <Input
                    h={"50px"}
                    borderRadius={"0"}
                    readOnly
                    value={selectedAddress.member_address}
                  />
                </FormControl>
                {/* 상세주소 */}
                <FormControl mt={2} display="flex" justifyContent="center">
                  <FormLabel
                    minW="100px"
                    fontSize="md"
                    fontWeight="bold"
                    className="labels"
                    lineHeight="50px"
                  >
                    상세주소
                  </FormLabel>
                  <Input
                    placeholder={"상세주소를 입력해 주세요"}
                    h="50px"
                    borderRadius={"0"}
                    value={selectedAddress.member_detail_address}
                    onChange={(e) =>
                      setSelectedAddress({
                        ...selectedAddress,
                        member_detail_address: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={2} display="flex" justifyContent="center">
                  <FormLabel
                    minW="100px"
                    fontSize="md"
                    fontWeight="bold"
                    className="labels"
                    lineHeight="50px"
                  >
                    기본 주소 설정
                  </FormLabel>
                  <Box
                    w={"470px"}
                    h={"50px"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Switch
                      size="lg"
                      colorScheme={"gray"}
                      isChecked={selectedAddress.member_address_type === "main"}
                      onChange={handleMainAddressSwitch}
                    />
                  </Box>
                </FormControl>
              </CardBody>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center" gap={5}>
              <Button
                w="40%"
                bgColor="orange"
                color="white"
                onClick={handleEditAddressClick}
              >
                수정
              </Button>
              <Button w="40%" onClick={onEditClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      {/* 삭제 모달 */}
      <Modal
        isCentered
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="specialHeadings">삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteClick}>
              삭제
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
