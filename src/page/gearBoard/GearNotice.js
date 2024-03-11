import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export function GearNotice() {
  return (
    <Accordion allowMultiple id="myAccordian">
      <AccordionItem className="accordianItem">
        <Box>
          <AccordionButton>
            <Box
              as="span"
              flex="1"
              textAlign="left"
              className="specialHeadings"
              fontWeight="bold"
            >
              장비 게시판 공통 규정
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Box>
        <AccordionPanel>
          <List spacing={3} p={3} borderRadius={10} bgColor="#F1F1F1">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="orange" />
              규정은 글, 댓글, 쪽지, 프로필 사진, 자기소개, 닉네임 등 모든
              표현수단에 적용됩니다.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="orange" />
              회원 간 비하, 비난, 조롱, 욕설 등의 표현이 포함되었을 경우 해당
              게시글 또는 댓글이 삭제 조치 될 수 있습니다.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="orange" />
              정치 성향 또는 부적절한 주제 등의 언급은 삼가 부탁드립니다.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="orange" />
              사이트 이용 관련 문의는 문의하기 게시판(링크)을 이용해 주세요.
            </ListItem>
          </List>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className="accordianItem">
        <Box>
          <AccordionButton>
            <Box
              as="span"
              flex="1"
              textAlign="left"
              className="specialHeadings"
              fontWeight="bold"
            >
              [하드웨어 제품비교] 안내 공지
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Box>
        <AccordionPanel pb={4}>
          <Box p={3} borderRadius={10} bgColor="#F1F1F1">
            컴포넌트 종류는 CPU, GPU, 마더보드, 그래픽카드, 모니터, 저장장치,
            CPU쿨러, 쿨링팬, 파워, 케이스, 키보드, 마우스, 음향기기, 노트북이
            포함된 총 14종입니다. 이 중 CPU와 GPU는 퀘이사존 공식 벤치마크를
            기준으로, 나머지 제품군은 퀘이사존 칼럼 기준 데이터를 제공합니다.
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
