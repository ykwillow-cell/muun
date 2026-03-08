-- columns 테이블 slug 업데이트 SQL
-- 먼저 slug 컬럼 추가
ALTER TABLE columns ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 각 칼럼에 slug 업데이트
UPDATE columns SET slug = 'money-pyeonjae-f34b5d66' WHERE id = 'f34b5d66-1f1e-4084-8e2d-6ffec4bef912';
-- 투자 손실이 반복될 때 점검해야 할 편재의 허망함과 정재의 안정감
UPDATE columns SET slug = 'fortune-flow-2026-second-half-caution-e347d445' WHERE id = 'e347d445-6171-4f1b-9732-3740cb4ef8ea';
-- 2026년 하반기, '이것' 세 가지만 조심하면 평안합니다
UPDATE columns SET slug = 'luck-room-cleaning-83c59830' WHERE id = '83c59830-276d-4dda-92f0-5909b057ef1a';
-- 내 방 청소만 잘해도 막힌 운이 술술 풀리는 이유
UPDATE columns SET slug = 'luck-fortune-secret-307e549f' WHERE id = '307e549f-014f-4cd9-b751-d3faa818363b';
-- 메마른 땅에 단비가 내리듯 당신의 인생을 촉촉하게 적셔줄 운의 비밀
UPDATE columns SET slug = 'luck-fortune-breakthrough-cef1d14a' WHERE id = 'cef1d14a-9f09-4197-880c-c3cf1bad649f';
-- 막혔던 운의 고속도로를 뻥 뚫어주는 세 가지 마법의 습관
UPDATE columns SET slug = 'luck-fortune-signs-d70daba9' WHERE id = 'd70daba9-4c0e-4e66-a3b0-6ac74b61aab5';
-- 인생이 잘 풀릴 때 나타나는 징조와 대운 맞이하는 법
UPDATE columns SET slug = 'saju-basic-saju-study-d9f2e703' WHERE id = 'd9f2e703-154d-404a-943d-2fe3550b2b4a';
-- 어색했던 사주 공부가 나를 바꾸는 마법 같은 도구가 될 때
UPDATE columns SET slug = 'luck-life-habits-7945bc54' WHERE id = '7945bc54-8286-45b7-a275-e55ddae6d763';
-- 막혔던 인생의 매듭을 술술 풀이하는 마법 같은 마음 습관
UPDATE columns SET slug = 'fortune-flow-fate-magnifier-5ee9d8b5' WHERE id = '5ee9d8b5-6ff8-42ca-b19a-1a9e0842cbf2';
-- 꽉 막힌 인생의 매듭을 술술 풀이해 주는 운명의 돋보기
UPDATE columns SET slug = 'relation-golden-age-timing-86759dff' WHERE id = '86759dff-e3a9-4786-94e8-f741d78a1c24';
-- 당신이 몰랐던 인생의 황금기를 부르는 '운의 타이밍'
UPDATE columns SET slug = 'money-wealth-golden-9cb42942' WHERE id = '9cb42942-6b4b-418b-8de3-31bbac665b47';
-- 내 인생의 곳간을 황금빛으로 가득 채우는 신비로운 재물운의 비밀
UPDATE columns SET slug = 'health-body-energy-fortune-30d117b4' WHERE id = '30d117b4-fd0c-4327-aa4a-ee743b1bbd47';
-- 내 몸의 기운을 살려야 운이 들어올 자리가 생깁니다
UPDATE columns SET slug = 'fortune-flow-winter-to-spring-90b79a03' WHERE id = '90b79a03-ee4c-4735-899e-33c30940afcb';
-- 내 인생의 겨울이 가고 봄이 오는 신호, 운의 흐름을 읽는 지혜
UPDATE columns SET slug = 'fortune-flow-fate-spring-db760b73' WHERE id = 'db760b73-a35c-4436-a1b6-dd5bfe877c74';
-- 내 운명의 겨울이 끝나고 따스한 봄바람이 불어오는 신호
UPDATE columns SET slug = 'luck-2026-daeun-change-b0d87c9e' WHERE id = 'b0d87c9e-3c21-45b2-8e01-ea16f5070a58';
-- 2026년 대운 변화: 당신의 운명이 바뀌는 시기를 미리 알아보세요
UPDATE columns SET slug = 'health-body-revival-0659b745' WHERE id = '0659b745-7697-48d2-a370-5181763adac4';
-- 내 몸의 시든 꽃을 다시 피우는 법, 기운을 살리는 건강 관리
UPDATE columns SET slug = 'relation-children-fortune-parent-331e43a6' WHERE id = '331e43a6-eb33-4f97-a5b8-42e4f3aa8093';
-- 우리 아이라는 귀한 손님, 자녀운을 꽃피우는 부모의 마음 그릇
UPDATE columns SET slug = 'relation-children-education-60781ebe' WHERE id = '60781ebe-5fe8-4c9a-b106-881fa692b3aa';
-- 내 아이의 그릇을 키우는 부모의 지혜, 사주로 보는 자녀 교육의 비밀
UPDATE columns SET slug = 'health-children-fortune-words-c388f667' WHERE id = 'c388f667-a547-4059-bfa7-56d42a281839';
-- 자녀 운이 풀리는 엄마의 말 한마디, 집안에 복을 부르는 다정한 개운법
UPDATE columns SET slug = 'family-f16e40e9' WHERE id = 'f16e40e9-e4dd-4d8b-94e2-d442294b56c8';
-- 자식 복이 늦게 터지는 사주, 지금 고생은 보석을 닦는 과정입니다
UPDATE columns SET slug = 'fortune-flow-late-bloom-golden-ef7596ef' WHERE id = 'ef7596ef-e534-49a9-bcb8-f05848d9b184';
-- 늦게 피는 꽃이 더 아름답듯 쉰 살 넘어 찾아오는 제2의 인생 황금기 운세
UPDATE columns SET slug = 'fortune-flow-children-blessing-late-231b77df' WHERE id = '231b77df-27ec-4c46-8c39-fd75e58a667b';
-- 남편 복 자식 복 없다는 말에 상처받지 마세요, 말년 운이 귀인을 부릅니다
UPDATE columns SET slug = 'career-career-change-b57094ba' WHERE id = 'b57094ba-6f74-442b-8840-246285fc2d75';
-- 답답한 직장 생활, 이직이 답일까요? 내 운의 때를 찾는 지혜
UPDATE columns SET slug = 'career-job-success-efcff2d4' WHERE id = 'efcff2d4-7c50-498f-b49c-2d6a2cae252a';
-- 간절한 취업 소식, 사주로 풀어보는 합격의 문이 열리는 징조
UPDATE columns SET slug = 'love-late-love-276233a2' WHERE id = '276233a2-bb55-4b92-8b16-6f539013fc51';
-- 혼자가 편하다가도 문득 외로운 당신에게, 늦게 찾아오는 인연이 진짜 명작입니다
UPDATE columns SET slug = 'love-restart-love-e5d27e20' WHERE id = 'e5d27e20-9f42-4491-9026-6a458ce4846d';
-- 다시 시작하는 사랑이 더 단단한 이유, 당신의 인연은 이제부터 진짜입니다
UPDATE columns SET slug = 'fortune-flow-treasure-map-1024440d' WHERE id = '1024440d-0a19-410c-937c-4398b2812a7c';
-- 막막한 인생길, 내 사주의 보물 지도를 펼칠 시간입니다
UPDATE columns SET slug = 'fortune-flow-late-bloom-fortune-9f61d4e0' WHERE id = '9f61d4e0-4471-4a0d-b5dc-a3d09235df32';
-- 젊어서 고생은 사서도 한다지만, 진짜 복은 인생 후반전에 터집니다
UPDATE columns SET slug = 'money-wealth-control-63d84616' WHERE id = '63d84616-9644-40ba-816d-e76bf6c1363c';
-- 돈이 새나가는 사주가 따로 있을까요? 재물운을 꽉 잡는 그릇 키우기
UPDATE columns SET slug = 'love-late-love-40s-5a0ac9d7' WHERE id = '5a0ac9d7-a969-4689-968b-bb07bb9719c9';
-- 늦게 찾아온 인연이 더 아름다운 이유, 마흔 이후에 시작되는 진짜 사랑 이야기
UPDATE columns SET slug = 'money-empty-wallet-13d60396' WHERE id = '13d60396-b8be-49eb-a37b-8d6a5fab6dba';
-- 텅 빈 지갑이 두둑해지는 비결, 내 사주에 숨어있는 황금 열쇠 찾기
UPDATE columns SET slug = 'family-children-late-blessing-d737dc22' WHERE id = 'd737dc22-2497-4cb4-b8eb-0e6c226655bf';
-- 자식운 사주 풀이, 말년에 자식 덕 보는 팔자 특징
UPDATE columns SET slug = 'family-inheritance-conflict-0440c2eb' WHERE id = '0440c2eb-73c0-45a9-93b7-3450a0c8492d';
-- 상속이나 증여 후 형제간의 불화가 깊어지는 명리학적 원인과 처방
UPDATE columns SET slug = 'health-pyeongwan-pressure-4cef87ed' WHERE id = '4cef87ed-2665-4f87-9788-0f34df532a92';
-- 갑자기 몸이 무겁고 무기력할 때 의심해야 할 편관의 압박과 극복법
UPDATE columns SET slug = 'career-reemployment-blocked-51b24cc7' WHERE id = '51b24cc7-3ba4-4f78-b808-84ee2424feca';
-- 재취업이나 이직이 자꾸 어긋날 때 점검해야 할 관성과 인성의 균형
UPDATE columns SET slug = 'health-menopause-depression-ba837dd6' WHERE id = 'ba837dd6-d5ae-41c2-9a45-d7f568cc5796';
-- 갱년기 우울증과 무기력증이 깊어질 때의 명리학적 조후 처방
UPDATE columns SET slug = 'career-promotion-blocked-727184d9' WHERE id = '727184d9-e479-432d-95b1-f6cefa442208';
-- 승진 기회에서 번번이 밀릴 때 확인해야 할 관성과 인성의 불균형
UPDATE columns SET slug = 'health-baekhosal-yangsal-b9d9fef4' WHERE id = 'b9d9fef4-2ac3-45eb-83f2-8fb748e1e61e';
-- 유독 건강이 악화되는 해에 점검해야 할 백호살과 양인살의 준동
UPDATE columns SET slug = 'relation-jaengjae-e7afb912' WHERE id = 'e7afb912-1097-4075-89e5-2644beaa0b7f';
-- 부부 사이의 경제적 갈등을 해결하는 사주상 군겁쟁재 다스리기
UPDATE columns SET slug = 'love-short-relationship-097407a0' WHERE id = '097407a0-2451-47c9-9ef6-2b9dae84796e';
-- 연애가 매번 짧게 끝날 때 점검해야 할 일지와 식상의 과다
UPDATE columns SET slug = 'career-workplace-relationship-d5779d29' WHERE id = 'd5779d29-a2d4-4d3e-b667-4ceb152576e6';
-- 직장 내 인간관계가 꼬일 때 점검해야 할 비겁의 쟁투와 관성의 유무
UPDATE columns SET slug = 'money-inheritance-complex-caf5b63a' WHERE id = 'caf5b63a-4f95-4f54-b356-39a428ab0101';
-- 유독 상속이나 증여 문제가 복잡하게 꼬이는 사주상 편인과 겁재의 작용
UPDATE columns SET slug = 'relation-couple-personality-93c37cd5' WHERE id = '93c37cd5-acba-4a94-90fb-4c13905264e7';
-- 부부의 성격 차이가 극한으로 치달을 때 확인해야 할 일지 충과 형
UPDATE columns SET slug = 'fortune-flow-project-failure-56c631ee' WHERE id = '56c631ee-c970-4f23-a776-b844fa043aea';
-- 공들인 프로젝트가 막판에 엎어질 때 확인해야 할 공망과 파살
UPDATE columns SET slug = 'health-retirement-preparation-d266d217' WHERE id = 'd266d217-4f33-4055-b8d9-623057c59ddf';
-- 노후 준비가 불안할 때 확인해야 할 인성과 식상의 노년기 흐름
UPDATE columns SET slug = 'money-partnership-money-c818fa3e' WHERE id = 'c818fa3e-96a3-4fae-8446-42f1271408cb';
-- 동업을 고민 중이라면 반드시 확인해야 할 비겁과 재성의 관계
UPDATE columns SET slug = 'love-marriage-boredom-f6ab0c92' WHERE id = 'f6ab0c92-6701-4000-a38b-34c074de5adf';
-- 결혼 생활의 권태기가 유독 길어질 때 확인해야 할 일지 원진살
UPDATE columns SET slug = 'relation-business-partner-conflict-ca1d4df6' WHERE id = 'ca1d4df6-9082-4083-ab71-d0d34966a2d6';
-- 사업 파트너와 사사건건 부딪힐 때 점검해야 할 지지 형살과 원진
UPDATE columns SET slug = 'luck-new-home-moving-2ae23407' WHERE id = '2ae23407-7d4a-4bff-ba6f-3715583c5ce2';
-- 새집 이사 후 우환이 겹칠 때 체크해야 할 방위와 합충의 변화
UPDATE columns SET slug = 'family-children-study-c0e4bb92' WHERE id = 'c0e4bb92-dfbb-4d50-85e5-3a9284e1e48f';
-- 공부 효율이 오르지 않는 자녀를 위한 사주상 인성과 식상의 조절
UPDATE columns SET slug = 'money-wealth-leak-2ab03b7e' WHERE id = '2ab03b7e-7b07-4f04-877d-d4f2626ef279';
-- 재물운이 새나가는 쟁재(爭財) 현상을 막는 지갑 관리와 오행 보완법
UPDATE columns SET slug = 'career-exam-failure-e55e0eda' WHERE id = 'e55e0eda-0ea9-4a6c-b1e5-e4be3df148ad';
-- 시험이나 자격증 취득이 자꾸 미끄러질 때 확인해야 할 관인상생의 단절
UPDATE columns SET slug = 'relation-bad-relationship-da1a0ab3' WHERE id = 'da1a0ab3-1db8-43e7-b7d6-162f28ee787f';
-- 새로운 인연이 자꾸 나를 힘들게 할 때 점검해야 할 악연의 사주 구조
UPDATE columns SET slug = 'family-family-communication-90b3867b' WHERE id = '90b3867b-6f9e-4345-b665-fb4bf9e80539';
-- 가족 간의 대화가 단절되고 고립감을 느낄 때 점검해야 할 비겁의 충돌
UPDATE columns SET slug = 'money-contract-deal-7ce3dbac' WHERE id = '7ce3dbac-2154-4dd8-bfd4-ccef5a3b3e08';
-- 문서 계약이나 매매가 자꾸 성사되지 않을 때 점검해야 할 인성의 고립
UPDATE columns SET slug = 'money-new-business-d972ab00' WHERE id = 'd972ab00-bab7-436a-9a01-640b2bce0229';
-- 신규 사업이나 확장을 고민할 때 반드시 살펴야 할 식신생재의 동력
UPDATE columns SET slug = 'family-children-career-10175e9d' WHERE id = '10175e9d-5fde-4aa8-9000-879b524f6e28';
-- 자녀의 진로 결정이 막막할 때 참고해야 할 월령과 격국의 힘
UPDATE columns SET slug = 'fortune-flow-gossip-slander-bc420b12' WHERE id = 'bc420b12-bc2a-4d6f-a6dc-20febe2f491c';
-- 구설수와 비방이 끊이지 않을 때 확인해야 할 상관의 돌출과 대처법
UPDATE columns SET slug = 'money-self-employed-sales-c67535fb' WHERE id = 'c67535fb-59a4-4986-89aa-3cc32b7f1dcd';
-- 자영업 매출이 급격히 줄어들 때 점검해야 할 식상과 재성의 흐름
UPDATE columns SET slug = 'family-children-conflict-045f10df' WHERE id = '045f10df-b999-481d-a490-f3313d15f7c5';
-- 자녀와의 갈등이 심해질 때 확인해야 할 사주상 상관견관의 원리
UPDATE columns SET slug = 'career-startup-item-d1cb52ab' WHERE id = 'd1cb52ab-7add-46ef-9225-ffcae43eee5f';
-- 창업 아이템 선정이 고민될 때 확인해야 할 본인의 오행과 직업운

-- 총 61개 업데이트

-- /tmp/column_slugs.json 저장 완료
