import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function render(options: { path: string }) {
  // SEO를 위한 메타 데이터 정의
  // 꿈해몽 슬러그 → 한글 키워드 매핑 테이블 (SEO 최적화)
const dreamKeywordMap: Record<string, { keyword: string; metaTitle: string }> = {
  "adopting-white-puppy-dream": { keyword: "하얀색 강아지를 입양하는 꿈", metaTitle: "흰 강아지 꿈 해몽 | 진실한 인연과 정서적 행복 | 무운" },
  "airplane-crash-dream-warning": { keyword: "비행기가 공중에서 폭발하거나 추락하는 것을 보는 꿈", metaTitle: "비행기 추락 꿈 해몽 실패를 막기 위한 조언 | 무운" },
  "ancestor-dressing-new-clothes-dream": { keyword: "돌아가신 부모님이 환하게 웃으며 새 옷을 입혀주시는 꿈", metaTitle: "부모님이 옷 입혀주는 꿈 해몽 조상의 덕으로 부자 되는 법 | 무운" },
  "ancestor-giving-money-dream": { keyword: "돌아가신 조상님이 보따리에 돈을 담아 건네주는 꿈", metaTitle: "조상님이 돈 주는 꿈 해몽 로또 당첨의 결정적 증거 | 무운" },
  "ancestors-smiling-dream": { keyword: "돌아가신 조상님이 환하게 웃으며 나타나는 꿈", metaTitle: "돌아가신 조상님이 웃는 꿈 해몽 귀인이 나타날 징조 | 무운" },
  "celebrity-dating-dream-meaning": { keyword: "연예인과 즐겁게 데이트하는 꿈", metaTitle: "연예인 데이트 꿈 해몽 | 이상형과의 만남 신호 | 무운" },
  "dating-boss-dream-meaning": { keyword: "직장 상사와 사귀는 꿈", metaTitle: "상사와 사귀는 꿈 해몽 | 인정과 승진의 암시 | 무운" },
  "entering-palace-castle-dream": { keyword: "궁궐이나 성에 들어가는 꿈", metaTitle: "궁궐 들어가는 꿈 해몽 | 권력과 명예 상승의 신호 | 무운" },
  "actor-kiss-dream-meaning": { keyword: "배우와 키스하는 꿈", metaTitle: "배우와 키스하는 꿈 해몽 | 새로운 인연과 행운의 예고 | 무운" },
  "meeting-president-king-dream": { keyword: "대통령이나 왕을 만나는 꿈", metaTitle: "대통령·왕 만나는 꿈 해몽 | 큰 행운과 귀인의 등장 | 무운" },
  "marrying-a-stranger-dream-meaning": { keyword: "모르는 사람과 결혼하는 꿈", metaTitle: "낯선 사람과 결혼하는 꿈 해몽 | 새로운 시작과 변화의 암시 | 무운" },
  "meeting-president-celebrity-dream-2": { keyword: "대통령이나 유명인을 만나는 꿈", metaTitle: "유명인 만나는 꿈 해몽 | 귀인의 도움과 행운 | 무운" },
  "celebrity-giving-money-dream": { keyword: "연예인이 돈을 주는 꿈", metaTitle: "연예인이 돈 주는 꿈 해몽 | 뜻밖의 재물운 상승 | 무운" },
  "ancient-jar-gold-coins-dream": { keyword: "깊은 땅속에서 수천 년 된 청자 항아리에 금화가 가득 담겨 나오는 꿈", metaTitle: "청자 항아리 금화 꿈 해몽 잠들었던 재물운이 깨어난다 | 무운" },
  "argument-person-disappearing-dream": { keyword: "소중한 사람과 말다툼을 하다가 상대방이 갑자기 증발하듯 사라지는 꿈", metaTitle: "다투다 사라지는 꿈 해몽 이별 불안 극복하기 | 무운" },
  "banquet-with-influential-people-dream": { keyword: "화려한 연회장에서 높은 분들과 함께 술을 마시며 즐거워하는 꿈", metaTitle: "연회 꿈 해몽 귀인을 만나 부자가 되는 지름길 | 무운" },
  "barley-ears-field-dream": { keyword: "넓은 들판에 보리 이삭이 패는 꿈", metaTitle: "보리 꿈 해몽 | 미래의 약속과 점진적인 성공 | 무운" },
  "bathing-in-clean-water-dream": { keyword: "맑은 물에 깨끗하게 목욕을 하는 꿈", metaTitle: "목욕하는 꿈 해몽 걱정은 씻고 복은 채우고 | 무운" },
  "being-chased-dream-anxiety": { keyword: "모르는 사람에게 쫓기며 공포를 느끼는 꿈", metaTitle: "쫓기는 꿈 해몽 내 마음의 스트레스 신호 | 무운" },
  "being-chased-dream-meaning": { keyword: "누군가에게 쫓기는 꿈", metaTitle: "누군가에게 쫓기는 꿈 스트레스 관리법 | 무운" },
  "being-praised-in-public": { keyword: "많은 사람 앞에서 칭찬받는 꿈", metaTitle: "칭찬받는 꿈 해몽 | 명예운의 정점과 자존감 상승 | 무운" },
  "being-stabbed-dream-meaning": { keyword: "누군가 나를 찌르는 꿈", metaTitle: "찔리는 꿈 해몽 | 무서운 꿈 뒤의 놀라운 반전 | 무운" },
  "being-watched-dream-privacy-stress": { keyword: "모르는 사람이 내 방이나 화장실을 계속 훔쳐보고 있는 꿈", metaTitle: "누군가 훔쳐보는 꿈 해몽 심리적 경계선 세우기 | 무운" },
  "big-snake-wrapping-body-dream": { keyword: "커다란 구렁이가 몸을 감싸는 꿈", metaTitle: "구렁이 꿈 해몽 태몽과 재물운의 정석 | 무운" },
  "bird-singing-at-window": { keyword: "예쁜 새가 창가에서 우는 꿈", metaTitle: "창가 새 꿈 해몽 | 반가운 소식과 행운의 시작 | 무운" },
  "black-cat-entering-house-dream": { keyword: "검은 고양이가 집 안으로 들어오는 꿈", metaTitle: "검은 고양이 들어오는 꿈 주의해야 할 징조 | 무운" },
  "bleeding-dream-meaning": { keyword: "피를 많이 흘리는 꿈", metaTitle: "피 흘리는 꿈 해몽 재물과 생명력의 상승 | 무운" },
  "bleeding-from-wound-dream": { keyword: "날카로운 칼이나 흉기에 찔려 피를 흘리는 꿈", metaTitle: "피 흘리는 꿈 해몽 재물운이 터지는 강력한 신호 | 무운" },
  "bleeding-wont-stop-dream-exhaustion": { keyword: "몸에 큰 상처가 났는데 피가 멈추지 않고 계속 솟구치는 꿈", metaTitle: "피가 멈추지 않는 꿈 해몽 번아웃 증후군 극복 | 무운" },
  "blooming-flowers-field-dream": { keyword: "넓은 들판에 예쁜 꽃들이 만발한 것을 보는 꿈", metaTitle: "꽃밭 꿈 해몽 사랑과 행복이 피어날 징조 | 무운" },
  "body-turning-into-rock-dream": { keyword: "자신의 몸이 거대한 바위로 변하여 흔들림 없이 서 있는 꿈", metaTitle: "바위 꿈 해몽 무너지지 않는 거대한 부의 성벽 | 무운" },
  "boiling-cauldron-food-dream": { keyword: "커다란 가마솥에 음식이 가득 차 보글보글 끓고 있는 꿈", metaTitle: "가마솥 음식 꿈 해몽 끊이지 않는 재물운의 원천 | 무운" },
  "bright-light-from-sky-dream": { keyword: "하늘에서 오색찬란한 빛이 나를 비추는 꿈", metaTitle: "빛이 비추는 꿈 해몽 하늘이 돕는 운세 | 무운" },
  "broken-glasses-blurry-vision-dream": { keyword: "안경이 깨지거나 분실되어 앞이 흐릿하게만 보이는 꿈", metaTitle: "안경 깨지는 꿈 해몽 혼란스러운 미래의 돌파구 | 무운" },
  "broken-mirror-dream-meaning": { keyword: "거울이 산산조각 나거나 깨지는 꿈", metaTitle: "거울 깨지는 꿈 해몽 이별과 손실의 징조 | 무운" },
  "broken-phone-dream-isolation": { keyword: "전화기가 고장 나거나 신호가 안 잡혀 도움을 요청하지 못하는 꿈", metaTitle: "전화기 고장 꿈 해몽 소통의 단절과 고립감 해소 | 무운" },
  "busy-market-dream-meaning": { keyword: "시장에서 활기찬 사람들과 부딪히는 꿈", metaTitle: "시장 꿈 해몽 | 활발한 경제활동과 인맥운 | 무운" },
  "butterfly-and-flowers-dream": { keyword: "꽃에서 나비가 춤추며 날아다니는 꿈", metaTitle: "나비 꿈 해몽 사랑과 행복이 찾아올 징조 | 무운" },
  "butterfly-on-shoulder-dream": { keyword: "예쁜 나비가 어깨에 앉는 꿈", metaTitle: "나비 꿈 해몽 | 연애운 상승과 기분 좋은 변화 | 무운" },
  "calm-stream-water-dream": { keyword: "잔잔한 시냇물을 바라보는 꿈", metaTitle: "맑은 시냇물 꿈 해몽 | 마음의 평화와 안정적인 흐름 | 무운" },
  "cannot-find-toilet-dream-meaning": { keyword: "화장실을 찾지 못해 헤매는 꿈", metaTitle: "화장실 찾는 꿈 해몽 | 답답한 마음의 이유 | 무운" },
  "car-brake-failure-dream-control": { keyword: "운전 중에 브레이크가 고장 나 차를 멈출 수 없는 꿈", metaTitle: "자동차 브레이크 고장 꿈 해몽 폭주하는 일상 멈추기 | 무운" },
  "cargo-ship-entering-port-dream": { keyword: "큰 배가 화물을 가득 싣고 항구로 들어오는 것을 보는 꿈", metaTitle: "배 들어오는 꿈 해몽 막대한 부가 항구에 도착하다 | 무운" },
  "carrying-torch-in-dark-dream": { keyword: "캄캄한 밤에 홀로 등불이나 횃불을 들고 가는 꿈", metaTitle: "등불 꿈 해몽 어둠 속에서 찾는 성공의 길 | 무운" },
  "cat-entering-house-dream-meaning": { keyword: "고양이가 집으로 들어오는 꿈", metaTitle: "고양이가 들어오는 꿈 해몽 | 인연일까 경고일까? | 무운" },
  "catch-big-carp-clear-water-dream": { keyword: "맑고 깊은 물속에서 커다란 잉어를 두 손으로 잡는 꿈", metaTitle: "잉어 잡는 꿈 해몽 - 맑은 물속 커다란 잉어를 두 손으로 잡는 꿈의 의미 | 무운" },
  "catching-giant-carp-dream": { keyword: "엄청나게 큰 잉어를 잡는 꿈", metaTitle: "큰 잉어 잡는 꿈 해몽 | 대박 운세와 태몽 | 무운" },
  "catching-many-fish-dream": { keyword: "바다에서 그물을 던져 수많은 물고기를 잡아 올리는 꿈", metaTitle: "물고기 많이 잡는 꿈 해몽 일확천금의 기회 포착 | 무운" },
  "celebrity-confession-dream-meaning": { keyword: "좋아하는 연예인이 나에게 고백하는 꿈", metaTitle: "연예인이 고백하는 꿈 해몽 | 연애운 폭발 징조? | 무운" },
  "changing-into-clean-clothes": { keyword: "깨끗한 옷으로 갈아입는 꿈", metaTitle: "깨끗한 옷 갈아입는 꿈 해몽 | 새로운 시작과 이미지 변신 | 무운" },
  "changing-into-silk-clothes-dream": { keyword: "낡은 옷을 벗어 던지고 비단으로 만든 화려한 옷으로 갈아입는 꿈", metaTitle: "비단 옷 입는 꿈 해몽 가난을 벗고 부귀를 입다 | 무운" },
  "choosing-books-in-bookstore": { keyword: "서점에서 책을 고르는 꿈", metaTitle: "서점 책 고르는 꿈 해몽 | 지혜의 습득과 성공의 열쇠 | 무운" },
  "cleaning-the-room-dream": { keyword: "방 안을 깨끗하게 청소하는 꿈", metaTitle: "방 청소하는 꿈 해몽 | 근심 해소와 새로운 출발 | 무운" },
  "clear-water-filling-house-dream": { keyword: "집안에 맑은 물이 가득 차는 꿈", metaTitle: "집에 물이 가득 차는 꿈 재물운이 터지는 신호 | 무운" },
  "clear-water-flooding-house-dream": { keyword: "맑은 물이 집안에 가득 차는 꿈", metaTitle: "집에 물이 가득 차는 꿈 재물운이 터지는 신호 | 무운" },
  "climbing-mountain-peak-dream": { keyword: "산 정상에 올라 세상을 내려다보는 꿈", metaTitle: "산 정상 꿈 해몽 최고의 명예와 성취의 순간 | 무운" },
  "colorful-bird-flies-into-house-dream": { keyword: "화려하고 아름다운 깃털을 가진 새가 집 안으로 날아드는 꿈", metaTitle: "화려한 새가 집 안으로 날아드는 꿈 해몽 - 아름다운 깃털 새 꿈의 의미 | 무운" },
  "colorful-birds-in-yard-dream": { keyword: "화려한 깃털을 가진 새들이 내 집 마당에 가득 모여 노래하는 꿈", metaTitle: "새가 모여드는 꿈 해몽 경사와 재물이 줄을 잇다 | 무운" },
  "covered-in-poop-dream": { keyword: "자신의 몸이 똥으로 범벅이 되어 불쾌함을 느끼지 않는 꿈", metaTitle: "똥 범벅 되는 꿈 해몽 현실에서는 돈 벼락 맞는 꿈 | 무운" },
  "crossing-broken-bridge-dream": { keyword: "낡고 부서진 다리를 아슬아슬하게 건너며 밑을 보지 못하는 꿈", metaTitle: "무너지는 다리 건너는 꿈 해몽 위기 돌파 전략 | 무운" },
  "cutting-hair-dream-meaning": { keyword: "머리카락을 깔끔하게 자르거나 다듬는 꿈", metaTitle: "머리 자르는 꿈 해몽 새로운 시작과 근심 해소 | 무운" },
  "dancing-in-fancy-clothes-dream": { keyword: "화려한 옷을 입고 춤추는 꿈", metaTitle: "춤추는 꿈 해몽 | 주인공이 될 당신을 위해 | 무운" },
  "dark-muddy-water-dream": { keyword: "깊고 어두운 흙탕물에 빠져 허우적거리는 꿈", metaTitle: "흙탕물에 빠지는 꿈 해몽 - 어두운 물에 빠져 허우적거리는 꿈의 의미 | 무운" },
  "dating-celebrity-dream-meaning": { keyword: "연예인과 즐겁게 대화하거나 데이트하는 꿈", metaTitle: "연예인 꿈 해몽 인기와 명예가 따를 징조 | 무운" },
  "dead-person-scolding-dream-guilt": { keyword: "이미 돌아가신 분이 살아 돌아와 나를 엄하게 꾸짖는 꿈", metaTitle: "돌아가신 분이 꾸짖는 꿈 해몽 죄책감 털어내기 | 무운" },
  "death-dream-family-dies-corpse-dream": { keyword: "내가 죽는 꿈", metaTitle: "내가 죽는 꿈, 가족이 죽는 꿈, 시체 꿈 해몽 - 죽음 꿈의 진짜 의미 | 무운" },
  "deceased-ancestors-smiling-dream": { keyword: "돌아가신 조상님이 환하게 웃으며 나타나는 꿈", metaTitle: "돌아가신 조상님이 웃는 꿈 해몽 길몽일까 | 무운" },
  "deceased-grandmother-smiling-dream": { keyword: "돌아가신 할머니가 웃으며 나타나는 꿈", metaTitle: "돌아가신 할머니가 나오는 꿈 | 조상님이 주신 선물 | 무운" },
  "discovering-gems-cave-dream": { keyword: "깊은 동굴 속에서 반짝이는 보석들을 한가득 발견하는 꿈", metaTitle: "보석 발견 꿈 해몽 숨겨진 재물운이 깨어난다 | 무운" },
  "distorted-mirror-dream-self-esteem": { keyword: "거울 속 내 얼굴이 흉측하게 변해 있거나 이목구비가 사라진 꿈", metaTitle: "거울 속 변한 얼굴 꿈 해몽 자아 찾기 솔루션 | 무운" },
  "dog-bite-dream-meaning": { keyword: "개에게 물리는 꿈", metaTitle: "개한테 물리는 꿈 해몽 | 배신인가 재물인가? | 무운" },
  "dog-wagging-tail-dream-meaning": { keyword: "강아지가 꼬리를 흔들며 다가오는 꿈", metaTitle: "강아지가 꼬리 흔드는 꿈 해몽 | 대인운 상승과 정서적 안정 | 무운" },
  "dove-flying-peacefully-dream": { keyword: "비둘기가 평화롭게 날아가는 꿈", metaTitle: "비둘기 꿈 해몽 | 화해와 평화 그리고 자유 | 무운" },
  "dragon-ascending-to-heaven-dream": { keyword: "용이 하늘로 승천하는 것을 보는 꿈", metaTitle: "용 꿈 해몽 출세와 성공의 완벽한 징조 | 무운" },
  "dragon-ascending-to-sky-dream": { keyword: "깨끗한 물에서 용이 승천하는 꿈", metaTitle: "용이 하늘로 오르는 꿈 해몽 합격과 승진의 신호 | 무운" },
  "dragon-tail-ascension-dream": { keyword: "하늘로 솟구치는 용의 꼬리를 붙잡고 함께 올라가는 꿈", metaTitle: "용 꼬리 잡고 올라가는 꿈 해몽 거대한 성공의 서막 | 무운" },
  "dream-ancestor-smiling": { keyword: "돌아가신 조상님이 환하게 웃으며 나타나는 꿈", metaTitle: "조상님이 웃는 꿈 해몽 귀인이 나타날 징조" },
  "dream-bleeding-body": { keyword: "온몸에 피가 묻거나 피를 흘리는 꿈", metaTitle: "피 흘리는 꿈 해몽 재물운이 터지는 반전 결과" },
  "dream-butterflies-in-flower-garden": { keyword: "아름다운 꽃밭에서 나비들이 춤추는 것을 보는 꿈", metaTitle: "꽃밭 나비 꿈 해몽 사랑과 예술적 성공" },
  "dream-changing-into-new-clothes": { keyword: "낡은 옷을 벗고 새 옷으로 갈아입는 꿈", metaTitle: "옷 갈아입는 꿈 해몽 인생의 새로운 막이 오르다" },
  "dream-chased-by-wolf": { keyword: "날카로운 이빨을 가진 늑대에게 쫓기는 꿈", metaTitle: "늑대 꿈 해몽 위협적인 상황과 심리적 대처" },
  "dream-crossing-wide-river": { keyword: "넓은 강물을 건너 반대편으로 건너가는 꿈", metaTitle: "강 건너는 꿈 해몽 고난 끝에 찾아온 성공" },
  "dream-dark-face-in-mirror": { keyword: "거울 속의 내 얼굴이 검게 변해 있는 꿈", metaTitle: "거울 꿈 해몽 내 얼굴이 변했다면 주의하세요" },
  "dream-dead-person-coming-alive": { keyword: "죽은 사람이 다시 살아나서 집으로 들어오는 꿈", metaTitle: "죽은 사람이 살아나는 꿈 해몽 과거의 귀환" },
  "dream-dragon-ascending-to-heaven": { keyword: "하늘로 용이 승천하는 것을 구경하는 꿈", metaTitle: "용 승천 꿈 해몽 인생 최고의 명예운" },
  "dream-falling-from-cliff": { keyword: "높은 절벽에서 아래로 떨어지는 꿈", metaTitle: "절벽에서 떨어지는 꿈 해몽 심리적 압박과 주의점" },
  "dream-field-on-fire": { keyword: "넓은 들판에 불이 활활 타오르는 것을 보는 꿈", metaTitle: "들판에 불나는 꿈 해몽 막을 수 없는 성공의 기운" },
  "dream-finding-wild-ginseng": { keyword: "깊은 산속에서 산삼을 발견하고 캐는 꿈", metaTitle: "산삼 꿈 해몽 천운이 따르는 재물과 건강" },
  "dream-flowers-on-dead-tree": { keyword: "죽은 나무에서 꽃이 피어나는 꿈", metaTitle: "고목 꽃 꿈 해몽 기적적인 재기와 성공의 상징" },
  "dream-flying-in-airplane": { keyword: "비행기를 타고 구름 사이를 나는 꿈", metaTitle: "비행기 타는 꿈 해몽 성공을 향한 비상" },
  "dream-giant-leading-way": { keyword: "신령한 거인이 나타나 앞길을 인도하는 꿈", metaTitle: "거인 꿈 해몽 위대한 조력자와 성공의 지도" },
  "dream-gold-pig-entry": { keyword: "황금 돼지가 집 안으로 들어오는 꿈", metaTitle: "황금 돼지 꿈 해몽 복권 당첨의 징조일까" },
  "dream-golden-key": { keyword: "황금 열쇠를 손에 쥐는 꿈", metaTitle: "황금 열쇠 꿈 해몽 모든 문이 열리는 최고의 운세" },
  "dream-golden-rice-field": { keyword: "넓은 들판에 황금빛 벼가 가득 익어 있는 꿈", metaTitle: "황금 들판 꿈 해몽 풍요와 결실의 상징" },
  "dream-holding-newborn-baby": { keyword: "갓 태어난 아기를 안아주는 꿈", metaTitle: "아기 안는 꿈 해몽 새로운 시작과 책임의 무게" },
  "dream-house-full-of-pythons": { keyword: "집안에 구렁이가 가득 들어차 있는 꿈", metaTitle: "구렁이 꿈 해몽 집안으로 쏟아지는 재물운" },
  "dream-losing-shoes-searching": { keyword: "신발을 잃어버려 당황하며 찾는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 불안의 원인은 무엇일까" },
  "dream-lost-in-forest": { keyword: "숲속에서 길을 잃고 헤매는 꿈", metaTitle: "길 잃는 꿈 해몽 혼란 속에서 방향 찾기" },
  "dream-money-falling-from-sky": { keyword: "하늘에서 돈이 눈처럼 내려 쌓이는 꿈", metaTitle: "하늘에서 돈 내리는 꿈 해몽 횡재수의 끝판왕" },
  "dream-mountain-top-clouds": { keyword: "높은 산 정상에 올라 구름 위를 걷는 꿈", metaTitle: "산 정상 구름 꿈 해몽 승진과 합격의 신호" },
  "dream-moving-new-house": { keyword: "넓고 화려한 새 집으로 이사하는 꿈", metaTitle: "이사하는 꿈 해몽 신분 상승과 새로운 출발" },
  "dream-name-carved-on-rock": { keyword: "큰 바위에 이름이 새겨져 있는 것을 보는 꿈", metaTitle: "바위 이름 꿈 해몽 영원한 명예와 입신양명" },
  "dream-overflowing-toilet-waste": { keyword: "화장실에서 변이 넘쳐흐르는 것을 보는 꿈", metaTitle: "대변 꿈 해몽 재물운이 폭발하는 순간" },
  "dream-picking-up-jewels": { keyword: "깊은 숲속에서 반짝이는 보석을 줍는 꿈", metaTitle: "보석 줍는 꿈 해몽 인연과 재물의 만남" },
  "dream-picking-up-pearls-from-lake": { keyword: "깊고 맑은 호수에서 진주를 건져 올리는 꿈", metaTitle: "진주 꿈 해몽 고귀한 성취와 지혜의 발견" },
  "dream-pillar-breaking": { keyword: "집안의 기둥이 부러지거나 무너지는 꿈", metaTitle: "기둥 무너지는 꿈 해몽 위기 관리와 대처법" },
  "dream-rain-soaking-earth": { keyword: "비가 내려 메마른 대지를 적시는 꿈", metaTitle: "비 내리는 꿈 해몽 가뭄 끝의 축복과 회복" },
  "dream-rainbow-in-clear-sky": { keyword: "맑은 하늘에 무지개가 화려하게 펼쳐진 꿈", metaTitle: "무지개 꿈 해몽 인생 최고의 경사와 축복" },
  "dream-reconciling-with-enemy": { keyword: "원수나 싫어하는 사람과 화해하고 웃는 꿈", metaTitle: "원수와 화해하는 꿈 해몽 평화와 협력의 시작" },
  "dream-red-peppers-in-field": { keyword: "붉은 고추가 밭에 가득 열려 있는 꿈", metaTitle: "고추 꿈 해몽 열정과 재물의 폭발적 성장" },
  "dream-riding-turtle-ocean": { keyword: "거북이를 타고 바다를 건너는 꿈", metaTitle: "거북이 타는 꿈 해몽 건강과 성공의 동반자" },
  "dream-riding-whale-sea": { keyword: "바다에서 커다란 고래를 타고 헤엄치는 꿈", metaTitle: "고래 타는 꿈 해몽 거대한 기회가 몰려온다" },
  "dream-shaking-hands-with-president": { keyword: "대통령이나 고귀한 인물과 악수하는 꿈", metaTitle: "대통령과 악수하는 꿈 해몽 명예와 성공의 정점" },
  "dream-shouting-on-mountain-top": { keyword: "산 정상에서 호령하며 큰 소리로 외치는 꿈", metaTitle: "산에서 외치는 꿈 해몽 자신감의 회복과 성공" },
  "dream-snake-biting-leg": { keyword: "뱀에게 다리를 물려 피가 나는 꿈", metaTitle: "뱀에게 물리는 꿈 해몽 재물운과 귀인의 조력" },
  "dream-stabbed-by-stranger": { keyword: "낯선 사람에게 칼에 찔려 피가 나는 꿈", metaTitle: "칼에 찔리는 꿈 해몽 무서운 만큼 커지는 행운" },
  "dream-stuck-in-pit": { keyword: "깊은 구덩이에 빠져 나오지 못하고 허우적대는 꿈", metaTitle: "구덩이 꿈 해몽 위기 탈출을 위한 조언" },
  "dream-surviving-giant-wave": { keyword: "거대한 파도가 덮치지만 휩쓸리지 않는 꿈", metaTitle: "파도 꿈 해몽 위기를 기회로 바꾸는 힘" },
  "dream-sweet-kiss": { keyword: "이성을 만나 달콤하게 입맞춤하는 꿈", metaTitle: "키스하는 꿈 해몽 반가운 소식과 인연의 결합" },
  "dream-teeth-falling-out": { keyword: "입 안에서 이빨이 빠지는 꿈", metaTitle: "이 빠지는 꿈 해몽 주의해야 할 변화와 대처법" },
  "dream-tiger-biting": { keyword: "무서운 호랑이에게 물리는 꿈", metaTitle: "호랑이한테 물리는 꿈 해몽 권력과 명예를 얻다" },
  "dream-treasure-ship-in-ocean": { keyword: "바다 한가운데서 보물선을 발견하는 꿈", metaTitle: "보물선 꿈 해몽 막대한 부의 통로를 찾다" },
  "dream-twinkling-stars-in-sky": { keyword: "하늘에 수많은 별들이 반짝이는 것을 보는 꿈", metaTitle: "별 꿈 해몽 무한한 가능성과 영예의 순간" },
  "dream-two-suns-in-sky": { keyword: "하늘에 두 개의 태양이 떠 있는 것을 보는 꿈", metaTitle: "두 개의 태양 꿈 해몽 강력한 기운의 충돌" },
  "dream-walking-naked-confidently": { keyword: "나체로 거리를 활보하며 당당해하는 꿈", metaTitle: "나체 꿈 해몽 당당함이 부르는 명예와 성공" },
  "dream-watching-sunset": { keyword: "붉게 물든 노을을 바라보며 감동하는 꿈", metaTitle: "노을 꿈 해몽 평온한 마무리와 새로운 희망" },
  "dream-wearing-gold-ring": { keyword: "화려한 금반지를 손가락에 끼는 꿈", metaTitle: "금반지 끼는 꿈 해몽 계약과 인연의 성사" },
  "dream-wearing-white-clothes": { keyword: "눈부시게 하얀 옷을 입고 거리를 걷는 꿈", metaTitle: "하얀 옷 꿈 해몽 신분 상승과 순수한 성공" },
  "dream-white-hair": { keyword: "머리카락이 하얗게 세어버린 꿈", metaTitle: "흰 머리 꿈 해몽 지혜와 장수의 축복" },
  "dreaming-clear-well-water": { keyword: "맑은 물이 솟구치는 우물을 발견하는 꿈", metaTitle: "맑은 우물 꿈 해몽 성공의 샘물이 터진다" },
  "dreaming-of-cockroaches": { keyword: "바퀴벌레가 떼 지어 나오는 꿈", metaTitle: "바퀴벌레 꿈 해몽 | 징그러운 꿈의 경고 | 무운" },
  "dreaming-of-ex-boyfriend-girlfriend": { keyword: "헤어진 전 남자친구 또는 전 여자친구를 만나는 꿈", metaTitle: "전 애인 꿈 해몽 | 재회일까 미련일까? | 무운" },
  "dreaming-of-flying-in-the-sky": { keyword: "하늘을 자유롭게 날아다니는 꿈", metaTitle: "하늘을 나는 꿈 해몽 | 성공과 해방의 상징 | 무운" },
  "dreaming-of-making-mistakes-on-exam-papers": { keyword: "시험을 보는데 답을 밀려 쓰는 꿈", metaTitle: "시험 답 밀려 쓰는 꿈 해몽 | 실수인가 기회인가? | 무운" },
  "dreaming-of-winning-lottery": { keyword: "로또 복권에 당첨되는 꿈", metaTitle: "로또 당첨 꿈 해몽 | 진짜 사러 가야 할까? | 무운" },
  "drinking-gem-dust-milky-way-dream": { keyword: "은하수가 흐르는 밤하늘을 보며 보석 가루를 마시는 꿈", metaTitle: "은하수 보석 꿈 해몽 하늘이 내린 영광과 부 | 무운" },
  "drinking-spring-water-mountain": { keyword: "산 중턱에서 맑은 샘물을 마시는 꿈", metaTitle: "샘물 꿈 해몽 | 지혜의 발견과 건강 회복 | 무운" },
  "drinking-warm-soup-dream": { keyword: "따뜻한 국물을 마시는 꿈", metaTitle: "따뜻한 국물 마시는 꿈 해몽 | 건강 회복과 정서적 위안 | 무운" },
  "drowning-dream-suffocation-stress": { keyword: "깊은 물속에서 숨을 쉴 수 없어 허우적거리며 고통받는 꿈", metaTitle: "물속에서 숨 못 쉬는 꿈 해몽 압박감에서 벗어나기 | 무운" },
  "dying-in-dream-rebirth": { keyword: "누군가에게 죽임을 당하거나 내가 죽는 꿈", metaTitle: "죽는 꿈 해몽 무서워 마세요 인생 역전의 기회 | 무운" },
  "eating-an-apple-dream": { keyword: "사과를 한 입 크게 베어 무는 꿈", metaTitle: "사과 먹는 꿈 해몽 | 결실의 기쁨과 연애운 상승 | 무운" },
  "eating-delicious-food-dream": { keyword: "맛있는 음식을 배불리 먹는 꿈", metaTitle: "맛있는 음식 먹는 꿈 해몽 | 먹을 복과 재물운 | 무운" },
  "eating-gold-rice-cauldron-dream": { keyword: "커다란 가마솥 가득 금비빔밥이 들어있는 것을 맛있게 먹는 꿈", metaTitle: "금비빔밥 먹는 꿈 해몽 실속 있는 재물이 쏟아진다 | 무운" },
  "eating-sand-hair-dream-meaning": { keyword: "입안 가득 모래나 머리카락이 들어가 뱉어도 계속 나오는 꿈", metaTitle: "입안에 이물질 꿈 해몽 꼬여버린 인간관계 정리법 | 무운" },
  "elevator-up-and-down-dream-anxiety": { keyword: "엘리베이터가 멈추지 않고 계속 상승하거나 끝없이 추락하는 꿈", metaTitle: "엘리베이터 꿈 해몽 급격한 변화 속 중심 잡기 | 무운" },
  "embracing-gold-dream-meaning": { keyword: "황금을 품에 안는 꿈", metaTitle: "금 꿈 해몽 | 부귀영화의 상징, 당신의 것 | 무운" },
  "endless-dark-tunnel-dream-despair": { keyword: "어두컴컴한 터널 속을 끝없이 걷는데 출구의 빛이 전혀 보이지 않는 꿈", metaTitle: "터널 속 헤매는 꿈 해몽 희망을 찾는 마음의 눈 | 무운" },
  "endless-rain-grey-world-dream": { keyword: "비가 그치지 않고 계속 내려 온 세상이 잿빛으로 변하는 꿈", metaTitle: "계속 비 내리는 꿈 해몽 우울감 정화하기 | 무운" },
  "entering-a-cave-dream-meaning": { keyword: "깊은 구멍이나 동굴 속으로 들어가는 꿈", metaTitle: "동굴 꿈 해몽 내면의 탐험과 새로운 발견 | 무운" },
  "entering-palace-mansion-dream": { keyword: "화려한 궁궐이나 대저택 안으로 들어가는 꿈", metaTitle: "대저택 들어가는 꿈 해몽 성공과 부귀의 상징 | 무운" },
  "exam-failure-dream-stress": { keyword: "시험 시간에 늦거나 문제를 하나도 풀지 못해 당황하는 꿈", metaTitle: "시험 꿈 해몽 결과에 대한 강박 내려놓기 | 무운" },
  "face-turning-black-in-mirror-dream": { keyword: "거울 속의 내 얼굴이 검게 변해 있는 꿈", metaTitle: "거울 속 얼굴이 검은 꿈 해몽 건강 경고 신호 | 무운" },
  "failing-exam-dream-meaning": { keyword: "시험에 떨어져 울고 있는 꿈", metaTitle: "시험에 떨어지는 꿈 해몽 합격의 반전 신호 | 무운" },
  "failing-test-dream-stress": { keyword: "시험을 보는데 답안지를 채우지 못해 당황하는 꿈", metaTitle: "시험 꿈 해몽 당황스러운 상황이 주는 메시지 | 무운" },
  "falling-dream-anxiety-interpretation": { keyword: "끝도 없이 깊은 낭떠러지로 추락하는 꿈", metaTitle: "끝없는 추락 꿈 해몽 불안한 마음 치유하기 | 무운" },
  "falling-from-cliff-dream": { keyword: "높은 절벽에서 아래로 떨어지는 꿈", metaTitle: "떨어지는 꿈 해몽 키 크는 꿈일까 추락일까 | 무운" },
  "falling-from-high-place-dream": { keyword: "높은 곳에서 떨어지는 꿈", metaTitle: "떨어지는 꿈 해몽 | 키 크는 꿈 vs 추락하는 꿈 | 무운" },
  "falling-from-the-sky-dream": { keyword: "하늘에서 떨어지는 꿈", metaTitle: "떨어지는 꿈 해몽 불안감인가 성장인가 | 무운" },
  "falling-into-a-hole-dream": { keyword: "깊은 구덩이에 빠지는 꿈", metaTitle: "구덩이에 빠지는 꿈 해몽 | 위기를 기회로 바꾸려면 | 무운" },
  "fast-clock-dream-time-pressure": { keyword: "시계 바늘이 엄청나게 빨리 돌아가 세월이 순식간에 흐르는 꿈", metaTitle: "빨리 돌아가는 시계 꿈 해몽 시간 강박 탈출 | 무운" },
  "feather-falling-from-sky": { keyword: "부드러운 깃털이 하늘에서 내려오는 꿈", metaTitle: "깃털 꿈 해몽 | 정서적 안식과 고통의 해방 | 무운" },
  "fighting-with-friend-dream-meaning": { keyword: "친구와 심하게 싸우는 꿈", metaTitle: "친구랑 싸우는 꿈 해몽 | 우정 전선 이상 무? | 무운" },
  "finding-gold-vein-dream": { keyword: "땅을 파자마자 화려한 금맥이 끊임없이 나타나는 꿈", metaTitle: "금맥 꿈 해몽 멈추지 않는 돈줄이 터진다 | 무운" },
  "finding-lost-item-dream": { keyword: "잃어버렸던 물건을 다시 찾는 꿈", metaTitle: "잃어버린 물건 찾는 꿈 해몽 | 재회와 명예 회복의 기회 | 무운" },
  "finding-oasis-desert-dream": { keyword: "끝없는 사막을 걷다가 화려한 오아시스를 발견하는 꿈", metaTitle: "오아시스 꿈 해몽 고난 끝에 찾아오는 막대한 재물 | 무운" },
  "finding-toilet-dream-emotional-release": { keyword: "화장실을 찾지 못해 헤매거나 더러운 화장실만 발견하는 꿈", metaTitle: "화장실 꿈 해몽 답답한 현실의 탈출구 찾기 | 무운" },
  "finding-wild-ginseng-dream": { keyword: "깊은 산속에서 빛나는 산삼을 발견하는 꿈", metaTitle: "산삼 꿈 해몽 태몽인가 횡재수인가 | 무운" },
  "finger-nail-pulled-out-dream": { keyword: "손톱이 뒤집히거나 뿌리째 뽑혀 극심한 고통을 느끼는 꿈", metaTitle: "손톱 빠지는 꿈 해몽 무너진 방어 기제 회복 | 무운" },
  "floating-in-space-suffocation-dream": { keyword: "끝없는 우주 공간에 홀로 떠다니며 공기가 점점 희박해지는 꿈", metaTitle: "우주 홀로 떠다니는 꿈 해몽 깊은 소외감 치유 | 무운" },
  "floating-in-the-air-dream": { keyword: "자신의 몸이 공중으로 둥둥 떠오르며 기분이 상쾌한 꿈", metaTitle: "몸이 뜨는 꿈 해몽 재물운과 기운의 수직 상승 | 무운" },
  "flood-house-underwater-dream": { keyword: "홍수로 인해 집이 잠기고 가재도구가 모두 떠내려가는 꿈", metaTitle: "홍수로 집 잠기는 꿈 해몽 감정 과부하 해소법 | 무운" },
  "flood-water-entering-house-dream": { keyword: "온 동네가 물바다가 되어 집안까지 맑은 물이 넘쳐나는 꿈", metaTitle: "집안에 물이 넘치는 꿈 해몽 재물이 폭포처럼 쏟아진다 | 무운" },
  "flowers-over-stone-wall": { keyword: "돌담 너머로 예쁜 꽃이 핀 것을 보는 꿈", metaTitle: "돌담 꽃 꿈 해몽 | 숨겨진 기회와 새로운 인연 | 무운" },
  "flying-airplane-cloud-dream": { keyword: "비행기를 타고 구름 위를 날며 지상을 내려다보는 꿈", metaTitle: "비행기 타는 꿈 해몽 재물과 명예의 고공행진 | 무운" },
  "flying-in-airplane-dream": { keyword: "비행기를 타고 구름 위를 나는 꿈", metaTitle: "비행기 타고 나는 꿈 해몽 성공의 궤도 진입 | 무운" },
  "flying-in-airplane-dream-alt": { keyword: "비행기를 타고 넓은 하늘을 나는 꿈", metaTitle: "비행기 꿈 해몽 | 지위 상승과 광범위한 성공 | 무운" },
  "forest-fire-dream-meaning": { keyword: "산불이 크게 나는 것을 보는 꿈", metaTitle: "산불 나는 꿈 해몽 재물운이 폭발하는 신호 | 무운" },
  "front-teeth-falling-out-dream": { keyword: "앞니가 빠지는 꿈", metaTitle: "앞니 빠지는 꿈 해몽 우환 방지 가이드 | 무운" },
  "front-tooth-falls-out-no-blood-dream": { keyword: "앞니가 빠지고 피가 나지 않는 꿈", metaTitle: "앞니 빠지는 꿈 해몽 - 피 안 나는 앞니 빠지는 꿈의 의미 | 무운" },
  "fruit-bearing-tree-dream": { keyword: "나무에 열매가 주렁주렁 열린 꿈", metaTitle: "열매 맺힌 나무 꿈 해몽 | 풍요로운 재물과 노력의 결실 | 무운" },
  "full-moon-in-clear-sky-dream": { keyword: "맑은 하늘에서 밝은 보름달을 보는 꿈", metaTitle: "보름달 꿈 해몽 소원 성취와 행복의 상징 | 무운" },
  "full-moon-night-sky-dream": { keyword: "밤하늘에 커다란 보름달이 뜬 꿈", metaTitle: "보름달 꿈 해몽 | 완벽한 풍요와 소원 성취 | 무운" },
  "gathering-starlight-basket-dream": { keyword: "은하수에서 쏟아지는 별빛을 바구니 가득 담는 꿈", metaTitle: "별빛 담는 꿈 해몽 하늘이 내린 거액의 횡재수 | 무운" },
  "getting-large-bag-gift": { keyword: "커다란 가방을 선물 받는 꿈", metaTitle: "가방 꿈 해몽 | 권한의 확대와 재산의 증식 | 무운" },
  "getting-lost-in-city-dream": { keyword: "낯선 도심 한복판에 홀로 남겨져 집으로 가는 길을 잊어버리는 꿈", metaTitle: "길 잃은 꿈 해몽 자아 상실과 방황의 끝 | 무운" },
  "getting-lost-in-mountains-dream": { keyword: "산에서 길을 잃고 헤매는 꿈", metaTitle: "길 잃은 꿈 해몽 | 방황을 멈추게 할 조언 | 무운" },
  "getting-money-from-parents": { keyword: "부모님께 용돈을 받는 꿈", metaTitle: "부모님께 돈 받는 꿈 해몽 | 든든한 지원군과 재물운 | 무운" },
  "getting-wet-in-rain-without-umbrella-dream": { keyword: "비가 오는데 우산이 없어 비를 흠뻑 맞는 꿈", metaTitle: "비 맞는 꿈 해몽 우산 없는 막막함의 의미 | 무운" },
  "getting-wet-in-the-rain-dream": { keyword: "비를 흠뻑 맞는 꿈", metaTitle: "비 맞는 꿈 해몽 | 찝찝함 뒤에 찾아올 행운 | 무운" },
  "giant-snake-wrapping-around-body": { keyword: "큰 뱀이 몸을 칭칭 감는 꿈", metaTitle: "뱀이 몸을 감는 꿈 해몽 | 권력과 재물의 결합 | 무운" },
  "giant-wall-dream-obstacle": { keyword: "거대한 벽이 앞을 가로막아 더 이상 전진할 수 없는 꿈", metaTitle: "거대한 벽 꿈 해몽 한계 극복과 휴식의 타이밍 | 무운" },
  "gold-bars-under-bedroom-dream": { keyword: "자신의 침실 아래에 금괴가 가득 매장되어 있는 것을 발견한 꿈", metaTitle: "금괴 발견 꿈 해몽 우리 집에 숨겨진 보물을 찾다 | 무운" },
  "gold-dust-falling-sky-dream": { keyword: "맑은 하늘에서 금가루가 눈처럼 쏟아져 내리는 꿈", metaTitle: "금가루 내리는 꿈 해몽 하늘이 주시는 재물 복 | 무운" },
  "gold-in-clear-water-dream": { keyword: "맑은 물속에 금덩어리가 가득한 꿈", metaTitle: "맑은 물속 금 꿈 해몽 | 투명한 대박의 기회 | 무운" },
  "gold-pig-entering-house-dream": { keyword: "황금 돼지가 집 안으로 걸어 들어오는 꿈", metaTitle: "황금 돼지가 들어오는 꿈 해몽 재물운 폭발의 신호 | 무운" },
  "gold-ring-gift-dream-meaning": { keyword: "금반지를 선물 받거나 손가락에 끼는 꿈", metaTitle: "금반지 꿈 해몽 결혼과 명예의 약속 | 무운" },
  "gold-ring-silk-pouch-dream": { keyword: "붉은색 비단 주머니 속에 금반지가 가득 들어있는 꿈", metaTitle: "금반지 주머니 꿈 해몽 숨겨진 재물을 찾는 비결 | 무운" },
  "gold-turtle-well-dream": { keyword: "맑고 깊은 우물에서 금거북이를 건져 올리는 꿈", metaTitle: "금거북이 잡는 꿈 해몽 명예와 부를 동시에 잡는 법 | 무운" },
  "golden-carp-into-arms-dream": { keyword: "넓은 강에서 황금빛 잉어가 내 품으로 뛰어드는 꿈", metaTitle: "황금 잉어 꿈 해몽 태몽부터 재물까지 완벽한 길몽 | 무운" },
  "golden-castle-rising-sea-dream": { keyword: "푸른 바다 한가운데서 황금으로 된 성이 솟아오르는 꿈", metaTitle: "황금 성 꿈 해몽 독보적인 자산가가 될 특별한 신호 | 무운" },
  "golden-fish-mountain-valley-dream": { keyword: "깊은 산계곡에서 금빛 물고기들이 떼를 지어 헤엄치는 꿈", metaTitle: "금빛 물고기 떼 꿈 해몽 마르지 않는 현금 흐름의 시작 | 무운" },
  "golden-flags-roof-dream": { keyword: "자신의 집 옥상에 황금빛 깃발들이 바람에 힘차게 휘날리는 꿈", metaTitle: "황금 깃발 꿈 해몽 명성과 부가 구름처럼 몰려온다 | 무운" },
  "golden-hair-shining-dream": { keyword: "자신의 머리카락이 황금색으로 변하며 빛이 나는 꿈", metaTitle: "황금 머리카락 꿈 해몽 나의 가치가 곧 재산이 된다 | 무운" },
  "golden-key-from-old-man-dream": { keyword: "백발의 노인으로부터 황금 열쇠를 건네받는 꿈", metaTitle: "황금 열쇠 꿈 해몽 인생 역전의 비밀 통로 | 무운" },
  "golden-pig-dream-meaning": { keyword: "황금 돼지가 집 안으로 들어오는 꿈", metaTitle: "황금 돼지 꿈 해몽 복권 당첨의 징조일까 | 무운" },
  "golden-pig-enters-house-dream": { keyword: "황금 돼지가 집 안으로 들어와 내 품에 안기는 꿈", metaTitle: "황금 돼지 꿈 해몽 - 황금 돼지가 집에 들어와 품에 안기는 꿈의 의미 | 무운" },
  "golden-poop-toilet-dream": { keyword: "화장실에서 황금색 대변을 시원하게 보는 꿈", metaTitle: "황금 똥 꿈 해몽 - 화장실에서 황금색 대변 보는 꿈의 의미 | 무운" },
  "golden-rice-field-dream": { keyword: "넓은 들판에 황금빛 벼가 가득 익어 고개를 숙인 꿈", metaTitle: "황금 들판 꿈 해몽 노력의 대가가 재물로 돌아온다 | 무운" },
  "golden-spider-web-living-room-dream": { keyword: "거대한 황금 거미가 우리 집 거실 천장에 큰 그물을 치는 꿈", metaTitle: "황금 거미 꿈 해몽 저절로 돈이 들어오는 시스템 구축 | 무운" },
  "grand-waterfall-dream-meaning": { keyword: "웅장한 폭포수가 시원하게 쏟아지는 꿈", metaTitle: "폭포 꿈 해몽 막혔던 운이 뚫리는 강력한 신호 | 무운" },
  "growing-horns-on-head-dream": { keyword: "머리에 뿔이 나는 꿈", metaTitle: "머리에 뿔 나는 꿈 해몽 | 내가 리더가 된다고? | 무운" },
  "growing-new-teeth-dream": { keyword: "이빨이 새로 돋아나는 꿈", metaTitle: "새 이빨 나는 꿈 해몽 | 인생 2막의 시작 | 무운" },
  "hair-loss-dream-stress-signal": { keyword: "머리카락이 한 움큼씩 빠져 머리 전체가 탈모가 되는 꿈", metaTitle: "머리카락 빠지는 꿈 해몽 자존감 회복 솔루션 | 무운" },
  "harvesting-golden-crops-dream": { keyword: "넓은 들판에서 황금빛 곡식을 수확하는 꿈", metaTitle: "수확 꿈 해몽 노력의 보상이 찾아오는 시간 | 무운" },
  "hearing-laughter-mockery-dream": { keyword: "정체모를 누군가가 나를 계속해서 비웃는 소리가 사방에서 들리는 꿈", metaTitle: "비웃음 당하는 꿈 해몽 사회적 불안 극복 | 무운" },
  "heavy-rock-hanging-dream-pressure": { keyword: "머리 위로 거대한 바위가 얇은 줄 하나에 매달려 나를 누르는 꿈", metaTitle: "바위가 누르는 꿈 해몽 중압감에서 탈출하기 | 무운" },
  "heavy-snow-dream-meaning": { keyword: "눈이 펑펑 내려 온 세상이 하얀 꿈", metaTitle: "눈 내리는 꿈 해몽 | 온 세상이 하얀 축복 | 무운" },
  "herding-sheep-home-dream": { keyword: "넓은 들판에서 수많은 양떼를 몰고 집으로 돌아오는 꿈", metaTitle: "양떼 모는 꿈 해몽 평온함 속에 피어나는 거대한 부 | 무운" },
  "holding-a-newborn-baby-dream": { keyword: "갓 태어난 아기를 품에 안고 기뻐하는 꿈", metaTitle: "아기 꿈 해몽 새로운 시작과 생명의 기운 | 무운" },
  "holding-golden-key-dream": { keyword: "황금 열쇠를 손에 쥐는 꿈", metaTitle: "황금 열쇠 꿈 해몽 | 문제 해결의 단서와 성공운 | 무운" },
  "holding-hands-with-crush-dream": { keyword: "좋아하는 사람과 손을 잡는 꿈", metaTitle: "좋아하는 사람과 손잡는 꿈 | 연애운 시작일까? | 무운" },
  "house-fire-no-water-dream-stress": { keyword: "집이 불타는데 물이 나오지 않아 발을 동동 구르는 꿈", metaTitle: "집 타는데 물 안 나오는 꿈 해몽 번아웃 탈출법 | 무운" },
  "house-full-of-jewels-dream": { keyword: "집안에 보석이 가득 쌓여 있는 꿈", metaTitle: "보석 꿈 해몽 재물과 명예의 최고봉 | 무운" },
  "house-on-fire-dream": { keyword: "자신의 집에 불이 나서 활활 타오르고 있는 것을 지켜보는 꿈", metaTitle: "집 타는 꿈 해몽 무서워 마세요 재물운 대박입니다 | 무운" },
  "house-on-fire-dream-meaning": { keyword: "불이 나서 집이 활활 타오르는 꿈", metaTitle: "불나는 꿈 해몽 재산이 불어나는 길몽 | 무운" },
  "hugging-a-stranger-dream": { keyword: "낯선 사람과 포옹하는 꿈", metaTitle: "모르는 사람과 포옹하는 꿈 새로운 인연의 시작 | 무운" },
  "hugging-stranger-dream-love": { keyword: "낯선 이성과의 재회나 뜨거운 포옹을 하는 꿈", metaTitle: "포옹하는 꿈 해몽 새로운 인연과 재회운 | 무운" },
  "ice-thawing-golden-carp-dream": { keyword: "투명하고 맑은 얼음 속에 황금 잉어가 갇혀 있다가 녹으면서 튀어나오는 꿈", metaTitle: "얼음 속 잉어 꿈 해몽 막혔던 재물운이 기적처럼 뚫린다 | 무운" },
  "insects-crawling-dream-disgust": { keyword: "벌레 떼가 온몸을 기어 다니거나 입안으로 들어오는 꿈", metaTitle: "벌레 떼 꿈 해몽 대인관계 스트레스 청소하기 | 무운" },
  "kissing-a-stranger-dream": { keyword: "모르는 사람과 키스하는 꿈", metaTitle: "모르는 사람과 키스하는 꿈 | 설렘 뒤의 해몽 | 무운" },
  "letter-in-mailbox-dream": { keyword: "우편함에 편지가 들어있는 꿈", metaTitle: "편지 꿈 해몽 | 반가운 소식과 새로운 제안 | 무운" },
  "looking-at-stars-night-sky": { keyword: "밤하늘의 별을 바라보는 꿈", metaTitle: "별 보는 꿈 해몽 | 희망의 발견과 명예운 상승 | 무운" },
  "losing-shoes-barefoot-dream": { keyword: "신발을 잃어버려 맨발로 차가운 길을 걷는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 외로운 마음 달래기 | 무운" },
  "losing-shoes-dream-meaning": { keyword: "신발을 잃어버리고 맨발로 헤매는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 관계의 위기 신호 | 무운" },
  "losing-teeth-dream-interpretation": { keyword: "이빨이 빠지거나 부러지는 꿈", metaTitle: "이빨 빠지는 꿈 해몽 정말 불길한 꿈일까 | 무운" },
  "losing-voice-dream-speech-anxiety": { keyword: "사람들 앞에서 연설을 해야 하는데 목소리가 전혀 나오지 않는 꿈", metaTitle: "목소리 안 나오는 꿈 해몽 억눌린 감정의 표출 | 무운" },
  "losing-wallet-phone-dream-anxiety": { keyword: "중요 물건(지갑, 핸드폰)을 잃어버리고 당황하며 찾는 꿈", metaTitle: "물건 잃어버리는 꿈 해몽 잃어버린 자신감 회복 | 무운" },
  "lost-in-dark-forest-dream": { keyword: "깊고 어두운 숲속에서 길을 잃고 방황하는 꿈", metaTitle: "길 잃은 꿈 해몽 방황하는 마음이 주는 경고 | 무운" },
  "lost-road-familiar-place-dream": { keyword: "낯선 길을 헤매다 익숙한 장소를 발견하는 꿈", metaTitle: "낯선 길 헤매다 익숙한 장소 발견하는 꿈 해몽 - 방황과 귀환의 의미 | 무운" },
  "loved-one-turned-monster-dream": { keyword: "가까운 친구나 가족이 괴물로 변해 나를 공격하는 꿈", metaTitle: "사람이 괴물로 변하는 꿈 해몽 관계의 균열 치유법 | 무운" },
  "luck-pouches-falling-sky-dream": { keyword: "맑은 하늘에서 커다란 복주머니들이 눈처럼 내려오는 꿈", metaTitle: "복주머니 내리는 꿈 해몽 도처에서 터지는 재물 잭팟 | 무운" },
  "maze-dream-lost-path": { keyword: "미로 속에 갇혀 아무리 걸어도 출구를 찾지 못하는 꿈", metaTitle: "미로에 갇힌 꿈 해몽 막막한 현실에서 길 찾기 | 무운" },
  "meeting-old-friend-talking": { keyword: "오랜만에 친구를 만나 대화하는 꿈", metaTitle: "옛 친구 만나는 꿈 해몽 | 인맥의 확장과 반가운 소식 | 무운" },
  "meeting-president-dream-meaning": { keyword: "대통령이나 고귀한 인물을 만나는 꿈", metaTitle: "대통령 만나는 꿈 해몽 | 출세와 명예의 끝판왕 | 무운" },
  "mirror-self-reflection-dream": { keyword: "거울 속 내 모습이 예뻐 보이는 꿈", metaTitle: "거울 보는 꿈 해몽 | 예뻐 보이면 연애운 급상승? | 무운" },
  "missing-bus-or-train-dream": { keyword: "버스나 기차를 놓치는 꿈", metaTitle: "버스 놓치는 꿈 해몽 | 조급함이 부른 경고 | 무운" },
  "missing-desk-at-work-dream": { keyword: "학교나 직장에 갔는데 내 책상과 자리만 감쪽같이 사라진 꿈", metaTitle: "내 자리 사라진 꿈 해몽 직장 내 소외감 극복 | 무운" },
  "missing-flight-dream-missed-opportunity": { keyword: "비행기를 놓쳐서 중요한 약속이나 여행에 가지 못하는 꿈", metaTitle: "비행기 놓치는 꿈 해몽 조급함에서 벗어나는 법 | 무운" },
  "money-falling-from-sky-dream": { keyword: "하늘에서 돈이 비처럼 쏟아지는 꿈", metaTitle: "돈 쏟아지는 꿈 해몽 횡재수인가 허상인가 | 무운" },
  "money-leaves-field-dream": { keyword: "넓은 들판에 지폐가 낙엽처럼 쌓여 바람에 굴러다니는 꿈", metaTitle: "지폐 들판 꿈 해몽 발에 치이는 게 돈이 되는 운세 | 무운" },
  "money-tree-growing-dream": { keyword: "집마당에 커다란 돈나무가 자라 지폐가 꽃처럼 피어있는 꿈", metaTitle: "돈나무 꿈 해몽 자산이 저절로 불어나는 비결 | 무운" },
  "money-turning-into-ash-dream": { keyword: "하늘에서 돈이 쏟아지는데 줍는 족족 재로 변하는 꿈", metaTitle: "돈이 재로 변하는 꿈 해몽 허망한 욕심 비우기 | 무운" },
  "moving-to-new-house-dream": { keyword: "넓고 화려한 새집으로 이사하는 꿈", metaTitle: "새집으로 이사하는 꿈 인생의 전환점 | 무운" },
  "naked-in-public-dream-meaning": { keyword: "옷을 홀딱 벗고 거리를 다니는 꿈", metaTitle: "벌거벗은 꿈 해몽 | 수치심인가 해방감인가? | 무운" },
  "naked-in-public-dream-social-anxiety": { keyword: "옷을 하나도 입지 않은 채 사람들 사이를 활보하는 꿈", metaTitle: "벌거벗은 꿈 해몽 수치심과 자존감의 상관관계 | 무운" },
  "night-view-from-mountain-top": { keyword: "산 정상에 올라 야경을 내려다보는 꿈", metaTitle: "산 정상 야경 꿈 해몽 | 성공의 정점과 통찰력 | 무운" },
  "ocean-breeze-dream-meaning": { keyword: "바다를 바라보며 시원한 바람을 맞는 꿈", metaTitle: "바다 바람 꿈 해몽 | 고민 해결과 새로운 도약 | 무운" },
  "opening-treasure-vault-dream": { keyword: "황금 열쇠를 가지고 거대한 보물 창고 문을 여는 꿈", metaTitle: "보물 창고 여는 꿈 해몽 억만장자의 문턱에 서다 | 무운" },
  "overflowing-toilet-dream-meaning": { keyword: "화장실에서 변이 넘쳐나는 꿈", metaTitle: "화장실 똥이 넘치는 꿈 복권 사야 할까 | 무운" },
  "peacock-giving-gold-feathers-dream": { keyword: "화려한 공작새 두 마리가 나란히 앉아 금빛 깃털을 선물해 주는 꿈", metaTitle: "공작새 깃털 꿈 해몽 귀인과 함께 찾아온 고품격 부귀 | 무운" },
  "peacock-spreading-wings-dream": { keyword: "화려한 공작새가 날개를 활짝 펴고 나를 향해 춤추는 꿈", metaTitle: "공작새 꿈 해몽 부귀영화와 명예의 상징 | 무운" },
  "pearl-pouch-overflowing-dream": { keyword: "비단 주머니에서 진주알이 끊임없이 쏟아져 나오는 꿈", metaTitle: "진주 주머니 꿈 해몽 멈추지 않는 알짜배기 재물운 | 무운" },
  "pearls-from-palms-dream": { keyword: "자신의 손바닥에서 빛나는 진주가 계속해서 생겨나는 꿈", metaTitle: "손바닥 진주 꿈 해몽 내 능력이 곧 황금 알을 낳는 거위 | 무운" },
  "people-studying-in-library": { keyword: "도서관에서 공부하는 사람들을 보는 꿈", metaTitle: "도서관 꿈 해몽 | 자기 계발과 협력의 시너지 | 무운" },
  "picking-golden-fruit-dream": { keyword: "높은 나무 위에서 황금빛 열매를 정성껏 따서 바구니에 담는 꿈", metaTitle: "황금 열매 꿈 해몽 노력 끝에 찾아온 눈부신 부 | 무운" },
  "picking-red-strawberries-dream": { keyword: "바구니 가득 빨간 딸기를 담는 꿈", metaTitle: "딸기 꿈 해몽 | 재물운 폭발과 달콤한 연애 | 무운" },
  "picking-shells-at-beach": { keyword: "바다에서 예쁜 조개를 줍는 꿈", metaTitle: "조개 꿈 해몽 | 예기치 못한 횡재와 태몽 | 무운" },
  "picking-shiny-pebbles-dream": { keyword: "맑은 시냇물에서 반짝이는 조약돌을 주워 주머니에 넣는 꿈", metaTitle: "빛나는 조약돌 꿈 해몽 소소한 횡재가 큰 부로 | 무운" },
  "picking-up-coins-on-road": { keyword: "길에서 동전 몇 개를 줍는 꿈", metaTitle: "동전 줍는 꿈 해몽 | 뜻밖의 행운과 소소한 재물운 | 무운" },
  "picking-up-gold-coins-dream": { keyword: "땅바닥에서 반짝이는 금화들을 계속해서 줍는 꿈", metaTitle: "금화 줍는 꿈 해몽 계속되는 횡재수의 신호 | 무운" },
  "picking-up-jewelry-dream-meaning": { keyword: "보석을 줍거나 선물 받는 꿈", metaTitle: "보석 꿈 해몽 | 당신의 가치가 빛날 시간 | 무운" },
  "pig-dream-lucky-money-dream": { keyword: "돼지가 품 안으로 들어오거나 집 안으로 들어오는 꿈", metaTitle: "돼지 꿈 해몽 - 돼지가 품에 안기는 꿈, 복권 당첨 꿈의 의미 | 무운" },
  "playing-with-child-dream": { keyword: "어린아이와 즐겁게 노는 꿈", metaTitle: "아이 꿈 해몽 | 순수함의 회복과 평화로운 일상 | 무운" },
  "poop-toilet-wealth-dream": { keyword: "꿈속에서 똥을 보거나 몸에 묻히는 꿈", metaTitle: "똥 꿈 해몽 - 화장실에서 똥 보는 꿈, 몸에 묻는 꿈의 의미 | 무운" },
  "pooped-on-dream-jackpot": { keyword: "똥을 온몸에 뒤집어쓰거나 만지는 꿈", metaTitle: "똥 꿈 해몽 로또 사야 할 최고의 횡재수 | 무운" },
  "putting-on-makeup-dream-meaning": { keyword: "거울을 보며 화장을 하거나 단장하는 꿈", metaTitle: "화장하는 꿈 해몽 인기 상승과 새로운 만남 | 무운" },
  "rainbow-after-rain-dream": { keyword: "비가 온 뒤 무지개가 뜨는 꿈", metaTitle: "무지개 꿈 해몽 | 고난 끝 행복 시작과 소원 성취 | 무운" },
  "rainbow-connected-to-home-dream": { keyword: "하늘에서 오색찬란한 무지개가 자신의 집으로 연결된 꿈", metaTitle: "무지개 꿈 해몽 집안으로 쏟아지는 천복(天福) | 무운" },
  "reaching-mountain-peak-dream": { keyword: "산 정상에 오르는 꿈", metaTitle: "산 정상에 오르는 꿈 | 성공의 문턱에 서다 | 무운" },
  "receiving-full-meal-table": { keyword: "정성스럽게 차려진 밥상을 받는 꿈", metaTitle: "밥상 꿈 해몽 | 인정받는 삶과 풍성한 복록 | 무운" },
  "receiving-gemstone-gift-dream": { keyword: "귀한 보석을 선물 받는 꿈", metaTitle: "보석 받는 꿈 해몽 | 신분 상승과 최고의 명예운 | 무운" },
  "repairing-old-house-dream": { keyword: "낡은 집을 고치고 수리하는 꿈", metaTitle: "집 수리 꿈 해몽 | 운세의 반전과 내실 다지기 | 무운" },
  "rescued-from-falling-into-ocean": { keyword: "바다에 빠졌으나 구조되는 꿈", metaTitle: "바다에 빠졌다 구조되는 꿈 해몽 | 위기 속 반전 | 무운" },
  "rice-overflowing-jar-dream": { keyword: "커다란 항아리에 쌀이 가득 차서 밖으로 넘쳐흐르는 꿈", metaTitle: "쌀 항아리 꿈 해몽 평생 돈 걱정 없는 운세 | 무운" },
  "riding-a-horse-dream-success": { keyword: "넓은 들판에서 말을 타고 달리는 꿈", metaTitle: "말 타는 꿈 해몽 승리와 질주의 에너지 | 무운" },
  "riding-white-elephant-dream": { keyword: "흰 코끼리를 타고 성안으로 당당하게 들어가는 꿈", metaTitle: "흰 코끼리 꿈 해몽 상상 이상의 거부(巨富)가 될 징조 | 무운" },
  "riding-white-horse-golden-field-dream": { keyword: "끝없는 황금 벌판을 백마를 타고 시원하게 달리는 꿈", metaTitle: "백마 타고 달리는 꿈 해몽 재물과 성공의 탄탄대로 | 무운" },
  "rotten-food-worms-dream-meaning": { keyword: "음식을 맛있게 먹으려는데 썩어 있거나 벌레가 득실거리는 꿈", metaTitle: "상한 음식 꿈 해몽 성취 뒤에 숨은 허무함 | 무운" },
  "running-on-wide-road-dream": { keyword: "넓고 깨끗한 길을 기분 좋게 달리는 꿈", metaTitle: "달리는 꿈 해몽 거침없는 성공의 질주 | 무운" },
  "seeing-dead-body-dream-meaning": { keyword: "시체나 송장을 보고 공포보다는 덤덤함을 느끼는 꿈", metaTitle: "시체 꿈 해몽 무서워 마세요 큰 돈이 됩니다 | 무운" },
  "seeing-lotus-flower-pond": { keyword: "연못에 핀 연꽃을 보는 꿈", metaTitle: "연꽃 꿈 해몽 | 명예의 상승과 고귀한 결실 | 무운" },
  "seeing-name-on-pass-list-dream": { keyword: "시험 합격자 명단에 내 이름이 있는 꿈", metaTitle: "시험 합격 꿈 해몽 | 실제 합격의 전조인가? | 무운" },
  "seeing-someone-bleeding-dream": { keyword: "피를 흘리는 사람을 보는 꿈", metaTitle: "피 보는 꿈 해몽 | 무서워 마세요, 대박 꿈입니다 | 무운" },
  "shadow-controlling-me-dream": { keyword: "거울 속의 그림자가 나를 대신해 움직이며 나를 조종하려 하는 꿈", metaTitle: "그림자가 조종하는 꿈 해몽 주도적 삶 되찾기 | 무운" },
  "shaking-hands-with-president-dream": { keyword: "대통령이나 고위 관리와 악수하는 꿈", metaTitle: "대통령과 악수하는 꿈 승진과 명예의 신호 | 무운" },
  "shouting-mountain-top-dream": { keyword: "높은 산 정상에서 큰 소리로 외치자 메아리가 크게 들리는 꿈", metaTitle: "산 정상 외침 꿈 해몽 명예가 부를 부르는 순간 | 무운" },
  "shrinking-body-dream-inferiority": { keyword: "내 몸이 점점 작아져서 주변 사람들에게 밟힐까 봐 두려운 꿈", metaTitle: "몸이 작아지는 꿈 해몽 위축된 마음 회복법 | 무운" },
  "sinkhole-dream-sudden-crisis": { keyword: "길을 걷는데 갑자기 땅이 푹 꺼지며 거대한 싱크홀에 빠지는 꿈", metaTitle: "땅이 꺼지는 꿈 해몽 불안정한 기반 바로잡기 | 무운" },
  "sinking-into-sea-dream-anxiety": { keyword: "깊은 바다속으로 끝없이 가라앉는 꿈", metaTitle: "바다에 가라앉는 꿈 해몽 심리적 경고 신호 | 무운" },
  "sky-from-rooftop-dream": { keyword: "높은 빌딩 옥상에서 하늘을 보는 꿈", metaTitle: "건물 옥상 꿈 해몽 | 사회적 성공과 원대한 포부 | 무운" },
  "smelling-baked-bread-dream": { keyword: "맛있는 빵을 굽는 냄새를 맡는 꿈", metaTitle: "빵 굽는 꿈 해몽 | 가정의 행복과 풍요로운 일상 | 무운" },
  "smiling-at-mirror-dream": { keyword: "거울 속의 내 모습을 보며 웃는 꿈", metaTitle: "거울 꿈 해몽 | 자신감 회복과 긍정적인 평판 | 무운" },
  "snake-bite-dream-meaning": { keyword: "뱀에게 물리는 꿈", metaTitle: "뱀에게 물리는 꿈 해몽 | 태몽일까 재물운일까? | 무운" },
  "snake-wrapping-around-body-dream": { keyword: "뱀이 몸을 감는 꿈", metaTitle: "뱀이 몸을 감는 꿈 태몽과 재물운 풀이 | 무운" },
  "snake-wrapping-body-dream": { keyword: "화려하고 큰 뱀이 내 몸을 칭칭 감고 있는 꿈", metaTitle: "뱀이 몸을 감는 꿈 해몽 재물이 당신 곁을 떠나지 않는다 | 무운" },
  "snake-wrapping-body-dream-2": { keyword: "거대한 뱀이 내 몸을 칭칭 감고 무서운 눈초리로 노려보는 꿈", metaTitle: "뱀이 몸을 감는 꿈 해몽 압박하는 인연 정리법 | 무운" },
  "snow-covered-field-dream": { keyword: "흰 눈이 소복이 쌓인 들판을 보는 꿈", metaTitle: "눈 내린 들판 꿈 해몽 | 평화의 도래와 순수한 시작 | 무운" },
  "snowing-all-over-world-dream": { keyword: "하늘에서 눈이 펑펑 내려 온 세상을 덮는 꿈", metaTitle: "눈 내리는 꿈 해몽 세상이 당신을 돕는 운세 | 무운" },
  "spring-water-spouting-dream": { keyword: "자신의 집 마당에서 맑은 샘물이 솟구쳐 오르는 꿈", metaTitle: "샘물 솟는 꿈 해몽 마르지 않는 재물복의 시작 | 무운" },
  "star-falling-into-arms-dream": { keyword: "밤하늘에서 큰 별이 자신의 품으로 떨어지는 꿈", metaTitle: "별이 품으로 떨어지는 꿈 해몽 명예와 부의 결합 | 무운" },
  "stepping-on-poop-dream-meaning": { keyword: "똥을 밟거나 몸에 묻히는 꿈", metaTitle: "똥 밟는 꿈 해몽 | 복권 사야 할까요? | 무운" },
  "stranger-in-the-mirror-dream": { keyword: "거울 속에 내가 아닌 전혀 다른 낯선 이가 서서 나를 빤히 쳐다보는 꿈", metaTitle: "거울 속 낯선 사람 꿈 해몽 자아 통합 솔루션 | 무운" },
  "stress-dream-chased-by-beast": { keyword: "날카로운 이빨을 가진 짐승에게 쫓기다가 막다른 길에 다다르는 꿈", metaTitle: "맹수에게 쫓기는 꿈 해몽 무서운 압박감의 실체 | 무운" },
  "strong-thick-arms-dream": { keyword: "자신의 팔이 평소보다 두껍고 튼튼해져 있는 꿈", metaTitle: "굵은 팔 꿈 해몽 재물과 성공을 거머쥐는 힘 | 무운" },
  "stuck-in-a-pit-dream-meaning": { keyword: "깊은 구덩이에 빠져 나오지 못하고 허우적대는 꿈", metaTitle: "구덩이에 빠지는 꿈 해몽 위기를 극복하는 법 | 무운" },
  "sunrise-from-sea-dream": { keyword: "붉은 태양이 바다에서 솟아오르는 것을 보는 꿈", metaTitle: "일출 꿈 해몽 인생 전성기의 시작 | 무운" },
  "sunshine-after-rain-dream": { keyword: "비가 그치고 난 뒤 구름 사이로 햇살이 비치는 꿈", metaTitle: "비 그치고 햇살 비치는 꿈 해몽 - 구름 사이로 햇살이 비치는 꿈의 의미 | 무운" },
  "swallowing-sun-dream": { keyword: "붉은 태양이 내 입안으로 쏙 들어오는 꿈", metaTitle: "해를 삼키는 꿈 해몽 최고의 부와 권력을 잡다 | 무운" },
  "swimming-in-the-ocean-dream": { keyword: "바다에서 수영하는 꿈", metaTitle: "바다 수영 꿈 해몽 | 큰 무대로 나갈 기회 | 무운" },
  "taking-cool-shower-dream": { keyword: "시원한 물로 샤워를 하는 꿈", metaTitle: "샤워 꿈 해몽 | 스트레스 해소와 정서적 정화 | 무운" },
  "talking-pet-resenting-dream": { keyword: "정성껏 키우던 반려동물이 갑자기 사람 말을 하며 나를 원망하는 꿈", metaTitle: "말하는 반려동물 꿈 해몽 숨겨진 죄책감 치유 | 무운" },
  "tea-in-sunny-cafe-dream": { keyword: "햇살이 잘 드는 카페에서 차를 마시는 꿈", metaTitle: "카페 꿈 해몽 | 소중한 휴식과 따뜻한 인연 | 무운" },
  "teeth-falling-out-dream-loss": { keyword: "이빨이 통째로 빠지거나 으스러져 가루가 되는 꿈", metaTitle: "이 빠지는 꿈 해몽 불안을 행운으로 바꾸는 법 | 무운" },
  "teeth-falling-out-dream-meaning": { keyword: "이가 빠지는 꿈", metaTitle: "이 빠지는 꿈 해몽 | 안 좋은 꿈일까? 걱정 마세요 | 무운" },
  "tiger-entering-house-dream": { keyword: "화려하고 큰 호랑이가 집 안으로 들어오는 꿈", metaTitle: "호랑이 꿈 해몽 권력과 태몽의 상징 | 무운" },
  "toad-with-gold-coins-dream": { keyword: "자신의 집 마당에 커다란 두꺼비가 금화를 입에 물고 앉아 있는 꿈", metaTitle: "두꺼비 금화 꿈 해몽 집안으로 굴러들어온 복덩이 | 무운" },
  "toes-grow-longer-dream": { keyword: "발가락이 길어지거나 새로 돋아나는 꿈", metaTitle: "발가락이 길어지는 꿈 해몽 - 발가락 새로 돋아나는 꿈의 의미 | 무운" },
  "torn-clothes-dream-meaning": { keyword: "입고 있던 옷이 찢어지거나 더러워지는 꿈", metaTitle: "옷이 찢어지는 꿈 해몽 주의해야 할 징조 | 무운" },
  "train-ride-viewing-landscape": { keyword: "기차를 타고 창밖 풍경을 보는 꿈", metaTitle: "기차 꿈 해몽 | 순조로운 진행과 즐거운 변화 | 무운" },
  "trapped-in-spider-web-dream": { keyword: "거대한 거미줄에 몸이 칭칭 감겨 꼼짝달싹 못 하는 꿈", metaTitle: "거미줄에 걸린 꿈 해몽 억압된 환경에서 탈출하기 | 무운" },
  "traveling-by-airplane-dream": { keyword: "비행기를 타고 여행 가는 꿈", metaTitle: "비행기 타는 꿈 해몽 | 신분 상승과 새로운 시작 | 무운" },
  "tsunami-dream-paralysis-stress": { keyword: "거대한 파도가 덮치려는데 발이 땅에서 떨어지지 않아 굳어버리는 꿈", metaTitle: "거대 파도 꿈 해몽 무력감에서 벗어나는 법 | 무운" },
  "turtle-dream-meaning-longevity": { keyword: "거북이를 만지거나 등에 타는 꿈", metaTitle: "거북이 꿈 해몽 장수와 재물의 아이콘 | 무운" },
  "turtle-laying-golden-eggs-dream": { keyword: "커다란 거북이가 금으로 된 알을 낳는 것을 지켜보는 꿈", metaTitle: "거북이 금알 꿈 해몽 평생 마르지 않는 수익의 원천 | 무운" },
  "twin-dragons-room-dream": { keyword: "푸른 용 두 마리가 여의주를 물고 내 방 천장을 돌고 있는 꿈", metaTitle: "쌍룡 꿈 해몽 부귀영화의 정점에 서는 법 | 무운" },
  "uprooted-tree-dream-meaning": { keyword: "큰 나무가 뿌리째 뽑히거나 꺾이는 꿈", metaTitle: "나무가 꺾이는 꿈 해몽 위기에 대처하는 법 | 무운" },
  "voice-turning-into-noise-dream": { keyword: "내 입에서 나오는 목소리가 기괴한 소음이나 쇳소리로 변해 사람들을 놀라게 하는 꿈", metaTitle: "목소리가 변하는 꿈 해몽 왜곡된 소통 바로잡기 | 무운" },
  "walking-green-forest-path": { keyword: "초록색 숲길을 홀로 걷는 꿈", metaTitle: "숲길 걷는 꿈 해몽 | 마음의 치유와 자아 발견 | 무운" },
  "walking-in-lush-forest-dream": { keyword: "울창한 숲속을 걷는 꿈", metaTitle: "숲길 걷는 꿈 해몽 | 마음의 평화와 지혜 | 무운" },
  "walking-on-rainbow-gold-clouds-dream": { keyword: "화려한 무지개 위를 걸어가며 금사로 된 구름을 만지는 꿈", metaTitle: "무지개 걷는 꿈 해몽 명예로운 부자의 길을 걷다 | 무운" },
  "walking-on-the-ocean-dream": { keyword: "바다 위를 유유히 걷는 꿈", metaTitle: "바다 위를 걷는 꿈 기적 같은 성공의 전조 | 무운" },
  "walking-on-the-sea-dream": { keyword: "넓고 푸른 바다 위를 평화롭게 걷는 꿈", metaTitle: "바다 위를 걷는 꿈 해몽 성공과 평온의 상징 | 무운" },
  "walking-on-white-clouds": { keyword: "하얀 구름 위를 걷는 꿈", metaTitle: "구름 위 걷는 꿈 해몽 | 최고의 명예와 자유로운 영혼 | 무운" },
  "walking-park-seeing-flowers": { keyword: "공원을 산책하며 꽃을 보는 꿈", metaTitle: "공원 산책 꽃 꿈 해몽 | 일상의 활력과 새로운 인연 | 무운" },
  "walking-with-angel-dream-meaning": { keyword: "신선이나 천사와 함께 구름 위를 거니는 꿈", metaTitle: "천사 신선 꿈 해몽 인생 최고의 축복과 성취 | 무운" },
  "war-refugee-unprepared-dream": { keyword: "전쟁이 나서 급히 피난을 가야 하는데 짐을 하나도 싸지 못하는 꿈", metaTitle: "전쟁 피난 짐 못 싸는 꿈 해몽 미래 불안 해소 | 무운" },
  "waterfall-turning-into-coins-dream": { keyword: "거대한 폭포수가 쏟아지는데 그 물이 모두 금화로 변하는 꿈", metaTitle: "금화 폭포 꿈 해몽 쏟아지는 재물을 감당할 준비가 되었나 | 무운" },
  "watering-potted-plants-dream": { keyword: "예쁜 화분에 물을 주는 꿈", metaTitle: "화분 물 주기 꿈 해몽 | 정성의 결실과 화목한 가정 | 무운" },
  "wearing-new-shoes-walking": { keyword: "새 신발을 신고 걷는 꿈", metaTitle: "새 신발 꿈 해몽 | 새로운 인연과 환경의 변화 | 무운" },
  "wearing-royal-robe-dream": { keyword: "임금님의 옷인 곤룡포를 입고 보좌에 앉아 있는 꿈", metaTitle: "임금님 옷 입는 꿈 해몽 성공의 정점에 서는 법 | 무운" },
  "wearing-shining-crown-dream": { keyword: "자신의 머리 위에 눈부신 왕관이 씌워지는 꿈", metaTitle: "왕관 꿈 해몽 명예와 부를 동시에 정복하는 법 | 무운" },
  "whale-approaching-sea-dream": { keyword: "푸른 바다 위에서 거대한 고래가 물을 뿜으며 다가오는 꿈", metaTitle: "고래 꿈 해몽 거대 자산가가 될 운명인가 | 무운" },
  "whale-in-the-ocean-dream": { keyword: "바다에서 고래가 시원하게 물을 뿜으며 노는 꿈", metaTitle: "고래 꿈 해몽 거대한 행운과 성공의 신호 | 무운" },
  "white-deer-guiding-jewels-dream": { keyword: "흰 사슴이 길을 안내하여 도착한 곳에 보석이 가득한 꿈", metaTitle: "흰 사슴 꿈 해몽 귀인이 안내하는 재물운의 명당 | 무운" },
  "white-hair-dream-meaning": { keyword: "머리카락이 하얗게 변하는 꿈", metaTitle: "머리 세는 꿈 해몽 | 노화가 아닌 명예의 상징 | 무운" },
  "white-shining-teeth-dream": { keyword: "이가 하얗게 빛나는 꿈", metaTitle: "이가 하얗게 빛나는 꿈 해몽 | 건강과 자신감의 상징 | 무운" },
  "white-tiger-riding-dream": { keyword: "숲속에서 하얀 호랑이가 나타나 나를 등에 태우는 꿈", metaTitle: "백호 꿈 해몽 권세와 재물을 한 손에 | 무운" },
  "zombie-attack-dream-meaning": { keyword: "좀비가 나타나 습격하는 꿈", metaTitle: "좀비 꿈 해몽 | 극심한 스트레스의 경고등 | 무운" },
  "airplane-dating-dream-interpretation": { keyword: "연인과 함께 비행기 타는 꿈 해외여행 꿈", metaTitle: "연인과 비행기 타는 꿈 해몽 | 신분 상승과 대성공 | 무운" },
  "airplane-seat-with-ex-dream": { keyword: "옛 연인과 비행기 옆자리 앉는 꿈 전남친과 여행 꿈", metaTitle: "옛 연인과 비행기 타는 꿈 해몽 | 과거의 자산과 신분 상승 | 무운" },
  "amethyst-cave-discovery-dream": { keyword: "깊은 계곡에서 거대한 자수정 동굴을 발견하는 꿈", metaTitle: "자수정 동굴 꿈 해몽 | 독보적인 기회와 고귀한 부 | 무운" },
  "amethyst-cave-discovery-dream-2": { keyword: "깊은 계곡에서 거대한 자수정 동굴을 발견하는 꿈", metaTitle: "자수정 동굴 꿈 해몽 | 독보적인 기회와 고귀한 부 | 무운" },
  "amusement-park-dating-with-crush": { keyword: "짝사랑과 놀이공원 가는 꿈 롤러코스터 데이트 꿈", metaTitle: "짝사랑과 놀이공원 가는 꿈 해몽 | 모험과 짜릿한 성공 | 무운" },
  "ancestor-smiling-hugging-dream": { keyword: "돌아가신 조상님이 밝게 웃으며 나를 안아주는 꿈", metaTitle: "조상님이 웃으며 안아주는 꿈 해몽 | 축복과 횡재수 | 무운" },
  "ancestor-smiling-hugging-dream-2": { keyword: "돌아가신 조상님이 밝게 웃으며 나를 안아주는 꿈", metaTitle: "조상님이 웃으며 안아주는 꿈 해몽 | 축복과 횡재수 | 무운" },
  "bamboo-forest-walking-dream": { keyword: "울창한 대나무 숲을 거니는 꿈", metaTitle: "대나무 숲 꿈 해몽 | 신념과 가문의 번창 | 무운" },
  "bathing-in-mountain-stream-dream": { keyword: "맑고 시원한 계곡물에 목욕하는 꿈 해몽", metaTitle: "계곡물 목욕 꿈 해몽 | 액운 타파와 건강 회복 | 무운" },
  "big-belly-dream-meaning": { keyword: "배가 불룩하게 나오는 꿈 재물 풍요 결실", metaTitle: "배가 불룩하게 나오는 꿈 해몽 | 재물운과 풍요 | 무운" },
  "big-belly-dream-meaning-2": { keyword: "배가 불룩하게 나오는 꿈 풍요", metaTitle: "배가 부른 꿈 해몽 재물과 풍요의 상징 | 무운" },
  "big-ears-dream-meaning": { keyword: "귀가 커져서 소리를 잘 듣는 꿈 정보 소식 성공", metaTitle: "귀가 커지는 꿈 해몽 | 지혜와 좋은 소식 | 무운" },
  "big-ears-dream-meaning-2": { keyword: "귀가 커지는 꿈 소식 운세", metaTitle: "귀가 커지는 꿈 해몽 기쁜 소식과 정보의 행운 | 무운" },
  "big-hands-dream-meaning": { keyword: "손이 커지는 꿈 권력 장악 사업 확장", metaTitle: "손이 커지는 꿈 해몽 | 권력과 사업 확장 | 무운" },
  "big-mouth-dream-meaning": { keyword: "입이 커지는 꿈 언변 재물 인복", metaTitle: "입이 커지는 꿈 해몽 | 언변과 재물운 | 무운" },
  "big-mouth-dream-meaning-2": { keyword: "입이 커지는 꿈 재물운 해석", metaTitle: "입이 커지는 꿈 해몽 재물과 권세가 들어오는 징조 | 무운" },
  "big-python-wrapping-body-dream": { keyword: "커다란 구렁이가 내 몸을 휘감는 꿈 태몽 재물운", metaTitle: "구렁이가 몸을 휘감는 꿈 해몽 | 재물운과 태몽 풀이 | 무운" },
  "big-snake-entering-house-dream": { keyword: "큰 뱀이 집안으로 들어오는 꿈", metaTitle: "큰 뱀이 집안으로 들어오는 꿈 해몽 | 재물운 폭발 | 무운" },
  "big-tree-growing-in-yard-dream": { keyword: "커다란 나무가 집 마당에 자라나는 꿈 해몽", metaTitle: "집 마당 나무 꿈 해몽 | 가문의 번창과 안정 | 무운" },
  "black-blood-coming-out-dream": { keyword: "아픈 몸에서 검은 피가 나오는 꿈 병세 회복", metaTitle: "아픈 몸에서 검은 피가 나오는 꿈 해몽 | 액운 소멸과 쾌차 무운" },
  "black-dog-bite-dream-meaning": { keyword: "날카로운 이빨을 가진 검은 개에게 물리는 꿈", metaTitle: "검은 개에게 물리는 꿈 해몽 | 배신과 구설수 주의보 | 무운" },
  "black-dog-bite-dream-meaning-2": { keyword: "날카로운 이빨을 가진 검은 개에게 물리는 꿈", metaTitle: "검은 개에게 물리는 꿈 해몽 | 배신과 구설수 주의보 | 무운" },
  "black-smoke-suffocating-dream": { keyword: "집안에 검은 연기가 가득 차고 숨을 쉴 수 없는 꿈", metaTitle: "집안에 검은 연기 가득한 꿈 해몽 | 가계 우환과 사기 경고 | 무운" },
  "body-hair-growing-dream": { keyword: "온몸에 털이 길게 나는 꿈 장수 권위 재물", metaTitle: "온몸에 털이 나는 꿈 해몽 | 장수와 재물운 | 무운" },
  "body-shining-light-dream": { keyword: "몸에서 빛이 나는 꿈 신분 상승 명예 대길", metaTitle: "몸에서 빛이 나는 꿈 해몽 | 신분 상승과 대성공 | 무운" },
  "bowing-to-king-in-silk-clothes-dream": { keyword: "비단옷을 입고 임금님께 절하는 꿈 해몽", metaTitle: "비단옷 입고 임금께 절하는 꿈 해몽 | 신분 상승의 정점 | 무운" },
  "bright-gem-from-chest-dream-meaning": { keyword: "가슴 속에서 밝은 보석을 꺼내는 꿈", metaTitle: "가슴 속에서 밝은 보석을 꺼내는 꿈 꿈해몽 | 무운" },
  "bright-gem-from-chest-dream-meaning-2": { keyword: "가슴 속에서 밝은 보석을 꺼내는 꿈", metaTitle: "가슴 속에서 밝은 보석을 꺼내는 꿈 꿈해몽 | 무운" },
  "bright-pearls-coming-out-mouth-dream-meaning": { keyword: "입 안에서 밝은 진주가 쏟아져 나오는 꿈", metaTitle: "입 안에서 밝은 진주가 쏟아져 나오는 꿈 꿈해몽 | 무운" },
  "bright-pearls-coming-out-mouth-dream-meaning-2": { keyword: "입 안에서 밝은 진주가 쏟아져 나오는 꿈", metaTitle: "입 안에서 밝은 진주가 쏟아져 나오는 꿈 꿈해몽 | 무운" },
  "broad-back-dream-meaning": { keyword: "등이 넓어지고 단단해지는 꿈 책임 성공 조력", metaTitle: "등이 넓어지는 꿈 해몽 | 책임감과 성공 | 무운" },
  "broad-back-wings-flying-dream-meaning": { keyword: "등이 넓어지고 날개가 돋아 하늘을 나는 꿈", metaTitle: "등이 넓어지고 날개가 돋아 하늘을 나는 꿈 꿈해몽 | 무운" },
  "broad-back-wings-flying-dream-meaning-2": { keyword: "등이 넓어지고 날개가 돋아 하늘을 나는 꿈", metaTitle: "등이 넓어지고 날개가 돋아 하늘을 나는 꿈 꿈해몽 | 무운" },
  "broad-chest-dream-meaning": { keyword: "가슴이 넓어지는 꿈 도량 성공 대인관계", metaTitle: "가슴이 넓어지는 꿈 해몽 | 도량과 신분 상승 | 무운" },
  "broad-chest-dream-meaning-2": { keyword: "가슴이 넓어지는 꿈 운세", metaTitle: "가슴이 넓어지는 꿈 해몽 지도자의 운세와 건강 | 무운" },
  "broad-shoulders-dream-meaning": { keyword: "넓고 듬직한 어깨를 가지게 되는 꿈", metaTitle: "넓은 어깨 꿈 해몽 | 권력과 명예의 상승 | 무운 메타 설명: 어깨가 넓어지는 꿈은 승진과 성공의 강력한 징조입니다. 당신의 사회적 영향력이 커질 오늘, 상세한 해석을 확인하세요." },
  "broken-bridge-dream-meaning": { keyword: "끊어진 다리 앞에서 길을 잃고 망연자실 서 있는 꿈", metaTitle: "다리가 끊어지는 꿈 해몽 | 관계의 단절과 좌절 | 무운 사주" },
  "broken-mirror-dream-meaning-2": { keyword: "거울이 산산조각 나며 깨지는 꿈", metaTitle: "거울 깨지는 꿈 해몽 | 명예 실추와 이별 징조 | 무운" },
  "burning-feet-light-dream-meaning": { keyword: "발바닥에서 불이 나듯 빛이 나는 꿈", metaTitle: "발바닥에서 불이 나듯 빛이 나는 꿈 꿈해몽 | 무운" },
  "burning-feet-light-dream-meaning-2": { keyword: "발바닥에서 불이 나듯 빛이 나는 꿈", metaTitle: "발바닥에서 불이 나듯 빛이 나는 꿈 꿈해몽 | 무운" },
  "buying-new-clothes-dream": { keyword: "새 옷을 사서 입어보며 즐거워하는 꿈", metaTitle: "새 옷 입는 꿈 해몽 | 신분 상승과 대인관계 호전 | 무운" },
  "buying-new-clothes-dream-2": { keyword: "새 옷을 사서 입어보며 즐거워하는 꿈", metaTitle: "새 옷 입는 꿈 해몽 | 신분 상승과 대인관계 호전 | 무운" },
  "candlelight-brightening-room-dream": { keyword: "화려한 촛불이 방 안을 가득 밝히는 꿈", metaTitle: "촛불이 방을 밝히는 꿈 해몽 | 지혜와 소원 성취 | 무운" },
  "car-sinking-in-water-dream": { keyword: "깊은 물 속에 가라앉은 자동차에서 빠져나오지 못하는 꿈", metaTitle: "물에 빠진 차에 갇힌 꿈 해몽 | 사회적 파산과 고립 | 무운" },
  "carp-swimming-upstream-dream": { keyword: "비단잉어가 강물을 거슬러 올라가는 꿈", metaTitle: "비단잉어 꿈 해몽 | 출세와 성공의 등용문 | 무운" },
  "carp-swimming-upstream-dream-2": { keyword: "비단잉어가 강물을 거슬러 올라가는 꿈", metaTitle: "비단잉어 꿈 해몽 | 출세와 성공의 등용문 | 무운" },
  "carp-transforming-into-dragon-dream": { keyword: "비단 잉어가 용이 되어 승천하는 것을 보는 꿈", metaTitle: "잉어가 용 되는 꿈 해몽 | 인생 역전과 거대 부귀 | 무운" },
  "carp-transforming-into-dragon-dream-2": { keyword: "비단 잉어가 용이 되어 승천하는 것을 보는 꿈", metaTitle: "잉어가 용 되는 꿈 해몽 | 인생 역전과 거대 부귀 | 무운" },
  "catching-big-fish-dream-meaning": { keyword: "큰 바다에서 거물급 물고기를 낚는 꿈", metaTitle: "큰 물고기 낚는 꿈 해몽 | 재물운 폭발과 성공 | 무운" },
  "catching-grasshopper-golden-field": { keyword: "황금 벌판에서 메뚜기나 여치를 잡는 꿈", metaTitle: "메뚜기 잡는 꿈 해몽 | 횡재수와 활발한 재물운 | 무운" },
  "catching-grasshopper-golden-field-2": { keyword: "황금 벌판에서 메뚜기나 여치를 잡는 꿈", metaTitle: "메뚜기 잡는 꿈 해몽 | 횡재수와 활발한 재물운 | 무운" },
  "catching-small-fish-stream-dream": { keyword: "맑은 냇가에서 작은 물고기를 잡는 꿈", metaTitle: "작은 물고기 잡는 꿈 해몽 | 소소한 행운과 안정적 재물운 | 무운" },
  "catching-small-fish-stream-dream-2": { keyword: "맑은 냇가에서 작은 물고기를 잡는 꿈", metaTitle: "작은 물고기 잡는 꿈 해몽 | 소소한 행운과 안정적 재물운 | 무운" },
  "celebrity-baby-dream-conception": { keyword: "연예인이 내 아이가 되거나 태몽으로 나타난 꿈", metaTitle: "연예인 태몽 해몽 | 귀한 자손과 사업의 번창 | 무운" },
  "celebrity-breakup-dream-meaning": { keyword: "연예인과 사귀다가 비참하게 차이는 꿈", metaTitle: "연예인에게 차이는 꿈 해몽 | 좌절과 현실 직시 | 무운" },
  "celebrity-breakup-dream-meaning-2": { keyword: "연예인과 사귀다가 비참하게 차이는 꿈", metaTitle: "연예인에게 차이는 꿈 해몽 | 좌절과 현실 직시 | 무운" },
  "celebrity-car-accident-dream": { keyword: "연예인이 교통사고를 당해 피를 흘리는 꿈", metaTitle: "연예인이 사고 당하는 꿈 해몽 | 목표의 붕괴와 사고 주의 | 무운" },
  "celebrity-car-accident-dream-2": { keyword: "연예인이 교통사고를 당해 피를 흘리는 꿈", metaTitle: "연예인이 사고 당하는 꿈 해몽 | 목표의 붕괴와 사고 주의 | 무운" },
  "celebrity-chased-by-crowd-dream": { keyword: "연예인이 수많은 군중에게 쫓기는 꿈", metaTitle: "연예인이 군중에게 쫓기는 꿈 해몽 | 사회적 지탄과 연대 책임 | 무운" },
  "celebrity-chased-by-crowd-dream-2": { keyword: "연예인이 수많은 군중에게 쫓기는 꿈", metaTitle: "연예인이 군중에게 쫓기는 꿈 해몽 | 사회적 지탄과 연대 책임 | 무운" },
  "celebrity-cleaning-dream-meaning": { keyword: "연예인이 우리 집 마당을 쓸거나 청소해 주는 꿈", metaTitle: "연예인이 청소해 주는 꿈 해몽 | 가운 번창과 정화 | 무운" },
  "celebrity-clothes-itchy-dream": { keyword: "연예인이 준 옷을 입었는데 몸이 가려운 꿈", metaTitle: "연예인이 준 옷 입고 가려운 꿈 해몽 | 허영과 구설수 | 무운" },
  "celebrity-clothes-itchy-dream-2": { keyword: "연예인이 준 옷을 입었는데 몸이 가려운 꿈", metaTitle: "연예인이 준 옷 입고 가려운 꿈 해몽 | 허영과 구설수 | 무운" },
  "celebrity-crying-dream-meaning": { keyword: "연예인이 울면서 나에게 하소연하는 꿈", metaTitle: "연예인이 우는 꿈 해몽 | 감정 정화와 신뢰 구축 | 무운" },
  "celebrity-crying-in-empty-theater": { keyword: "연예인이 텅 빈 공연장에서 혼자 울고 있는 꿈", metaTitle: "텅 빈 공연장에서 연예인이 우는 꿈 해몽 | 고독과 허무 | 무운" },
  "celebrity-crying-in-empty-theater-2": { keyword: "연예인이 텅 빈 공연장에서 혼자 울고 있는 꿈", metaTitle: "텅 빈 공연장에서 연예인이 우는 꿈 해몽 | 고독과 허무 | 무운" },
  "celebrity-crying-no-makeup-dream": { keyword: "연예인이 화장을 지운 맨얼굴로 울고 있는 꿈", metaTitle: "연예인이 맨얼굴로 우는 꿈 해몽 | 진실의 폭로와 실망 | 무운" },
  "celebrity-crying-no-makeup-dream-2": { keyword: "연예인이 화장을 지운 맨얼굴로 울고 있는 꿈", metaTitle: "연예인이 맨얼굴로 우는 꿈 해몽 | 진실의 폭로와 실망 | 무운" },
  "celebrity-cutting-hair-dream": { keyword: "연예인이 내 머리카락을 억지로 자르는 꿈", metaTitle: "연예인이 머리카락 자르는 꿈 해몽 | 권리 상실과 수치 | 무운" },
  "celebrity-cutting-hair-dream-2": { keyword: "연예인이 내 머리카락을 억지로 자르는 꿈", metaTitle: "연예인이 머리카락 자르는 꿈 해몽 | 권리 상실과 수치 | 무운" },
  "celebrity-disappearing-dream-meaning": { keyword: "연예인이 무대 위에서 갑자기 사라지는 꿈", metaTitle: "연예인이 사라지는 꿈 해몽 | 기회의 상실과 허망함 | 무운" },
  "celebrity-disappearing-dream-meaning-2": { keyword: "연예인이 무대 위에서 갑자기 사라지는 꿈", metaTitle: "연예인이 사라지는 꿈 해몽 | 기회의 상실과 허망함 | 무운" },
  "celebrity-distorted-face-dream": { keyword: "연예인의 얼굴이 검게 변하거나 일그러진 꿈", metaTitle: "연예인 얼굴이 일그러지는 꿈 해몽 | 배신과 사기 주의 | 무운" },
  "celebrity-distorted-face-dream-2": { keyword: "연예인의 얼굴이 검게 변하거나 일그러진 꿈", metaTitle: "연예인 얼굴이 일그러지는 꿈 해몽 | 배신과 사기 주의 | 무운" },
  "celebrity-dressing-me-up-dream": { keyword: "연예인이 화장을 해주거나 옷을 입혀주는 꿈", metaTitle: "연예인이 옷 입혀주는 꿈 해몽 | 신분 상승과 명예 | 무운" },
  "celebrity-falling-from-stage-dream": { keyword: "연예인이 화려한 무대 위에서 추락하는 꿈", metaTitle: "연예인이 무대에서 추락하는 꿈 해몽 | 명예 실추와 실패 주의 | 무운" },
  "celebrity-falling-from-stage-dream-2": { keyword: "연예인이 화려한 무대 위에서 추락하는 꿈", metaTitle: "연예인이 무대에서 추락하는 꿈 해몽 | 명예 실추와 실패 주의 | 무운" },
  "celebrity-filming-ng-dream": { keyword: "연예인과 촬영을 하다가 NG를 계속 내는 꿈", metaTitle: "연예인과 촬영 중 NG 내는 꿈 해몽 | 업무 실수와 불안 | 무운" },
  "celebrity-filming-ng-dream-2": { keyword: "연예인과 촬영을 하다가 NG를 계속 내는 꿈", metaTitle: "연예인과 촬영 중 NG 내는 꿈 해몽 | 업무 실수와 불안 | 무운" },
  "celebrity-gift-trash-dream": { keyword: "연예인이 준 선물이 알고 보니 쓰레기인 꿈", metaTitle: "연예인 선물이 쓰레기인 꿈 해몽 | 사기와 허상 주의 | 무운" },
  "celebrity-gift-trash-dream-2": { keyword: "연예인이 준 선물이 알고 보니 쓰레기인 꿈", metaTitle: "연예인 선물이 쓰레기인 꿈 해몽 | 사기와 허상 주의 | 무운" },
  "celebrity-ignoring-mocking-dream": { keyword: "유명 연예인이 나를 비웃으며 외면하는 꿈", metaTitle: "연예인이 비웃는 꿈 해몽 | 명예 하락과 소외감 | 무운" },
  "celebrity-ignoring-mocking-dream-2": { keyword: "유명 연예인이 나를 비웃으며 외면하는 꿈", metaTitle: "연예인이 비웃는 꿈 해몽 | 명예 하락과 소외감 | 무운" },
  "celebrity-insult-spitting-dream": { keyword: "연예인이 나에게 욕을 하며 침을 뱉는 꿈", metaTitle: "연예인에게 욕먹는 꿈 해몽 | 망신과 구설수 경고 | 무운" },
  "celebrity-insult-spitting-dream-2": { keyword: "연예인이 나에게 욕을 하며 침을 뱉는 꿈", metaTitle: "연예인에게 욕먹는 꿈 해몽 | 망신과 구설수 경고 | 무운" },
  "celebrity-marriage-divorce-dream": { keyword: "연예인과 결혼했는데 바로 이혼하는 꿈", metaTitle: "연예인과 결혼 후 이혼하는 꿈 해몽 | 허무한 성공과 파탄 | 무운" },
  "celebrity-marriage-divorce-dream-2": { keyword: "연예인과 결혼했는데 바로 이혼하는 꿈", metaTitle: "연예인과 결혼 후 이혼하는 꿈 해몽 | 허무한 성공과 파탄 | 무운" },
  "celebrity-rampage-at-home-dream": { keyword: "연예인이 우리 집에 와서 난동을 부리는 꿈", metaTitle: "연예인이 집에서 난동 부리는 꿈 해몽 | 가정 불화와 침해 | 무운" },
  "celebrity-rampage-at-home-dream-2": { keyword: "연예인이 우리 집에 와서 난동을 부리는 꿈", metaTitle: "연예인이 집에서 난동 부리는 꿈 해몽 | 가정 불화와 침해 | 무운" },
  "celebrity-rotten-food-dream": { keyword: "연예인이 나에게 썩은 음식을 대접하는 꿈", metaTitle: "연예인이 준 썩은 음식 꿈 해몽 | 부정적인 기회와 질병 | 무운" },
  "celebrity-rotten-food-dream-2": { keyword: "연예인이 나에게 썩은 음식을 대접하는 꿈", metaTitle: "연예인이 준 썩은 음식 꿈 해몽 | 부정적인 기회와 질병 | 무운" },
  "celebrity-saving-me-dream": { keyword: "연예인이 나를 구해주거나 도와주는 꿈", metaTitle: "연예인이 구해주는 꿈 해몽 | 위기 탈출과 천우신조 | 무운" },
  "celebrity-shipwreck-dream-meaning": { keyword: "연예인과 함께 배를 탔는데 배가 뒤집히는 꿈", metaTitle: "연예인과 탄 배가 뒤집히는 꿈 해몽 | 공동 파산과 위기 | 무운" },
  "celebrity-shipwreck-dream-meaning-2": { keyword: "연예인과 함께 배를 탔는데 배가 뒤집히는 꿈", metaTitle: "연예인과 탄 배가 뒤집히는 꿈 해몽 | 공동 파산과 위기 | 무운" },
  "celebrity-shooting-in-war-dream": { keyword: "연예인이 전쟁터에서 총을 쏘는 꿈", metaTitle: "연예인이 총 쏘는 꿈 해몽 | 경쟁과 공격성 주의 | 무운" },
  "celebrity-shooting-in-war-dream-2": { keyword: "연예인이 전쟁터에서 총을 쏘는 꿈", metaTitle: "연예인이 총 쏘는 꿈 해몽 | 경쟁과 공격성 주의 | 무운" },
  "celebrity-singing-in-cemetery-dream": { keyword: "연예인이 공동묘지에서 노래를 부르는 꿈", metaTitle: "묘지에서 연예인이 노래하는 꿈 해몽 | 허무한 영광과 우환 | 무운" },
  "celebrity-singing-in-cemetery-dream-2": { keyword: "연예인이 공동묘지에서 노래를 부르는 꿈", metaTitle: "묘지에서 연예인이 노래하는 꿈 해몽 | 허무한 영광과 우환 | 무운" },
  "celebrity-stage-mistake-dream": { keyword: "무대 위에서 연예인이 실수하여 야유를 받는 꿈", metaTitle: "연예인이 무대에서 실수하는 꿈 해몽 | 실패와 비난 주의 | 무운" },
  "celebrity-stage-mistake-dream-2": { keyword: "무대 위에서 연예인이 실수하여 야유를 받는 꿈", metaTitle: "연예인이 무대에서 실수하는 꿈 해몽 | 실패와 비난 주의 | 무운" },
  "celebrity-taking-to-jail-dream": { keyword: "연예인이 나를 감옥으로 끌고 가는 꿈", metaTitle: "연예인이 나를 가두는 꿈 해몽 | 사회적 억압과 속박 | 무운" },
  "celebrity-taking-to-jail-dream-2": { keyword: "연예인이 나를 감옥으로 끌고 가는 꿈", metaTitle: "연예인이 나를 가두는 꿈 해몽 | 사회적 억압과 속박 | 무운" },
  "celebrity-torn-clothes-dream": { keyword: "연예인의 화려한 옷이 찢어지는 것을 본 꿈", metaTitle: "연예인 옷이 찢어지는 꿈 해몽 | 자산 손실과 실망 | 무운" },
  "celebrity-torn-clothes-dream-2": { keyword: "연예인의 화려한 옷이 찢어지는 것을 본 꿈", metaTitle: "연예인 옷이 찢어지는 꿈 해몽 | 자산 손실과 실망 | 무운" },
  "changing-into-new-clothes-dream": { keyword: "낡은 옷을 벗고 화려한 새 옷으로 갈아입는 꿈", metaTitle: "새 옷으로 갈아입는 꿈 해몽 | 승진과 이직의 징조 | 무운" },
  "changing-into-new-clothes-dream-2": { keyword: "낡은 옷을 벗고 화려한 새 옷으로 갈아입는 꿈", metaTitle: "새 옷으로 갈아입는 꿈 해몽 | 승진과 이직의 징조 | 무운" },
  "chased-by-armed-stranger-dream": { keyword: "캄캄한 밤길에 낯선 사람이 뒤를 밟으며 낫이나 도끼를 휘두르는 꿈", metaTitle: "무기 든 괴한에게 쫓기는 꿈 해몽 | 신변 위협과 경쟁자 | 무운" },
  "child-wearing-gold-clothes-dream": { keyword: "황금 옷을 입은 동자가 방으로 들어오는 꿈", metaTitle: "황금 옷 입은 동자 꿈 해몽 | 최고의 태몽과 재물운 | 무운" },
  "clean-toilet-dream-meaning": { keyword: "깨끗한 화장실에서 볼일을 시원하게 보는 꿈 근심 해소", metaTitle: "깨끗한 화장실에서 볼일 보는 꿈 해몽 | 재물과 근심 해결 무운" },
  "clear-powerful-voice-dream": { keyword: "목소리가 우렁차고 맑게 나오는 꿈 명성 설득 성공", metaTitle: "목소리가 우렁차게 나오는 꿈 해몽 | 명성과 영향력 | 무운" },
  "clear-vision-dream-meaning": { keyword: "눈이 맑아지고 멀리 있는 보물까지 다 보이는 꿈", metaTitle: "눈이 맑아지는 꿈 해몽 | 통찰력과 기회 포착의 달인 | 무운 메타 설명: 눈이 밝아져 멀리까지 보는 꿈은 성공의 기회를 포착할 예지몽입니다. 당신의 앞길을 밝혀줄 통찰력을 확인하세요." },
  "clear-water-flooding-house-dream-2": { keyword: "맑은 물이 집안으로 가득 차오르는 꿈", metaTitle: "집안에 맑은 물이 차는 꿈 해몽 | 재물운과 가문의 번창 | 무운" },
  "clear-water-flooding-house-dream-3": { keyword: "맑은 물이 집안 가득 넘쳐흐르는 꿈", metaTitle: "집안에 물이 가득 찬 꿈 해몽 | 멈추지 않는 재물운 | 무운" },
  "clear-well-water-dream-meaning": { keyword: "맑은 물이 솟구치는 우물 꿈", metaTitle: "맑은 우물물 꿈 해몽 | 성공과 합격의 징조 | 무운" },
  "climbing-golden-mountain-dream": { keyword: "비단 안개를 헤치고 황금 산에 오르는 꿈", metaTitle: "황금 산에 오르는 꿈 해몽 | 자수성가와 최고의 부귀영화 | 무운" },
  "climbing-golden-mountain-dream-2": { keyword: "비단 안개를 헤치고 황금 산에 오르는 꿈", metaTitle: "황금 산에 오르는 꿈 해몽 | 자수성가와 최고의 부귀영화 | 무운" },
  "climbing-mountain-dream": { keyword: "산을 오르는 꿈 등산 꿈", metaTitle: "산을 오르는 꿈 해몽 | 정상 정복의 의미 | 무운" },
  "climbing-mountain-dream-2": { keyword: "산을 오르는 꿈 등산 꿈", metaTitle: "산을 오르는 꿈 해몽 | 정상 정복의 의미 | 무운" },
  "confession-from-stranger-dream": { keyword: "낯선 이성에게 고백받는 꿈", metaTitle: "낯선 이성에게 고백받는 꿈 | 대인관계운 상승 | 무운" },
  "cooking-with-ex-dream-interpretation": { keyword: "옛 연인과 함께 요리하는 꿈 전남친과 요리 꿈", metaTitle: "옛 연인과 요리하는 꿈 해몽 | 재능의 부활과 성공의 맛 | 무운" },
  "crossing-river-on-boat-with-crush": { keyword: "짝사랑과 함께 배 타고 건너는 꿈 강물 데이트 꿈", metaTitle: "짝사랑과 배 타는 꿈 해몽 | 순조로운 성공과 목표 달성 | 무운" },
  "crow-swarm-nightmare-meaning": { keyword: "시커먼 까마귀 떼가 하늘을 뒤덮고 나를 향해 달려드는 꿈", metaTitle: "까마귀 떼가 공격하는 꿈 해몽 | 불운의 징조와 예방 | 무운 사주" },
  "crush-brushing-my-hair-dream": { keyword: "짝사랑이 내 머리카락을 빗겨주는 꿈 머리 손질 꿈", metaTitle: "짝사랑이 머리 빗겨주는 꿈 해몽 | 근심 해결과 매력 상승 | 무운" },
  "crush-cleaning-my-shoes-dream": { keyword: "짝사랑이 내 신발 닦아주는 꿈 구두 수선 꿈", metaTitle: "짝사랑이 신발 닦아주는 꿈 해몽 | 명예 회복과 탄탄대로 | 무운" },
  "crush-clipping-my-nails-dream": { keyword: "짝사랑이 내 손톱 깎아주는 꿈 손질 받는 꿈", metaTitle: "짝사랑이 손톱 깎아주는 꿈 해몽 | 디테일한 성공과 지원 | 무운" },
  "crush-dressing-me-up-dream": { keyword: "짝사랑이 내 옷을 입혀주는 꿈 옷 선물 받는 꿈", metaTitle: "짝사랑이 옷 입혀주는 꿈 해몽 | 신분 상승과 보호운 | 무운" },
  "crush-hugging-me-dream-interpretation": { keyword: "짝사랑이 나를 안아주는 꿈 좋아하는 사람과 포옹하는 꿈", metaTitle: "짝사랑이 안아주는 꿈 해몽 | 소원 성취와 귀인의 등장 | 무운" },
  "crush-putting-shoes-on-me": { keyword: "짝사랑이 내 신발 신겨주는 꿈 구두 선물 꿈", metaTitle: "짝사랑이 신발 신겨주는 꿈 해몽 | 인생의 기반과 성공 | 무운" },
  "crush-singing-for-me-dream": { keyword: "짝사랑이 나를 위해 노래 부르는 꿈 세레나데 꿈", metaTitle: "짝사랑이 노래 불러주는 꿈 해몽 | 인기와 명예의 상승 | 무운" },
  "crush-writing-on-my-hand-dream": { keyword: "짝사랑이 내 손바닥에 글씨 쓰는 꿈 손등 낙서 꿈", metaTitle: "짝사랑이 손바닥에 글씨 쓰는 꿈 해몽 | 독점 정보와 계약운 | 무운" },
  "crying-tears-of-blood-dream": { keyword: "피눈물을 흘리는 꿈 대박 반전 횡재 성취", metaTitle: "피눈물 흘리는 꿈 해몽 | 대역전과 횡재수 | 무운" },
  "crying-with-ex-in-rain-dream": { keyword: "옛 연인과 비 맞으며 우는 꿈 빗속의 눈물 재회", metaTitle: "옛 연인과 빗속에서 우는 꿈 해몽 | 감정 정화와 대운의 시작 | 무운" },
  "cutting-fingernails-dream-meaning": { keyword: "손톱을 정성스럽게 깎고 다듬는 꿈", metaTitle: "손톱 깎는 꿈 해몽 | 걱정 해소와 새로운 시작의 길몽 | 무운 메타 설명: 손톱을 정성껏 깎는 꿈은 근심이 사라지고 재물운이 상승할 징조입니다. 상황별 상세 해석과 행운의 숫자까지 지금 바로 확인하고 운을 잡으세요." },
  "dancing-in-the-rain-with-stranger": { keyword: "모르는 이성과 빗속에서 춤추는 꿈 낯선 사람과 댄스", metaTitle: "모르는 이성과 빗속에서 춤추는 꿈 해몽 | 감성 폭발과 성공 | 무운" },
  "dark-tunnel-lost-dream": { keyword: "깊고 어두운 터널 속에서 끝을 알 수 없이 헤매는 꿈", metaTitle: "터널 속에서 길을 잃은 꿈 해몽 | 인생의 암흑기와 정체 | 무운 사주" },
  "dating-same-sex-friend-dream": { keyword: "동성과 데이트하는 꿈 친구와 연인이 되는 꿈", metaTitle: "동성 친구와 데이트하는 꿈 해몽 | 신뢰와 협력의 징조 | 무운" },
  "dating-teacher-dream-meaning": { keyword: "선생님과 사귀는 꿈 스승과 데이트하는 꿈", metaTitle: "선생님과 사귀는 꿈 해몽 | 지혜의 습득과 승진운 | 무운" },
  "dead-person-coming-alive-dream": { keyword: "죽은 사람이 살아나는 꿈 시체 꿈", metaTitle: "죽은 사람이 살아나는 꿈 해몽 | 시체 꿈의 반전 | 무운" },
  "dead-person-coming-alive-dream-2": { keyword: "죽은 사람이 살아나는 꿈 시체 꿈", metaTitle: "죽은 사람이 살아나는 꿈 해몽 | 시체 꿈의 반전 | 무운" },
  "deceased-ancestor-smiling-dream": { keyword: "돌아가신 조상님이 웃는 꿈", metaTitle: "돌아가신 조상님이 웃는 꿈 | 집안의 경사와 안정 | 무운" },
  "deceased-ancestor-smiling-dream-2": { keyword: "돌아가신 조상이 웃는 꿈 집안 경사", metaTitle: "돌아가신 조상님이 웃는 꿈 해몽 | 집안이 일어설 길조 무운" },
  "deceased-celebrity-dream-meaning": { keyword: "죽은 연예인이 나타나 미소 짓는 꿈", metaTitle: "죽은 연예인이 나오는 꿈 해몽 | 기적 같은 기회와 반전 | 무운" },
  "deceased-grandparents-dream": { keyword: "돌아가신 할머니 할아버지 꿈 조상 꿈", metaTitle: "돌아가신 할머니 할아버지 꿈 해몽 | 조상의 메시지 | 무운" },
  "deceased-grandparents-dream-2": { keyword: "돌아가신 할머니 할아버지 꿈 조상 꿈", metaTitle: "돌아가신 할머니 할아버지 꿈 해몽 | 조상의 메시지 | 무운" },
  "deity-descending-on-clouds-dream": { keyword: "하늘에서 오색 구름을 타고 신선이 내려오는 꿈", metaTitle: "신선 꿈 해몽 | 천운을 타고난 거대한 성공 | 무운" },
  "deity-descending-on-clouds-dream-2": { keyword: "하늘에서 오색 구름을 타고 신선이 내려오는 꿈", metaTitle: "신선 꿈 해몽 | 천운을 타고난 거대한 성공 | 무운" },
  "digging-gold-bars-dream-meaning": { keyword: "깊은 구덩이 속에서 금괴를 무더기로 캐내는 꿈", metaTitle: "금괴 캐내는 꿈 해몽 | 일확천금과 숨겨진 재물운 | 무운" },
  "digging-gold-bars-dream-meaning-2": { keyword: "깊은 구덩이 속에서 금괴를 무더기로 캐내는 꿈", metaTitle: "금괴 캐내는 꿈 해몽 | 일확천금과 숨겨진 재물운 | 무운" },
  "digging-wild-ginseng-dream": { keyword: "깊은 산속에서 큰 산삼을 발견하고 캐는 꿈", metaTitle: "산삼 캐는 꿈 해몽 | 로또 당첨의 일등 공신 꿈 | 무운" },
  "dining-with-celebrity-dream": { keyword: "유명 인사와 함께 식사하며 대화하는 꿈", metaTitle: "유명인과 식사하는 꿈 해몽 | 명예운과 신분 상승 | 무운" },
  "discovering-treasure-ship-dream": { keyword: "바다 한가운데서 보물선을 발견하는 꿈 대박 행운", metaTitle: "바다에서 보물선을 발견하는 꿈 해몽 | 인생 역전 대박 운세 무운" },
  "distorted-mirror-face-dream": { keyword: "거울 속의 내 얼굴이 무섭게 일그러지거나 보이지 않는 꿈", metaTitle: "거울 속 얼굴이 일그러진 꿈 해몽 | 정체성 위기와 자존감 | 무운 사주" },
  "diving-from-cliff-dream-meaning": { keyword: "높은 절벽에서 멋지게 다이빙하는 꿈 해몽", metaTitle: "절벽 다이빙 꿈 해몽 | 용기 있는 도전과 성공 | 무운" },
  "dragon-ascending-dream-meaning": { keyword: "용이 하늘로 승천하는 꿈 재물운 태몽", metaTitle: "용이 하늘로 승천하는 꿈 해몽 | 재물과 명예의 최고봉 무운" },
  "dragon-ascending-heaven-dream": { keyword: "용이 하늘로 승천하며 여의주를 물고 있는 꿈", metaTitle: "용이 승천하는 꿈 해몽 | 인생 역전의 대길몽 확인 | 무운" },
  "dragon-descending-from-sky-dream": { keyword: "하늘에서 용이 내려오는 꿈", metaTitle: "용이 하늘에서 내려오는 꿈 | 최고 등급 대길몽 | 무운" },
  "drowning-in-deep-water-dream": { keyword: "깊은 물 속에 빠져 허우적거리는 꿈", metaTitle: "깊은 물에 빠지는 꿈 해몽 | 고립과 위기 극복법 | 무운" },
  "drowning-in-deep-water-dream-2": { keyword: "깊은 물 속에 빠져 허우적거리는 꿈", metaTitle: "깊은 물에 빠지는 꿈 해몽 | 고립과 위기 극복법 | 무운" },
  "eating-with-lover-dream-meaning": { keyword: "연인과 맛있는 음식 먹는 꿈 먹방 데이트 꿈", metaTitle: "연인과 음식 먹는 꿈 해몽 | 풍요로운 재물운과 식복 | 무운" },
  "entering-city-gate-with-flag-dream": { keyword: "화려한 깃발을 들고 성문 안으로 들어가는 꿈", metaTitle: "성문 입성 깃발 꿈 해몽 | 승리와 영광의 상징 | 무운" },
  "entering-palace-mansion-dream-2": { keyword: "화려한 궁궐이나 대저택에 들어가는 꿈", metaTitle: "궁궐이나 대저택 들어가는 꿈 해몽 | 신분 상승과 성공 | 무운" },
  "escaping-cave-to-light-dream": { keyword: "깊은 동굴 속에서 밝은 빛을 따라 밖으로 나오는 꿈", metaTitle: "동굴 탈출하는 꿈 해몽 | 고난 끝 행복 시작 | 무운" },
  "escaping-cave-to-light-dream-2": { keyword: "깊은 동굴 속에서 밝은 빛을 따라 밖으로 나오는 꿈", metaTitle: "동굴 탈출하는 꿈 해몽 | 고난 끝 행복 시작 | 무운" },
  "escaping-deep-pit-dream": { keyword: "깊은 구덩이에 빠졌다가 스스로 기어 나오는 꿈", metaTitle: "구덩이에서 빠져나오는 꿈 해몽 | 위기 극복과 부활 | 무운" },
  "escaping-deep-pit-dream-2": { keyword: "깊은 구덩이에 빠졌다가 스스로 기어 나오는 꿈", metaTitle: "구덩이에서 빠져나오는 꿈 해몽 | 위기 극복과 부활 | 무운" },
  "ex-back-together-dream-meaning": { keyword: "옛 연인과 다시 사귀는 꿈 전남친 전여친 재결합 꿈", metaTitle: "전남친 전여친과 다시 사귀는 꿈 해몽 | 재회와 성공의 징조 | 무운" },
  "ex-lover-accidental-meeting-dream": { keyword: "옛 연인과 우연히 마주치는 꿈 길에서 전남친 만나는 꿈", metaTitle: "옛 연인과 마주치는 꿈 해몽 | 뜻밖의 행운과 기회 | 무운" },
  "ex-lover-crying-dream-meaning": { keyword: "전남친 전여친이 우는 꿈 옛 연인의 눈물 꿈", metaTitle: "옛 연인이 우는 꿈 해몽 | 액운 소멸과 새로운 시작 | 무운" },
  "ex-lover-dying-dream-meaning": { keyword: "과거의 연인이 죽는 꿈 전남친 죽는 꿈", metaTitle: "전남친 전여친이 죽는 꿈 해몽 | 고난 끝 행복 시작 | 무운" },
  "exam-test-dream-meaning": { keyword: "시험 보는 꿈 불합격 합격 꿈", metaTitle: "시험 보는 꿈 해몽 | 합격과 불합격의 진실 | 무운" },
  "exam-test-dream-meaning-2": { keyword: "시험 보는 꿈 불합격 합격 꿈", metaTitle: "시험 보는 꿈 해몽 | 합격과 불합격의 진실 | 무운" },
  "eye-contact-with-opposite-sex-dream": { keyword: "이성과 눈싸움하는 꿈 연인과 눈 맞춤 꿈", metaTitle: "이성과 눈 맞추는 꿈 해몽 | 신뢰와 완벽한 소통 | 무운" },
  "face-spots-rotting-skin-dream": { keyword: "얼굴에 검은 반점이 생기거나 피부가 썩어 들어가는 꿈", metaTitle: "얼굴에 반점 생기는 꿈 해몽 | 명예 실추와 치부 노출 | 무운" },
  "falling-cliff-nightmare-meaning": { keyword: "높은 절벽에서 끝도 없이 떨어지며 비명을 지르는 꿈", metaTitle: "높은 곳에서 떨어지는 꿈 해몽 | 지위 하락과 불안감 | 무운 사주" },
  "falling-flower-petals-from-sky-dream": { keyword: "하늘에서 오색찬란한 꽃비가 내리는 꿈", metaTitle: "하늘에서 꽃비 내리는 꿈 해몽 | 최고의 축복과 성공 | 무운" },
  "falling-from-cliff-dream-2": { keyword: "높은 절벽에서 떨어지는 꿈 추락", metaTitle: "절벽에서 떨어지는 꿈 해몽 | 추락의 의미와 심리 | 무운" },
  "falling-into-water-dream": { keyword: "바다에 빠지는 꿈 강물에 빠지는 꿈", metaTitle: "물에 빠지는 꿈 해몽 | 바다 강물 꿈의 의미 | 무운" },
  "falling-into-water-dream-2": { keyword: "바다에 빠지는 꿈 강물에 빠지는 꿈", metaTitle: "물에 빠지는 꿈 해몽 | 바다 강물 꿈의 의미 | 무운" },
  "field-of-blooming-flowers-dream": { keyword: "넓은 들판에 꽃이 만발한 꿈 만사형통", metaTitle: "들판에 꽃이 만발한 꿈 해몽 | 전성기와 행복의 시작 무운" },
  "fighting-with-celebrity-dream": { keyword: "유명 연예인과 싸우거나 다투는 꿈", metaTitle: "연예인과 싸우는 꿈 해몽 | 경쟁 승리와 문제 해결 | 무운" },
  "filthy-toilet-overflowing-dream": { keyword: "화장실에 갔는데 오물이 넘쳐 내 몸과 옷에 묻어 불쾌한 꿈", metaTitle: "화장실 오물 넘치는 꿈 해몽 | 망신살과 부정직 경고 | 무운" },
  "finding-cabin-in-woods-dream": { keyword: "숲속에서 길을 잃었다가 아름다운 오두막을 발견하는 꿈", metaTitle: "숲속 오두막 발견하는 꿈 해몽 | 휴식과 해결책 | 무운" },
  "finding-cabin-in-woods-dream-2": { keyword: "숲속에서 길을 잃었다가 아름다운 오두막을 발견하는 꿈", metaTitle: "숲속 오두막 발견하는 꿈 해몽 | 휴식과 해결책 | 무운" },
  "finding-jewels-under-waterfall-dream": { keyword: "깊은 산속 폭포 아래서 보석을 줍는 꿈", metaTitle: "폭포 아래 보석 꿈 해몽 | 고난 극복과 결실 | 무운" },
  "finding-lamp-in-dark-road-dream": { keyword: "어두운 밤길에서 밝은 등불을 발견하는 꿈", metaTitle: "어두운 길에서 등불 발견하는 꿈 | 위기 극복과 희망 | 무운" },
  "finding-lost-shoes-dream": { keyword: "잃어버린 신발을 다시 찾는 꿈", metaTitle: "잃어버린 신발 찾는 꿈 해몽 | 관계 회복과 안정 | 무운" },
  "finding-lost-shoes-dream-2": { keyword: "잃어버린 신발을 다시 찾는 꿈", metaTitle: "잃어버린 신발 찾는 꿈 해몽 | 관계 회복과 안정 | 무운" },
  "finding-pearl-in-ocean-dream": { keyword: "깊은 바닷속에서 진주를 발견하는 꿈 해몽", metaTitle: "바닷속 진주 꿈 해몽 | 재능의 발견과 고귀한 성취 | 무운" },
  "finding-treasure-chest-dream": { keyword: "깊은 숲속에서 보물상자를 발견하는 꿈 해몽", metaTitle: "보물상자 발견하는 꿈 해몽 | 횡재수와 잠재력 폭발 | 무운" },
  "finding-treasure-ship-dream": { keyword: "바다 한가운데서 보물선을 발견하는 꿈", metaTitle: "보물선 발견하는 꿈 해몽 | 인생 역전과 거대 자산 형성 | 무운" },
  "finding-treasure-ship-dream-2": { keyword: "바다 한가운데서 보물선을 발견하는 꿈", metaTitle: "보물선 발견하는 꿈 해몽 | 인생 역전과 거대 자산 형성 | 무운" },
  "finding-wild-ginseng-dream-2": { keyword: "깊은 산속에서 산삼을 발견하는 꿈 건강과 횡재", metaTitle: "산삼을 발견하는 꿈 해몽 | 건강 회복과 뜻밖의 재물 무운" },
  "finding-wild-ginseng-dream-3": { keyword: "깊은 산속에서 산삼을 발견하는 꿈", metaTitle: "산삼 발견하는 꿈 해몽 | 역대급 횡재수와 성공 | 무운" },
  "finding-wild-ginseng-dream-4": { keyword: "깊은 산속에서 산삼을 발견하는 꿈", metaTitle: "산삼 발견하는 꿈 해몽 | 역대급 횡재수와 성공 | 무운" },
  "finger-cut-scissors-dream": { keyword: "날카로운 가위에 손가락이 잘리는 꿈", metaTitle: "가위에 손가락 잘리는 꿈 해몽 | 인연의 단절과 손실 | 무운" },
  "finger-cut-scissors-dream-2": { keyword: "날카로운 가위에 손가락이 잘리는 꿈", metaTitle: "가위에 손가락 잘리는 꿈 해몽 | 인연의 단절과 손실 | 무운" },
  "fire-trapped-dream-meaning": { keyword: "불이 난 집에서 빠져나오지 못하고 연기에 질식하는 꿈", metaTitle: "불 속에 갇히는 꿈 해몽 | 번아웃과 재물 손실 | 무운 사주" },
  "fireworks-display-dream-meaning": { keyword: "화려한 불꽃놀이를 구경하며 기뻐하는 꿈 해몽", metaTitle: "불꽃놀이 구경하는 꿈 해몽 | 명예와 축제의 시작 | 무운" },
  "fishing-golden-carp-dream": { keyword: "맑은 샘물가에서 황금 잉어를 낚는 꿈 해몽", metaTitle: "황금 잉어 낚는 꿈 해몽 | 횡재수와 출세의 징조 | 무운" },
  "flying-airplane-above-clouds-dream": { keyword: "비행기를 타고 구름 위를 나는 꿈", metaTitle: "비행기 타고 구름 위를 나는 꿈 | 고속 성공과 자유 | 무운" },
  "flying-in-airplane-above-clouds-dream": { keyword: "비행기를 타고 구름 위를 나는 꿈 신분 상승", metaTitle: "비행기 타고 구름 위를 나는 꿈 해몽 | 성공과 자유의 상징 무운" },
  "flying-in-airplane-dream-2": { keyword: "비행기 타는 꿈 하늘을 나는 꿈", metaTitle: "비행기 타는 꿈 해몽 | 신분 상승과 성공의 징조 | 무운" },
  "flying-on-airplane-cloud-dream": { keyword: "비행기를 타고 구름 위를 날아가는 꿈", metaTitle: "비행기 타고 구름 위 나는 꿈 해몽 | 성공과 자유 | 무운" },
  "flying-on-airplane-cloud-dream-2": { keyword: "비행기를 타고 구름 위를 날아가는 꿈", metaTitle: "비행기 타고 구름 위 나는 꿈 해몽 | 성공과 자유 | 무운" },
  "flying-on-airplane-dream": { keyword: "비행기를 타고 구름 위를 나는 꿈", metaTitle: "비행기 타고 나는 꿈 해몽 | 지위 상승과 소원 성취 | 무운" },
  "fragrant-flower-scent-body-dream-meaning": { keyword: "몸에서 향기로운 꽃내음이 진동하는 꿈", metaTitle: "몸에서 향기로운 꽃내음이 진동하는 꿈 꿈해몽 | 무운" },
  "fragrant-flower-scent-body-dream-meaning-2": { keyword: "몸에서 향기로운 꽃내음이 진동하는 꿈", metaTitle: "몸에서 향기로운 꽃내음이 진동하는 꿈 꿈해몽 | 무운" },
  "front-teeth-falling-out-dream-2": { keyword: "앞니가 몽땅 빠져버리는 꿈", metaTitle: "앞니가 몽땅 빠지는 꿈 해몽 | 가족 우환과 명예 실추 | 무운" },
  "full-moon-in-night-sky-dream": { keyword: "밤하늘에 커다란 보름달이 뜨는 꿈 해몽", metaTitle: "보름달 꿈 해몽 | 소원 성취와 가정의 화목 | 무운" },
  "full-rice-pot-dream-meaning": { keyword: "큰 솥에 밥이 가득 들어있는 꿈", metaTitle: "솥에 밥이 가득한 꿈 해몽 | 경제적 안정과 식복 | 무운" },
  "full-rice-pot-dream-meaning-2": { keyword: "큰 솥에 밥이 가득 들어있는 꿈", metaTitle: "솥에 밥이 가득한 꿈 해몽 | 경제적 안정과 식복 | 무운" },
  "funeral-clothes-dream-meaning": { keyword: "검은 상복을 입은 사람들이 줄지어 집으로 들어오는 꿈", metaTitle: "상복 입은 사람이 집으로 들어오는 꿈 해몽 | 우환과 이별 | 무운 사주" },
  "gems-from-mouth-dream": { keyword: "입안에서 끊임없이 옥구슬이 나오는 꿈", metaTitle: "입에서 구슬 나오는 꿈 해몽 | 언어의 재능과 재물운 | 무운 메타 설명: 입에서 옥구슬이 나오는 꿈은 말로써 성공하고 큰 부를 얻을 징조입니다. 당신의 지혜가 빛날 순간을 확인하세요." },
  "getting-milk-from-crush-dream": { keyword: "짝사랑이 나에게 우유 주는 꿈 음료 받는 꿈", metaTitle: "짝사랑이 우유 주는 꿈 해몽 | 지식의 습득과 정서적 충만 | 무운" },
  "getting-money-from-ex-dream": { keyword: "옛 연인에게 돈 받는 꿈 전남친 돈 빌려주는 꿈", metaTitle: "옛 연인에게 돈 받는 꿈 해몽 | 재물운의 회복과 횡재 | 무운" },
  "getting-taller-dream-meaning": { keyword: "키가 갑자기 커지는 꿈 신분 상승 명예 도약", metaTitle: "키가 커지는 꿈 해몽 | 신분 상승과 명예 | 무운" },
  "giant-carp-hug-dream": { keyword: "커다란 잉어를 품에 안는 꿈", metaTitle: "큰 잉어 품에 안는 꿈 해몽 | 재물운과 태몽 | 무운" },
  "giant-tree-reaching-sky-dream": { keyword: "마당에 큰 나무가 자라 하늘까지 닿는 꿈", metaTitle: "큰 나무가 하늘에 닿는 꿈 해몽 | 가문의 번창과 지속적 부 | 무운" },
  "giant-tree-reaching-sky-dream-2": { keyword: "마당에 큰 나무가 자라 하늘까지 닿는 꿈", metaTitle: "큰 나무가 하늘에 닿는 꿈 해몽 | 가문의 번창과 지속적 부 | 무운" },
  "giant-wave-flood-dream-meaning": { keyword: "거대한 파도가 덮쳐 마을이 물에 잠기고 고립되는 꿈", metaTitle: "파도가 덮치는 꿈 해몽 | 사회적 격변과 고립 | 무운 사주" },
  "glowing-eyes-dream-meaning": { keyword: "눈에서 빛이 나는 꿈", metaTitle: "눈에서 빛이 나는 꿈 해몽 통찰력과 성공의 열쇠 | 무운" },
  "glowing-palms-dream-meaning": { keyword: "손바닥에서 맑은 기운이나 빛이 나는 꿈", metaTitle: "빛나는 손바닥 꿈 해몽 | 재물과 성공의 신의 손 | 무운 메타 설명: 손바닥에서 빛이 나는 꿈은 추진하는 일마다 큰 성공을 거둘 징조입니다. 놀라운 재물운의 비밀을 지금 확인하세요." },
  "gold-coins-falling-from-sky-dream": { keyword: "하늘에서 금화가 비처럼 쏟아지는 꿈", metaTitle: "하늘에서 금화 쏟아지는 꿈 해몽 | 역대급 횡재수와 복권운 | 무운" },
  "gold-coins-falling-from-sky-dream-2": { keyword: "하늘에서 금화가 비처럼 쏟아지는 꿈", metaTitle: "하늘에서 금화 쏟아지는 꿈 해몽 | 역대급 횡재수와 복권운 | 무운" },
  "gold-dust-falling-from-sky-dream": { keyword: "맑은 하늘에서 금가루가 비처럼 쏟아지는 꿈", metaTitle: "금가루 비 꿈 해몽 | 로또급 횡재수와 부귀 | 무운" },
  "golden-apple-orchard-dream": { keyword: "황금 사과가 주렁주렁 열린 과수원을 걷는 꿈", metaTitle: "황금 사과 꿈 해몽 | 완벽한 결실과 경제적 자유 | 무운" },
  "golden-apple-orchard-dream-2": { keyword: "황금 사과가 주렁주렁 열린 과수원을 걷는 꿈", metaTitle: "황금 사과 꿈 해몽 | 완벽한 결실과 경제적 자유 | 무운" },
  "golden-armor-standing-dream-meaning": { keyword: "온몸에 황금 갑옷을 입고 당당히 서 있는 꿈", metaTitle: "온몸에 황금 갑옷을 입고 당당히 서 있는 꿈 꿈해몽 | 무운" },
  "golden-armor-standing-dream-meaning-2": { keyword: "온몸에 황금 갑옷을 입고 당당히 서 있는 꿈", metaTitle: "온몸에 황금 갑옷을 입고 당당히 서 있는 꿈 꿈해몽 | 무운" },
  "golden-bird-sitting-on-shoulder-dream": { keyword: "황금 새가 내 어깨에 앉는 꿈 기쁜 소식", metaTitle: "황금 새가 어깨에 앉는 꿈 해몽 | 경사와 명예의 상징 무운" },
  "golden-calf-from-well-dream": { keyword: "깊은 우물 안에서 금송아지가 나오는 꿈", metaTitle: "금송아지 꿈 해몽 | 로또급 재물운과 가문 번창 | 무운" },
  "golden-clothes-throne-dream": { keyword: "황금 옷을 입고 왕좌에 앉는 꿈 신분 상승", metaTitle: "황금 옷 입고 왕좌에 앉는 꿈 해몽 | 성공과 권력의 정점 무운" },
  "golden-constellation-in-hand-dream": { keyword: "하늘에 수놓인 황금색 별자리가 내 손안으로 들어오는 꿈", metaTitle: "별자리 손에 쥐는 꿈 해몽 | 천문학적인 재물과 지혜 | 무운" },
  "golden-constellation-in-hand-dream-2": { keyword: "하늘에 수놓인 황금색 별자리가 내 손안으로 들어오는 꿈", metaTitle: "별자리 손에 쥐는 꿈 해몽 | 천문학적인 재물과 지혜 | 무운" },
  "golden-face-dream-meaning": { keyword: "얼굴이 황금색으로 변하는 꿈 부귀 명예 횡재", metaTitle: "얼굴이 황금색으로 변하는 꿈 해몽 | 부귀영화와 횡재 | 무운" },
  "golden-field-dream-meaning": { keyword: "넓은 들판에 곡식이 황금빛으로 익어 있는 꿈", metaTitle: "황금 들판 꿈 해몽 | 거액의 재물이 들어오는 꿈 | 무운" },
  "golden-glow-in-hand-dream-meaning": { keyword: "손에서 금빛 광채가 나는 꿈", metaTitle: "손에서 금빛 광채가 나는 꿈 꿈해몽 | 무운" },
  "golden-glow-in-hand-dream-meaning-2": { keyword: "손에서 금빛 광채가 나는 꿈", metaTitle: "손에서 금빛 광채가 나는 꿈 꿈해몽 | 무운" },
  "golden-heart-dream-meaning": { keyword: "심장이 황금으로 변하는 꿈 고귀 성공 결실", metaTitle: "심장이 황금으로 변하는 꿈 해몽 | 부귀영화와 깨달음 | 무운" },
  "golden-key-dream-meaning": { keyword: "황금 열쇠를 손에 쥐는 꿈", metaTitle: "황금 열쇠 꿈 해몽 | 성공의 문이 열리다 | 무운" },
  "golden-key-dream-meaning-2": { keyword: "황금 열쇠를 손에 쥐는 꿈", metaTitle: "황금 열쇠 꿈 해몽 | 재물의 문을 여는 결정적 기회 | 무운" },
  "golden-key-dream-meaning-3": { keyword: "황금 열쇠를 손에 쥐는 꿈", metaTitle: "황금 열쇠 꿈 해몽 | 재물의 문을 여는 결정적 기회 | 무운" },
  "golden-nails-dream-meaning": { keyword: "손톱과 발톱이 황금색으로 변하는 꿈", metaTitle: "손톱과 발톱이 황금색으로 변하는 꿈 꿈해몽 | 무운" },
  "golden-nails-dream-meaning-2": { keyword: "손톱과 발톱이 황금색으로 변하는 꿈", metaTitle: "손톱과 발톱이 황금색으로 변하는 꿈 꿈해몽 | 무운" },
  "golden-ocean-waves-dream": { keyword: "바닷물이 황금색으로 변하며 파도치는 꿈", metaTitle: "황금빛 바다 꿈 해몽 | 거대한 자산 가치 상승 | 무운" },
  "golden-ocean-waves-dream-2": { keyword: "바닷물이 황금색으로 변하며 파도치는 꿈", metaTitle: "황금빛 바다 꿈 해몽 | 거대한 자산 가치 상승 | 무운" },
  "golden-pig-hugging-dream-meaning": { keyword: "황금 돼지가 품 안으로 뛰어드는 꿈 횡재수", metaTitle: "황금 돼지가 품 안으로 뛰어드는 꿈 해몽 | 역대급 횡재 무운" },
  "golden-snake-dream-meaning": { keyword: "황금 구렁이가 집 안으로 들어오는 꿈 재물운 태몽", metaTitle: "황금 구렁이 꿈 해몽 | 재물운과 태몽의 결정판 | 무운" },
  "golden-snake-dream-meaning-2": { keyword: "황금 구렁이가 집 안으로 들어오는 꿈 재물운 태몽", metaTitle: "황금 구렁이 꿈 해몽 | 재물운과 태몽의 결정판 | 무운" },
  "golden-toad-entering-house-dream": { keyword: "황금 두꺼비가 집 안으로 들어오는 꿈 해몽", metaTitle: "황금 두꺼비 꿈 해몽 | 재물운 폭발과 태몽 | 무운" },
  "golden-toad-entering-house-dream-2": { keyword: "황금 두꺼비가 집안으로 기어 들어오는 꿈", metaTitle: "황금 두꺼비 꿈 해몽 | 집안의 번영과 재물의 보존 | 무운" },
  "golden-toad-entering-house-dream-3": { keyword: "황금 두꺼비가 집안으로 기어 들어오는 꿈", metaTitle: "황금 두꺼비 꿈 해몽 | 집안의 번영과 재물의 보존 | 무운" },
  "golden-turtle-entering-house-dream": { keyword: "황금 옷을 입은 거북이가 집으로 들어오는 꿈", metaTitle: "황금 거북이 꿈 해몽 | 장수와 막대한 재물운 | 무운" },
  "golden-turtle-entering-house-dream-2": { keyword: "황금빛 거북이가 집으로 들어오는 꿈", metaTitle: "황금 거북이가 집으로 들어오는 꿈 해몽 | 재물운 폭발 | 무운" },
  "golden-turtle-entering-house-dream-3": { keyword: "황금빛 거북이가 집으로 들어오는 꿈", metaTitle: "황금 거북이가 집으로 들어오는 꿈 해몽 | 재물운 폭발 | 무운" },
  "golden-turtle-laying-eggs-dream": { keyword: "집 마당에 거대한 금 거북이가 알을 낳는 꿈", metaTitle: "금 거북이 알 낳는 꿈 해몽 | 재산 증식과 가문의 번영 | 무운" },
  "golden-turtle-laying-eggs-dream-2": { keyword: "집 마당에 거대한 금 거북이가 알을 낳는 꿈", metaTitle: "금 거북이 알 낳는 꿈 해몽 | 재산 증식과 가문의 번영 | 무운" },
  "goldfish-in-silk-net-dream": { keyword: "비단실로 짠 그물에 금붕어가 가득 걸리는 꿈", metaTitle: "금붕어 그물 꿈 해몽 | 횡재수와 투자 성공의 상징 | 무운" },
  "goldfish-in-silk-net-dream-2": { keyword: "비단실로 짠 그물에 금붕어가 가득 걸리는 꿈", metaTitle: "금붕어 그물 꿈 해몽 | 횡재수와 투자 성공의 상징 | 무운" },
  "growing-tall-dream-meaning": { keyword: "키가 갑자기 커지는 꿈 해석", metaTitle: "키가 커지는 꿈 해몽 신분 상승과 성공의 징조 | 무운" },
  "hair-cutting-nightmare-meaning": { keyword: "날카로운 가위에 머리카락이 듬성듬성 잘리는 꿈", metaTitle: "머리카락 잘리는 꿈 해몽 | 명예 실추와 이별 징조 | 무운 사주" },
  "hair-loss-bald-dream-meaning": { keyword: "머리가 모두 빠져 대머리가 되거나 원형 탈모가 심하게 생기는 꿈", metaTitle: "머리 빠지는 꿈 해몽 | 권위 실추와 자존감 하락 | 무운" },
  "harvesting-barley-field-dream": { keyword: "넓은 들판에서 황금빛 보리 이삭을 수확하는 꿈", metaTitle: "보리 수확하는 꿈 해몽 | 재물운과 노력의 결실 | 무운" },
  "harvesting-barley-field-dream-2": { keyword: "넓은 들판에서 황금빛 보리 이삭을 수확하는 꿈", metaTitle: "보리 수확하는 꿈 해몽 | 재물운과 노력의 결실 | 무운" },
  "harvesting-golden-field-dream": { keyword: "황금 벌판에서 풍성한 수확을 하는 꿈 결실", metaTitle: "황금 벌판 수확 꿈 해몽 | 노력의 결실과 풍요로운 재물 무운" },
  "harvesting-golden-rice-dream": { keyword: "황금 벌판의 벼를 수확하는 꿈", metaTitle: "황금 벼 수확하는 꿈 해몽 | 노력의 결실과 풍요 | 무운" },
  "heart-beating-outside-body-dream": { keyword: "심장이 밖으로 나와 뛰는 꿈 열정 생명력 성공", metaTitle: "심장이 밖으로 나와 뛰는 꿈 해몽 | 열정과 성공 | 무운" },
  "heavy-snowfall-dream-meaning": { keyword: "밤새도록 함박눈이 내리는 꿈 해몽", metaTitle: "함박눈 내리는 꿈 해몽 | 풍요와 정화의 시작 | 무운" },
  "home-intruder-nightmare-meaning": { keyword: "낯선 사람이 우리 집에 무단 침입하여 물건을 부수는 꿈", metaTitle: "집에 침입자가 든 꿈 해몽 | 경계 침범과 배신 징조 | 무운 사주" },
  "hot-air-balloon-with-crush-dream": { keyword: "짝사랑과 열기구 타는 꿈 하늘 데이트 꿈", metaTitle: "짝사랑과 열기구 타는 꿈 해몽 | 비상하는 성공과 명예운 | 무운" },
  "house-collapsing-nightmare-meaning": { keyword: "집안의 기둥이 썩어 무너지고 지붕이 내려앉는 꿈", metaTitle: "집이 무너지는 꿈 해몽 | 가정의 위기와 경제적 파산 | 무운 사주" },
  "house-on-fire-dream-2": { keyword: "집에 불이 나는 꿈 화재 꿈", metaTitle: "집에 불이 나는 꿈 해몽 | 대박 길몽의 징조 | 무운" },
  "invited-to-palace-dream": { keyword: "화려한 궁궐이나 저택에 초대받는 꿈", metaTitle: "궁궐에 초대받는 꿈 해몽 | 신분 상승과 귀인 | 무운" },
  "jujube-tree-full-of-fruits-dream": { keyword: "마당에 대추나무가 주렁주렁 열매 맺은 꿈", metaTitle: "대추나무 열매 맺는 꿈 해몽 | 태몽과 집안의 번영 | 무운" },
  "jujube-tree-full-of-fruits-dream-2": { keyword: "마당에 대추나무가 주렁주렁 열매 맺은 꿈", metaTitle: "대추나무 열매 맺는 꿈 해몽 | 태몽과 집안의 번영 | 무운" },
  "king-of-palace-dream-meaning": { keyword: "화려한 궁궐의 주인이 되어 앉아있는 꿈", metaTitle: "궁궐 주인이 되는 꿈 해몽 | 최고 권위와 막대한 부귀 | 무운" },
  "king-of-palace-dream-meaning-2": { keyword: "화려한 궁궐의 주인이 되어 앉아있는 꿈", metaTitle: "궁궐 주인이 되는 꿈 해몽 | 최고 권위와 막대한 부귀 | 무운" },
  "koi-fish-jumping-dream-meaning": { keyword: "화려한 비단잉어가 연못에서 튀어 오르는 꿈", metaTitle: "비단잉어가 튀어 오르는 꿈 해몽 | 도약과 대박의 징조 | 무운" },
  "koi-fish-swimming-upstream-dream": { keyword: "화려한 비단잉어들이 강물을 거슬러 올라가는 꿈", metaTitle: "잉어가 강물 거스르는 꿈 해몽 | 역경 극복과 대성공 | 무운" },
  "lantern-festival-dream-meaning": { keyword: "화려한 등불이 밤거리를 밝히는 축제를 보는 꿈", metaTitle: "등불 축제 보는 꿈 해몽 | 가문의 경사와 희망 | 무운" },
  "lantern-festival-dream-meaning-2": { keyword: "화려한 등불이 밤거리를 밝히는 축제를 보는 꿈", metaTitle: "등불 축제 보는 꿈 해몽 | 가문의 경사와 희망 | 무운" },
  "library-full-books-dream": { keyword: "서재에 책이 가득 쌓여 있는 것을 보는 꿈", metaTitle: "서재에 책이 가득한 꿈 해몽 | 지혜와 합격운 | 무운" },
  "library-full-books-dream-2": { keyword: "서재에 책이 가득 쌓여 있는 것을 보는 꿈", metaTitle: "서재에 책이 가득한 꿈 해몽 | 지혜와 합격운 | 무운" },
  "lion-tiger-protecting-me-dream": { keyword: "사자나 호랑이가 나를 지켜주는 꿈 해몽", metaTitle: "사자 호랑이가 지켜주는 꿈 해몽 | 권세와 강력한 조력자 | 무운" },
  "living-corpse-nightmare-meaning": { keyword: "시체가 살아나 나를 쫓아오거나 방 안에 시체가 가득한 꿈", metaTitle: "시체가 쫓아오는 꿈 해몽 | 과거의 역습과 죄책감 | 무운" },
  "long-beautiful-fingernails-dream": { keyword: "손톱이 길고 예쁘게 자라는 꿈 재주 재물 성공", metaTitle: "손톱이 길고 예쁘게 자라는 꿈 해몽 | 재능과 재물 | 무운" },
  "long-fingers-rings-dream": { keyword: "손가락이 길어지고 예쁜 반지를 가득 끼는 꿈", metaTitle: "손가락 반지 꿈 해몽 | 재능의 발견과 부귀영화 | 무운 메타 설명: 손가락이 길어지고 반지를 끼는 꿈은 신분 상승과 재물의 상징입니다. 당신의 재능이 빛날 순간을 지금 확인하세요." },
  "long-nails-dream-meaning": { keyword: "손톱이 길고 깨끗해지는 꿈 재능", metaTitle: "손톱이 길어지는 꿈 해몽 재능 발휘와 재물운 | 무운" },
  "long-shiny-hair-to-toes-dream-meaning": { keyword: "머리카락이 발끝까지 길고 윤기가 흐르는 꿈", metaTitle: "머리카락이 발끝까지 길고 윤기가 흐르는 꿈 꿈해몽 | 무운" },
  "long-shiny-hair-to-toes-dream-meaning-2": { keyword: "머리카락이 발끝까지 길고 윤기가 흐르는 꿈", metaTitle: "머리카락이 발끝까지 길고 윤기가 흐르는 꿈 꿈해몽 | 무운" },
  "looking-at-mirror-pretty-dream": { keyword: "거울 속의 내 모습이 평소보다 예뻐 보이는 꿈", metaTitle: "거울 속 내가 예뻐 보이는 꿈 해몽 | 자존감 상승과 인기운 | 무운" },
  "looking-at-mirror-pretty-dream-2": { keyword: "거울 속의 내 모습이 평소보다 예뻐 보이는 꿈", metaTitle: "거울 속 내가 예뻐 보이는 꿈 해몽 | 자존감 상승과 인기운 | 무운" },
  "looking-at-stars-with-opposite-sex": { keyword: "이성과 밤하늘 별 보는 꿈 별똥별 데이트 꿈", metaTitle: "이성과 별 보는 꿈 해몽 | 기적 같은 소원 성취와 명예 | 무운" },
  "looking-at-the-sea-with-lover": { keyword: "연인과 함께 바다를 보는 꿈 해변 데이트 꿈", metaTitle: "연인과 바다 보는 꿈 해몽 | 재물운의 폭발과 평화 | 무운" },
  "looking-down-from-rooftop-dream": { keyword: "높은 빌딩 옥상에서 시내를 내려다보는 꿈", metaTitle: "옥상에서 내려다보는 꿈 해몽 | 지위 상승과 넓은 안목 | 무운" },
  "looking-down-from-rooftop-dream-2": { keyword: "높은 빌딩 옥상에서 시내를 내려다보는 꿈", metaTitle: "옥상에서 내려다보는 꿈 해몽 | 지위 상승과 넓은 안목 | 무운" },
  "looking-in-mirror-with-lover": { keyword: "연인과 함께 거울을 보는 꿈 나란히 거울 보는 꿈", metaTitle: "연인과 거울 보는 꿈 해몽 | 진실한 사랑과 계약의 성사 | 무운" },
  "looking-into-clear-well-dream": { keyword: "맑은 우물물에 얼굴을 비추어 보는 꿈", metaTitle: "맑은 우물 꿈 해몽 | 지혜와 마음의 평화 | 무운" },
  "looking-into-clear-well-dream-2": { keyword: "맑은 우물물에 얼굴을 비추어 보는 꿈", metaTitle: "맑은 우물 꿈 해몽 | 지혜와 마음의 평화 | 무운" },
  "looking-into-well-with-stranger": { keyword: "모르는 이성과 우물 보는 꿈 깊은 물 데이트", metaTitle: "모르는 이성과 우물 보는 꿈 해몽 | 마르지 않는 재물과 지혜 | 무운" },
  "losing-shoes-dream-meaning-2": { keyword: "신발 잃어버리는 꿈 새 신발 사는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 | 새 신발 신는 꿈 | 무운" },
  "losing-shoes-walking-barefoot": { keyword: "신발을 잃어버리고 맨발로 걷는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 | 기반 상실과 방황 | 무운" },
  "losing-shoes-walking-barefoot-2": { keyword: "신발을 잃어버리고 맨발로 걷는 꿈", metaTitle: "신발 잃어버리는 꿈 해몽 | 기반 상실과 방황 | 무운" },
  "lost-burned-belongings-dream": { keyword: "아끼던 옷이나 물건이 불타서 재만 남거나 잃어버리는 꿈", metaTitle: "아끼던 물건이 불타거나 잃어버린 꿈 해몽 | 상실과 변화 | 무운 사주" },
  "lost-in-foggy-mountain-dream": { keyword: "깊은 산속에서 길을 잃고 끝없는 안개 속을 헤매는 꿈", metaTitle: "안개 낀 산에서 길 잃는 꿈 해몽 | 판단력 상실과 사기 경고 | 무운" },
  "lotus-blooming-in-mud-dream": { keyword: "화려한 연꽃이 진흙탕 속에서 피어오르는 꿈", metaTitle: "연꽃 피는 꿈 해몽 | 고난 극복과 신분 상승 | 무운" },
  "lotus-blooming-in-mud-dream-2": { keyword: "화려한 연꽃이 진흙탕 속에서 피어오르는 꿈", metaTitle: "연꽃 피는 꿈 해몽 | 고난 극복과 신분 상승 | 무운" },
  "loud-clear-voice-dream-meaning": { keyword: "목소리가 우렁차고 멀리까지 울려 퍼지는 꿈", metaTitle: "목소리가 우렁차고 멀리까지 울려 퍼지는 꿈 꿈해몽 | 무운" },
  "loud-clear-voice-dream-meaning-2": { keyword: "목소리가 우렁차고 멀리까지 울려 퍼지는 꿈", metaTitle: "목소리가 우렁차고 멀리까지 울려 퍼지는 꿈 꿈해몽 | 무운" },
  "loud-voice-dream-meaning": { keyword: "목소리가 우렁차게 나오는 꿈 권세", metaTitle: "목소리가 우렁찬 꿈 해몽 영향력 확대와 명예 | 무운" },
  "marching-with-flag-dream": { keyword: "화려한 깃발을 들고 행진하는 꿈 해몽", metaTitle: "깃발 들고 행진하는 꿈 해몽 | 승리와 리더십의 상징 | 무운" },
  "meeting-president-celebrity-dream": { keyword: "대통령 만나는 꿈 유명인 꿈", metaTitle: "대통령 만나는 꿈 해몽 | 명예운과 당첨운 | 무운" },
  "meeting-white-deer-in-forest-dream": { keyword: "숲속에서 흰 사슴을 만나는 꿈 귀인 상봉", metaTitle: "숲속에서 흰 사슴을 만나는 꿈 해몽 | 평화와 귀인의 상징 무운" },
  "money-in-desk-drawer-dream": { keyword: "책상 서랍 속에 돈이 가지런히 정리되어 있는 꿈", metaTitle: "서랍 속 돈 꿈 해몽 | 계획적인 재물운과 소박한 횡재 | 무운" },
  "money-in-desk-drawer-dream-2": { keyword: "책상 서랍 속에 돈이 가지런히 정리되어 있는 꿈", metaTitle: "서랍 속 돈 꿈 해몽 | 계획적인 재물운과 소박한 횡재 | 무운" },
  "mountain-climbing-with-lover-dream": { keyword: "연인과 산에 오르는 꿈 등산 데이트 꿈", metaTitle: "연인과 산에 오르는 꿈 해몽 | 신분 상승과 공동의 성공 | 무운" },
  "mountain-top-shouting-dream": { keyword: "산 정상에 올라 호령하는 꿈", metaTitle: "산 정상에 오르는 꿈 해몽 | 승리와 권위의 상징 | 무운" },
  "moving-to-new-large-house-dream": { keyword: "넓고 깨끗한 새 집으로 이사하는 꿈", metaTitle: "새 집으로 이사하는 꿈 해몽 | 신분 상승과 변화 | 무운" },
  "multiple-heads-dream-meaning": { keyword: "머리가 여러 개 생기는 꿈 승진 권력 성공", metaTitle: "머리가 여러 개 생기는 꿈 해몽 | 권력과 다재다능 | 무운" },
  "name-on-golden-scroll-dream": { keyword: "황금 두루마리에 이름이 적혀있는 꿈", metaTitle: "황금 두루마리 이름 꿈 해몽 | 명예로운 부와 확정적 성공 | 무운" },
  "name-on-golden-scroll-dream-2": { keyword: "황금 두루마리에 이름이 적혀있는 꿈", metaTitle: "황금 두루마리 이름 꿈 해몽 | 명예로운 부와 확정적 성공 | 무운" },
  "new-teeth-dream-meaning": { keyword: "이가 새로 나는 꿈 변화", metaTitle: "이가 새로 나는 꿈 해몽 가문의 번창과 새로운 시작 | 무운" },
  "new-teeth-growing-dream-meaning": { keyword: "빠진 이빨이 다시 나는 꿈 건강 회복 성공", metaTitle: "빠진 이빨이 다시 나는 꿈 해몽 | 건강 회복과 성공 | 무운" },
  "old-face-skeleton-mirror-dream": { keyword: "거울 속의 내가 늙어 보이거나 해골처럼 변해 보이는 꿈", metaTitle: "거울 속 해골 꿈 해몽 | 기력 소진과 우울증 경고 | 무운" },
  "on-the-roof-with-stranger-dream": { keyword: "모르는 이성과 지붕 위에 있는 꿈 옥상 데이트 꿈", metaTitle: "모르는 이성과 지붕 위에 있는 꿈 해몽 | 권위와 신분 상승 | 무운" },
  "opening-door-golden-key-dream": { keyword: "황금 열쇠로 굳게 닫힌 문을 여는 꿈", metaTitle: "황금 열쇠로 문 여는 꿈 해몽 | 해결과 돌파구 | 무운" },
  "opening-door-golden-key-dream-2": { keyword: "황금 열쇠로 굳게 닫힌 문을 여는 꿈", metaTitle: "황금 열쇠로 문 여는 꿈 해몽 | 해결과 돌파구 | 무운" },
  "opening-eyes-dream-meaning": { keyword: "눈이 멀었다가 다시 뜨이는 꿈 개안 진리 통찰", metaTitle: "눈이 멀었다가 다시 뜨는 꿈 해몽 | 통찰과 반전 | 무운" },
  "palace-gate-opening-dream-meaning": { keyword: "웅장한 궁궐의 문이 저절로 열리는 꿈 기회 도래", metaTitle: "궁궐 문이 저절로 열리는 꿈 해몽 | 기회 포착과 신분 상승 무운" },
  "palace-silk-bedding-dream-meaning": { keyword: "화려한 궁궐에서 비단 침구에 눕는 꿈", metaTitle: "궁궐 비단 침구 꿈 해몽 | 안락한 삶과 신분 상승 | 무운" },
  "peacock-feather-fan-dream": { keyword: "화려한 공작 깃털로 만든 부채를 손에 쥐는 꿈", metaTitle: "공작 부채 꿈 해몽 | 품격 있는 성공과 명예 재물 | 무운" },
  "peacock-feather-fan-dream-2": { keyword: "화려한 공작 깃털로 만든 부채를 손에 쥐는 꿈", metaTitle: "공작 부채 꿈 해몽 | 품격 있는 성공과 명예 재물 | 무운" },
  "peacock-spreading-wings-dream-2": { keyword: "화려한 공작새가 날개를 활짝 펴는 꿈", metaTitle: "공작새 날개 펴는 꿈 해몽 | 명예와 태몽 | 무운" },
  "peacock-spreading-wings-dream-3": { keyword: "화려한 공작새가 날개를 활짝 펴는 꿈", metaTitle: "공작새 날개 펴는 꿈 해몽 | 부귀영화와 신분 상승 | 무운" },
  "peacock-spreading-wings-dream-4": { keyword: "화려한 공작새가 날개를 활짝 펴는 꿈", metaTitle: "공작새 날개 펴는 꿈 해몽 | 명예와 태몽 | 무운" },
  "peacock-spreading-wings-dream-5": { keyword: "화려한 공작새가 날개를 활짝 펴는 꿈", metaTitle: "공작새 날개 펴는 꿈 해몽 | 부귀영화와 신분 상승 | 무운" },
  "performing-with-celebrity-dream": { keyword: "연예인과 함께 무대에 서거나 공연하는 꿈", metaTitle: "연예인과 무대에 서는 꿈 해몽 | 재능 발휘와 명성 | 무운" },
  "phoenix-landing-dream-meaning": { keyword: "화려한 봉황이 하늘에서 내려와 앉는 꿈", metaTitle: "봉황 꿈 해몽 | 명예의 정점과 대업 성취 | 무운" },
  "picking-flower-in-forest-dream": { keyword: "숲속에서 예쁜 꽃 한 송이를 꺾는 꿈", metaTitle: "꽃 꺾는 꿈 해몽 | 명예운과 연애운의 상승 | 무운" },
  "picking-flower-in-forest-dream-2": { keyword: "숲속에서 예쁜 꽃 한 송이를 꺾는 꿈", metaTitle: "꽃 꺾는 꿈 해몽 | 명예운과 연애운의 상승 | 무운" },
  "picking-jewels-with-lover-dream": { keyword: "연인과 함께 눈부신 보석 고르는 꿈 보석함 데이트", metaTitle: "연인과 보석 고르는 꿈 해몽 | 불변의 명예와 재물운 | 무운" },
  "picking-pebbles-in-clear-water-dream": { keyword: "맑은 물속에서 반짝이는 조약돌을 줍는 꿈", metaTitle: "맑은 물 조약돌 꿈 해몽 | 알찬 재물과 성취 | 무운" },
  "picking-silk-with-lover-dream": { keyword: "연인과 함께 비단을 고르는 꿈 옷감 데이트 꿈", metaTitle: "연인과 비단 고르는 꿈 해몽 | 부귀영화와 명예의 상징 | 무운" },
  "picking-up-gold-jewels-dream": { keyword: "금괴나 보석을 가득 줍는 꿈", metaTitle: "금괴 줍는 꿈 해몽 | 횡재수가 찾아오는 징조 | 무운" },
  "picking-up-money-dream": { keyword: "돈 줍는 꿈 돈 받는 꿈", metaTitle: "돈 줍는 꿈 해몽 | 지폐 동전 꿈의 비밀 | 무운" },
  "picking-up-money-dream-2": { keyword: "돈 줍는 꿈 돈 받는 꿈", metaTitle: "돈 줍는 꿈 해몽 | 지폐 동전 꿈의 비밀 | 무운" },
  "plane-crash-ship-sinking-dream": { keyword: "비행기나 배가 공중 폭발하거나 침몰하는 현장을 목격하는 꿈", metaTitle: "비행기 폭발 배 침몰 꿈 해몽 | 조직의 붕괴와 외부 악재 | 무운" },
  "planting-trees-with-lover-dream": { keyword: "연인과 함께 나무 심는 꿈 묘목 식재 데이트", metaTitle: "연인과 나무 심는 꿈 해몽 | 자손 번창과 영원한 부 | 무운" },
  "playing-with-child-dream-2": { keyword: "낯선 아이와 웃으며 노는 꿈", metaTitle: "아이와 노는 꿈 해몽 | 새로운 시작과 대인관계의 즐거움 | 무운" },
  "pouch-full-of-dragon-pearls-dream": { keyword: "비단 주머니 속에 영롱한 여의주가 가득한 꿈", metaTitle: "여의주 주머니 꿈 해몽 | 만사형통과 무한한 재물운 | 무운" },
  "pouch-full-of-dragon-pearls-dream-2": { keyword: "비단 주머니 속에 영롱한 여의주가 가득한 꿈", metaTitle: "여의주 주머니 꿈 해몽 | 만사형통과 무한한 재물운 | 무운" },
  "racing-heart-dream-meaning": { keyword: "가슴이 벅차오르며 심장이 힘차게 뛰는 꿈", metaTitle: "심장 뛰는 꿈 해몽 | 설레는 인연과 새로운 열정 | 무운 메타 설명: 가슴 벅찬 심장 소리를 들은 꿈은 인생의 큰 전환점과 연애운을 상징합니다. 당신의 가슴 설레는 미래를 지금 확인하세요." },
  "rain-dating-dream-meaning": { keyword: "연인과 비 맞는 꿈 빗속의 데이트 꿈", metaTitle: "연인과 비 맞는 꿈 해몽 | 감성 치유와 풍요의 징조 | 무운" },
  "rainbow-after-rain-dream-2": { keyword: "비가 온 뒤 무지개가 선명하게 뜨는 꿈", metaTitle: "비 온 뒤 무지개 꿈 해몽 | 고난 극복과 새로운 희망 | 무운" },
  "rainbow-after-rain-dream-meaning": { keyword: "비가 그친 뒤 하늘에 선명한 무지개가 뜨는 꿈", metaTitle: "비 온 뒤 무지개 뜨는 꿈 해몽 | 희망과 화해의 징조 | 무운" },
  "rainbow-after-rain-dream-meaning-2": { keyword: "비가 그친 뒤 하늘에 선명한 무지개가 뜨는 꿈", metaTitle: "비 온 뒤 무지개 뜨는 꿈 해몽 | 희망과 화해의 징조 | 무운" },
  "rainbow-connecting-to-home-dream": { keyword: "하늘에서 오색 무지개가 내 집으로 걸린 꿈 경사", metaTitle: "오색 무지개가 집으로 걸린 꿈 해몽 | 가문의 영광과 축복 무운" },
  "rainbow-in-clear-sky-dream": { keyword: "맑은 하늘에 무지개가 뜨는 꿈 해몽", metaTitle: "맑은 하늘 무지개 꿈 해몽 | 기적 같은 소원 성취 | 무운" },
  "receiving-book-from-old-man-dream": { keyword: "흰 수염 노인에게 책을 받는 꿈 지혜 전수", metaTitle: "흰 수염 노인에게 책을 받는 꿈 해몽 | 합격과 지혜의 상징 무운" },
  "receiving-dragon-seal-dream": { keyword: "하늘에서 용무늬 도장을 받는 꿈", metaTitle: "용무늬 도장 꿈 해몽 | 권위와 합격의 상징 | 무운" },
  "receiving-golden-key-dream": { keyword: "황금 열쇠를 받는 꿈 기회 포착", metaTitle: "황금 열쇠를 받는 꿈 해몽 | 성공의 문이 열리는 징조 무운" },
  "receiving-love-letter-dream-meaning": { keyword: "연인에게 편지 받는 꿈 사랑의 고백 편지 꿈", metaTitle: "연인에게 편지 받는 꿈 해몽 | 반가운 소식과 재물운 | 무운" },
  "receiving-meal-stranger-house": { keyword: "낯선 집에서 정성스럽게 차려진 밥상을 받는 꿈", metaTitle: "낯선 집 밥상 받는 꿈 해몽 | 귀인의 도움과 환대 | 무운" },
  "receiving-meal-stranger-house-2": { keyword: "낯선 집에서 정성스럽게 차려진 밥상을 받는 꿈", metaTitle: "낯선 집 밥상 받는 꿈 해몽 | 귀인의 도움과 환대 | 무운" },
  "riding-a-giant-turtle-dream": { keyword: "큰 거북이를 타는 꿈 장수와 안정", metaTitle: "큰 거북이를 타는 꿈 해몽 | 부귀영화와 장수의 상징 무운" },
  "riding-a-tiger-dream-meaning": { keyword: "호랑이가 나를 등에 태우고 달리는 꿈", metaTitle: "호랑이 타는 꿈 해몽 | 권력과 명예의 정점 | 무운" },
  "riding-a-whale-in-ocean-dream": { keyword: "바다에서 고래를 타고 항해하는 꿈 야망 달성", metaTitle: "고래를 타고 바다를 나는 꿈 해몽 | 야망 성취와 대운 무운" },
  "riding-bicycle-with-lover-dream": { keyword: "연인과 함께 자전거 타는 꿈 커플 라이딩 꿈", metaTitle: "연인과 자전거 타는 꿈 해몽 | 완벽한 호흡과 성공의 질주 | 무운" },
  "riding-turtle-across-ocean-dream": { keyword: "거북이를 타고 바다를 건너는 꿈", metaTitle: "거북이 타고 바다 건너는 꿈 | 귀인의 도움과 성공 | 무운" },
  "riding-white-horse-in-village-dream": { keyword: "눈부신 백마를 타고 마을을 누비는 꿈", metaTitle: "백마 타는 꿈 해몽 | 명예의 정점과 금의환향 | 무운" },
  "riding-winged-horse-dream": { keyword: "날개 달린 말을 타고 하늘을 나는 꿈 해몽", metaTitle: "날개 달린 말 꿈 해몽 | 초월적 성공과 비상 | 무운" },
  "ripened-grain-field-dream": { keyword: "넓은 들판에 곡식이 노랗게 익어가는 꿈", metaTitle: "곡식 익는 꿈 해몽 | 노력의 결실과 안정적 재물운 | 무운" },
  "ripened-grain-field-dream-2": { keyword: "넓은 들판에 곡식이 노랗게 익어가는 꿈", metaTitle: "곡식 익는 꿈 해몽 | 노력의 결실과 안정적 재물운 | 무운" },
  "rock-turning-into-jewel-dream": { keyword: "커다란 바위가 보석으로 변하는 꿈 자산 증식", metaTitle: "바위가 보석으로 변하는 꿈 해몽 | 가치 상승과 인생 역전 무운" },
  "rotten-feast-food-dream": { keyword: "잔칫집에 갔는데 음식이 모두 썩어 있고 악취가 진동하는 꿈", metaTitle: "잔칫집 음식이 썩은 꿈 해몽 | 사기와 계약 파기 경고 | 무운" },
  "rowing-boat-under-milkyway": { keyword: "은하수 아래에서 나룻배를 타고 건너가는 꿈", metaTitle: "은하수 아래 배 타는 꿈 해몽 | 순탄한 성공과 변화 | 무운" },
  "rowing-boat-under-milkyway-2": { keyword: "은하수 아래에서 나룻배를 타고 건너가는 꿈", metaTitle: "은하수 아래 배 타는 꿈 해몽 | 순탄한 성공과 변화 | 무운" },
  "royal-dance-performance-dream": { keyword: "화려한 궁중 무용을 관람하거나 직접 추는 꿈 해몽", metaTitle: "궁중 무용 꿈 해몽 | 명예와 경사의 시작 | 무운" },
  "running-fast-dream-meaning": { keyword: "다리에 힘이 넘치고 거침없이 달리는 꿈", metaTitle: "달리는 꿈 해몽 | 거침없는 추진력과 목표 달성 | 무운 메타 설명: 다리에 힘이 실려 달리는 꿈은 막힌 운세가 뚫리는 예지몽입니다. 당신의 빠른 성공을 위한 행동 지침을 확인하세요." },
  "sailing-large-ship-ocean-dream": { keyword: "큰 배를 타고 대양을 항해하는 꿈", metaTitle: "큰 배 타고 항해하는 꿈 해몽 | 대업 성공과 해외 진출 | 무운" },
  "sharing-umbrella-with-crush-dream": { keyword: "짝사랑과 우산 같이 쓰는 꿈 빗속의 우산 데이트", metaTitle: "짝사랑과 우산 쓰는 꿈 해몽 | 조력자의 등장과 사랑 | 무운" },
  "shining-face-dream-meaning": { keyword: "얼굴에서 빛이 나는 꿈 명성", metaTitle: "얼굴에서 빛이 나는 꿈 해몽 명예와 연애운의 상승 | 무운" },
  "shining-light-floating-dream-meaning": { keyword: "온몸에 서광(瑞光)이 비치며 공중에 떠 있는 꿈", metaTitle: "온몸에 서광(瑞光)이 비치며 공중에 떠 있는 꿈 꿈해몽 | 무운" },
  "shining-light-floating-dream-meaning-2": { keyword: "온몸에 서광(瑞光)이 비치며 공중에 떠 있는 꿈", metaTitle: "온몸에 서광(瑞光)이 비치며 공중에 떠 있는 꿈 꿈해몽 | 무운" },
  "shining-reflection-in-mirror-dream-meaning": { keyword: "거울 속의 내 모습이 빛나는 꿈", metaTitle: "거울 속의 내 모습이 빛나는 꿈 꿈해몽 | 무운" },
  "shining-reflection-in-mirror-dream-meaning-2": { keyword: "거울 속의 내 모습이 빛나는 꿈", metaTitle: "거울 속의 내 모습이 빛나는 꿈 꿈해몽 | 무운" },
  "shiny-scented-hair-dream": { keyword: "머리카락에서 향기가 나고 찰랑거리며 빛나는 꿈", metaTitle: "빛나는 머리카락 꿈 해몽 | 인기와 명예 회복의 길몽 | 무운 메타 설명: 윤기 나고 향기로운 머리카락 꿈은 매력 상승과 문제 해결을 뜻합니다. 당신의 명예가 빛날 오늘, 상세 해석을 확인하세요." },
  "shouting-at-mountain-top-dream": { keyword: "높은 산 정상에서 야호 외치는 꿈 소원 성취", metaTitle: "산 정상에서 야호 외치는 꿈 해몽 | 성공과 명예의 정점 무운" },
  "shouting-on-mountain-top-dream": { keyword: "높은 산 정상에서 큰 소리로 야호 외치는 꿈", metaTitle: "산 정상에서 소리 지르는 꿈 해몽 | 성공과 스트레스 해소 | 무운" },
  "shouting-on-mountain-top-dream-2": { keyword: "높은 산 정상에서 큰 소리로 야호 외치는 꿈", metaTitle: "산 정상에서 소리 지르는 꿈 해몽 | 성공과 스트레스 해소 | 무운" },
  "sick-celebrity-dream-meaning": { keyword: "연예인이 병들고 초라한 모습으로 나타난 꿈", metaTitle: "병든 연예인 꿈 해몽 | 건강 악화와 가치관의 붕괴 | 무운" },
  "sick-celebrity-dream-meaning-2": { keyword: "연예인이 병들고 초라한 모습으로 나타난 꿈", metaTitle: "병든 연예인 꿈 해몽 | 건강 악화와 가치관의 붕괴 | 무운" },
  "silk-clothes-gold-carriage-dream": { keyword: "비단옷을 입고 금마차를 타는 꿈", metaTitle: "비단옷과 금마차 꿈 해몽 | 신분 상승과 부귀영화 | 무운" },
  "silk-clothes-gold-carriage-dream-2": { keyword: "비단옷을 입고 금마차를 타는 꿈", metaTitle: "비단옷과 금마차 꿈 해몽 | 신분 상승과 부귀영화 | 무운" },
  "silk-falling-from-sky-dream": { keyword: "하늘에서 오색찬란한 비단이 쏟아져 내리는 꿈", metaTitle: "하늘에서 비단이 쏟아지는 꿈 해몽 | 부귀영화와 천운 | 무운" },
  "silk-falling-from-sky-dream-2": { keyword: "하늘에서 오색찬란한 비단이 쏟아져 내리는 꿈", metaTitle: "하늘에서 비단이 쏟아지는 꿈 해몽 | 부귀영화와 천운 | 무운" },
  "silver-fish-clear-water-dream": { keyword: "맑은 계곡물에서 은빛 물고기를 잡는 꿈", metaTitle: "맑은 물에서 은빛 물고기 잡는 꿈 해몽 | 재물운과 태몽 | 무운" },
  "silver-fish-clear-water-dream-2": { keyword: "맑은 계곡물에서 은빛 물고기를 잡는 꿈", metaTitle: "맑은 물에서 은빛 물고기 잡는 꿈 해몽 | 재물운과 태몽 | 무운" },
  "singer-singing-dream-meaning": { keyword: "유명한 가수가 노래하는 것을 듣는 꿈", metaTitle: "유명 가수가 노래하는 꿈 해몽 | 마음의 평화와 성공 | 무운" },
  "sinking-swamp-dream-meaning": { keyword: "깊은 늪에 빠져 몸이 점점 가라앉으며 허우적거리는 꿈", metaTitle: "늪에 빠지는 꿈 해몽 | 고립과 정체의 의미 | 무운 사주" },
  "smelly-celebrity-dream-meaning": { keyword: "연예인의 몸에서 악취가 나는 꿈", metaTitle: "연예인에게 악취가 나는 꿈 해몽 | 비리와 환멸 | 무운" },
  "smelly-celebrity-dream-meaning-2": { keyword: "연예인의 몸에서 악취가 나는 꿈", metaTitle: "연예인에게 악취가 나는 꿈 해몽 | 비리와 환멸 | 무운" },
  "snake-bite-dream-meaning-2": { keyword: "뱀에게 물리는 꿈 뱀이 나오는 꿈", metaTitle: "뱀에게 물리는 꿈 해몽 | 재물운과 태몽 풀이 | 무운" },
  "snowy-day-dating-dream-meaning": { keyword: "연인과 함께 눈을 맞으며 걷는 꿈 설원 데이트 꿈", metaTitle: "연인과 눈 맞는 꿈 해몽 | 순수한 사랑과 재물의 축복 | 무운" },
  "snowy-landscape-dream-meaning": { keyword: "깨끗한 흰 눈이 온 세상을 덮은 풍경을 보는 꿈", metaTitle: "흰 눈 덮인 풍경 꿈 해몽 | 정화와 순수한 시작 | 무운" },
  "snowy-landscape-dream-meaning-2": { keyword: "깨끗한 흰 눈이 온 세상을 덮은 풍경을 보는 꿈", metaTitle: "흰 눈 덮인 풍경 꿈 해몽 | 정화와 순수한 시작 | 무운" },
  "sparkling-gemlike-eyes-dream-meaning": { keyword: "눈동자가 보석처럼 영롱하게 빛나는 꿈", metaTitle: "눈동자가 보석처럼 영롱하게 빛나는 꿈 꿈해몽 | 무운" },
  "sparkling-gemlike-eyes-dream-meaning-2": { keyword: "눈동자가 보석처럼 영롱하게 빛나는 꿈", metaTitle: "눈동자가 보석처럼 영롱하게 빛나는 꿈 꿈해몽 | 무운" },
  "spitting-out-jewels-dream": { keyword: "입에서 보석을 토해내는 꿈 횡재 언변 성공", metaTitle: "입에서 보석이 나오는 꿈 해몽 | 재물운과 언변 | 무운" },
  "sprouts-growing-from-palm-dream": { keyword: "손바닥에서 새싹이 돋아나는 꿈 창작 발전 재물", metaTitle: "손바닥에서 새싹이 돋는 꿈 해몽 | 창의성과 번영 | 무운" },
  "stabbed-no-blood-dream-meaning": { keyword: "날카로운 칼이나 흉기를 든 괴한에게 찔려 피가 나지 않는 꿈", metaTitle: "칼에 찔려도 피 안 나는 꿈 해몽 | 정신적 타격과 운기 정체 | 무운" },
  "star-falling-into-mouth-dream": { keyword: "밤하늘의 별이 내 입으로 떨어지는 꿈", metaTitle: "별이 떨어지는 꿈 해몽 | 하늘이 점지한 로또 꿈 | 무운" },
  "starry-night-sky-dream": { keyword: "밤하늘에 무수히 많은 별이 빛나는 꿈", metaTitle: "밤하늘 별 꿈 해몽 | 명예와 무한한 가능성 | 무운" },
  "stars-falling-onto-body-dream": { keyword: "밤하늘에 별이 내 몸으로 쏟아지는 꿈 천운", metaTitle: "별이 몸으로 쏟아지는 꿈 해몽 | 천운과 불멸의 명예 무운" },
  "straight-back-dream-meaning": { keyword: "등이 굽었다가 펴지는 꿈 해방", metaTitle: "굽은 등이 펴지는 꿈 해몽 고난 끝 행운의 시작 | 무운" },
  "stranger-holding-hands-dream": { keyword: "모르는 이성과 손잡는 꿈 낯선 사람과 손잡고 걷는 꿈", metaTitle: "모르는 이성과 손잡는 꿈 해몽 | 새로운 조력자와 계약운 | 무운" },
  "stranger-party-at-home-dream": { keyword: "집안에 낯선 사람들이 모여 잔치를 벌이는 꿈", metaTitle: "집안 잔치 꿈 해몽 | 대인관계 호전과 소소한 재물운 | 무운" },
  "stranger-party-at-home-dream-2": { keyword: "집안에 낯선 사람들이 모여 잔치를 벌이는 꿈", metaTitle: "집안 잔치 꿈 해몽 | 대인관계 호전과 소소한 재물운 | 무운" },
  "strong-legs-dream-meaning": { keyword: "다리가 튼튼해지는 꿈 실행력", metaTitle: "다리가 튼튼해지는 꿈 해몽 추진력과 성공 기반 | 무운" },
  "strong-thighs-dream-meaning": { keyword: "허벅지가 굵고 튼튼해지는 꿈 안정 기반 재력", metaTitle: "허벅지가 굵어지는 꿈 해몽 | 경제적 안정과 기반 | 무운" },
  "studying-with-crush-dream-meaning": { keyword: "짝사랑과 도서관에서 공부하는 꿈 도서관 데이트 꿈", metaTitle: "짝사랑과 도서관 공부하는 꿈 해몽 | 학업 성취와 사랑 | 무운" },
  "suddenly-growing-taller-walking-on-clouds-dream-meaning": { keyword: "키가 갑자기 커져 구름 위를 걷는 꿈", metaTitle: "키가 갑자기 커져 구름 위를 걷는 꿈 꿈해몽 | 무운" },
  "suddenly-growing-taller-walking-on-clouds-dream-meaning-2": { keyword: "키가 갑자기 커져 구름 위를 걷는 꿈", metaTitle: "키가 갑자기 커져 구름 위를 걷는 꿈 꿈해몽 | 무운" },
  "sunrise-on-cliff-dream-meaning": { keyword: "높은 절벽 위에서 일출을 바라보는 꿈", metaTitle: "절벽 위 일출 꿈 해몽 | 성공과 합격의 징조 | 무운" },
  "sunrise-on-cliff-dream-meaning-2": { keyword: "높은 절벽 위에서 일출을 바라보는 꿈", metaTitle: "절벽 위 일출 꿈 해몽 | 성공과 합격의 징조 | 무운" },
  "sunrise-over-ocean-dream": { keyword: "바다 위로 거대한 태양이 솟아오르는 꿈 해몽", metaTitle: "바다 위 해돋이 꿈 해몽 | 인생 최고의 전성기 | 무운" },
  "surfing-giant-waves-dream": { keyword: "거대한 파도를 타고 서핑하는 꿈", metaTitle: "거대한 파도 서핑 꿈 해몽 | 위기를 기회로 바꾸는 힘 | 무운" },
  "swallowing-stars-dream-meaning": { keyword: "밤하늘의 별이 내 입속으로 떨어지는 꿈", metaTitle: "별을 삼키는 꿈 해몽 | 천재적인 영감과 거대 재물운 | 무운" },
  "swallowing-stars-dream-meaning-2": { keyword: "밤하늘의 별이 내 입속으로 떨어지는 꿈", metaTitle: "별을 삼키는 꿈 해몽 | 천재적인 영감과 거대 재물운 | 무운" },
  "swept-away-by-flood-dream": { keyword: "홍수에 떠내려가며 아무것도 붙잡지 못하고 허우적거리는 꿈", metaTitle: "홍수에 떠내려가는 꿈 해몽 | 통제력 상실과 재난 경고 | 무운" },
  "swimming-in-clear-water-dream": { keyword: "맑은 물에서 수영하는 꿈 고민 해결", metaTitle: "맑은 물에서 수영하는 꿈 해몽 | 걱정 끝 행복 시작 무운" },
  "taking-photos-with-lover-dream": { keyword: "연인과 함께 사진 찍는 꿈 커플 셀카 꿈", metaTitle: "연인과 사진 찍는 꿈 해몽 | 공식적인 인정과 명예운 | 무운" },
  "teeth-falling-out-dream": { keyword: "이빨 빠지는 꿈 치아 빠지는 꿈", metaTitle: "이빨 빠지는 꿈 해몽 | 위치별 상세 풀이 | 무운" },
  "teeth-falling-out-dream-2": { keyword: "이빨 빠지는 꿈 치아 빠지는 꿈", metaTitle: "이빨 빠지는 꿈 해몽 | 위치별 상세 풀이 | 무운" },
  "third-eye-forehead-dream-meaning": { keyword: "이마에 제3의 눈이 생겨 세상을 굽어보는 꿈", metaTitle: "이마에 제3의 눈이 생겨 세상을 굽어보는 꿈 꿈해몽 | 무운" },
  "third-eye-forehead-dream-meaning-2": { keyword: "이마에 제3의 눈이 생겨 세상을 굽어보는 꿈", metaTitle: "이마에 제3의 눈이 생겨 세상을 굽어보는 꿈 꿈해몽 | 무운" },
  "tiger-dream-meaning-power": { keyword: "호랑이 꿈 태몽 호랑이가 집으로 들어오는 꿈", metaTitle: "호랑이 꿈 해몽 | 권력과 태몽의 상징 | 무운" },
  "tiger-dream-meaning-power-2": { keyword: "호랑이 꿈 태몽 호랑이가 집으로 들어오는 꿈", metaTitle: "호랑이 꿈 해몽 | 권력과 태몽의 상징 | 무운" },
  "toe-injury-healing-dream": { keyword: "발가락을 다쳤는데 새 살이 돋아나는 꿈 위기 극복", metaTitle: "발가락 상처가 회복되는 꿈 해몽 | 위기를 기회로 무운" },
  "train-travel-with-lover-dream": { keyword: "연인과 함께 기차 여행하는 꿈 열차 데이트 꿈", metaTitle: "연인과 기차 여행하는 꿈 해몽 | 성공적인 여정과 명예운 | 무운" },
  "trapped-in-well-dream-meaning": { keyword: "깊은 우물 속에 빠져 나오려 해도 벽이 미끄러워 다시 추락하는 꿈", metaTitle: "우물에 빠져 못 나오는 꿈 해몽 | 고립과 장기적 침체 | 무운" },
  "traveling-with-celebrity-dream": { keyword: "연예인과 함께 여행을 떠나거나 비행기를 타는 꿈", metaTitle: "연예인과 여행 가는 꿈 해몽 | 신분 상승과 대운 | 무운" },
  "treasure-ship-sea-dream": { keyword: "바다 한가운데서 큰 보물선을 발견하는 꿈", metaTitle: "보물선 꿈 해몽 | 일생일대의 횡재수와 성공 | 무운" },
  "turtle-entering-house-dream": { keyword: "거북이가 느릿느릿 집 안으로 들어오는 꿈", metaTitle: "거북이가 집으로 들어오는 꿈 해몽 | 장수와 재물운 | 무운" },
  "turtle-entering-house-dream-2": { keyword: "거북이가 느릿느릿 집 안으로 들어오는 꿈", metaTitle: "거북이가 집으로 들어오는 꿈 해몽 | 장수와 재물운 | 무운" },
  "two-suns-dream-meaning": { keyword: "하늘에 두 개의 태양이 떠서 찬란히 빛나는 꿈", metaTitle: "두 개의 태양 꿈 해몽 | 겹경사와 강력한 재물운 | 무운" },
  "two-suns-dream-meaning-2": { keyword: "하늘에 두 개의 태양이 떠서 찬란히 빛나는 꿈", metaTitle: "두 개의 태양 꿈 해몽 | 겹경사와 강력한 재물운 | 무운" },
  "using-perfume-with-lover-dream": { keyword: "연인과 함께 향수를 뿌리는 꿈 향기 데이트 꿈", metaTitle: "연인과 향수 뿌리는 꿈 해몽 | 매력 발산과 명예운 | 무운" },
  "vineyard-grapes-dream-meaning": { keyword: "드넓은 포도밭에 포도가 주렁주렁 열린 꿈 해몽", metaTitle: "포도가 주렁주렁 열린 꿈 해몽 | 재산 증식과 다복함 | 무운" },
  "walking-flower-garden-dream": { keyword: "화려한 꽃밭 속을 홀로 거니는 꿈", metaTitle: "꽃밭을 걷는 꿈 해몽 | 연애운과 창의력 상승 | 무운" },
  "walking-flower-garden-dream-2": { keyword: "화려한 꽃밭 속을 홀로 거니는 꿈", metaTitle: "꽃밭을 걷는 꿈 해몽 | 연애운과 창의력 상승 | 무운" },
  "walking-in-flower-garden-dream": { keyword: "화려한 꽃밭을 걷는 꿈", metaTitle: "화려한 꽃밭 걷는 꿈 해몽 | 행복과 명예의 시작 | 무운" },
  "walking-on-flower-path-with-lover": { keyword: "연인과 함께 꽃밭을 걷는 꿈 꽃길 데이트 꿈", metaTitle: "연인과 꽃밭 걷는 꿈 해몽 | 인생의 황금기와 명예운 | 무운" },
  "walking-on-knife-edge-dream": { keyword: "날카로운 칼날 위를 맨발로 아슬아슬하게 걷는 꿈", metaTitle: "칼날 위를 걷는 꿈 해몽 | 위태로운 상황과 심리적 압박 | 무운 사주" },
  "walking-on-rainbow-dream-meaning": { keyword: "화사한 무지개 위를 걷는 꿈", metaTitle: "무지개 위를 걷는 꿈 해몽 | 기적적인 행운과 행복 | 무운" },
  "wandering-forest-with-stranger": { keyword: "모르는 이성과 숲속을 헤매는 꿈 산속 데이트 꿈", metaTitle: "모르는 이성과 숲 걷는 꿈 해몽 | 잠재력 발견과 횡재 | 무운" },
  "washing-hands-dream-meaning": { keyword: "손을 깨끗이 씻는 꿈 운세 풀이", metaTitle: "손 씻는 꿈 해몽 걱정이 사라지는 길몽일까 | 무운" },
  "washing-under-waterfall-dream": { keyword: "폭포 밑에서 맑은 물로 씻는 꿈 정화와 재생", metaTitle: "폭포 밑에서 씻는 꿈 해몽 | 정화와 인생의 새 출발 무운" },
  "watching-fireworks-with-lover-dream": { keyword: "연인과 불꽃놀이 보는 꿈 축제 데이트 꿈", metaTitle: "연인과 불꽃놀이 보는 꿈 해몽 | 인생 최고의 영광과 성공 | 무운" },
  "watching-milky-way-dream": { keyword: "밤하늘의 은하수를 가만히 바라보는 꿈", metaTitle: "은하수 바라보는 꿈 해몽 | 평화와 예술적 영감 | 무운" },
  "watching-milky-way-dream-2": { keyword: "밤하늘의 은하수를 가만히 바라보는 꿈", metaTitle: "은하수 바라보는 꿈 해몽 | 평화와 예술적 영감 | 무운" },
  "watching-sunrise-with-lover-dream": { keyword: "연인과 함께 일출 보는 꿈 해돋이 데이트 꿈", metaTitle: "연인과 일출 보는 꿈 해몽 | 최고의 성공과 제왕의 기운 | 무운" },
  "wearing-gold-clothes-mirror-dream": { keyword: "황금 옷을 입고 거울을 보는 꿈 해몽", metaTitle: "황금 옷 입고 거울 보는 꿈 | 명예와 신분 상승 | 무운" },
  "wearing-golden-crown-dream": { keyword: "화려한 황금 왕관을 머리에 쓰는 꿈", metaTitle: "황금 왕관 쓰는 꿈 해몽 | 최고의 명예와 권위 | 무운" },
  "wearing-silk-clothes-dream": { keyword: "비단 옷을 입고 거울을 보는 꿈", metaTitle: "비단 옷 입는 꿈 해몽 | 금의환향과 부귀영화 | 무운" },
  "wedding-turned-funeral-dream": { keyword: "결혼식장에 갔는데 신랑이나 신부가 없고 장례식장으로 변하는 꿈", metaTitle: "결혼식이 장례식 되는 꿈 해몽 | 이별과 계약 파기 징조 | 무운" },
  "white-deer-elephant-dream": { keyword: "흰 사슴이나 흰 코끼리를 보는 꿈", metaTitle: "흰 사슴 코끼리 꿈 해몽 | 성스러운 행운의 징조 | 무운" },
  "white-deer-forest-dream": { keyword: "깊은 숲속에서 하얀 사슴을 만나는 꿈", metaTitle: "하얀 사슴 만나는 꿈 해몽 | 고귀한 귀인과 명예 | 무운" },
  "white-deer-forest-dream-2": { keyword: "깊은 숲속에서 하얀 사슴을 만나는 꿈", metaTitle: "하얀 사슴 만나는 꿈 해몽 | 고귀한 귀인과 명예 | 무운" },
  "white-hair-dream-meaning-2": { keyword: "머리카락이 하얗게 변하는 꿈", metaTitle: "머리카락이 하얗게 변하는 꿈 해몽 명예와 장수의 상징 | 무운" },
  "white-horse-with-golden-wings-dream": { keyword: "황금 날개를 단 백마가 하늘로 비상하는 꿈", metaTitle: "날개 달린 백마 꿈 해몽 | 신분 상승과 거대 재물운 | 무운" },
  "white-horse-with-golden-wings-dream-2": { keyword: "황금 날개를 단 백마가 하늘로 비상하는 꿈", metaTitle: "날개 달린 백마 꿈 해몽 | 신분 상승과 거대 재물운 | 무운" },
  "white-snow-falling-dream-meaning": { keyword: "온 세상에 흰 눈이 내리는 꿈 순수한 사랑", metaTitle: "온 세상에 흰 눈이 내리는 꿈 해몽 | 순수한 시작과 축복 무운" },
  "white-teeth-smiling-dream": { keyword: "거울을 보며 하얀 치아를 드러내고 활짝 웃는 꿈", metaTitle: "하얀 치아로 웃는 꿈 해몽 | 경사와 성공의 예지몽 | 무운 메타 설명: 하얀 치아를 드러내며 웃는 꿈은 소원 성취와 재물운 상승을 뜻합니다. 지금 바로 상세한 상황별 풀이와 행운의 요소를 확인하세요." },
  "white-tiger-guarding-house-dream": { keyword: "하얀 호랑이가 집을 지키고 있는 꿈", metaTitle: "백호가 집 지키는 꿈 해몽 | 권력과 재물의 수호 | 무운" },
  "white-tiger-guarding-house-dream-2": { keyword: "하얀 호랑이가 집을 지키고 있는 꿈", metaTitle: "백호가 집 지키는 꿈 해몽 | 권력과 재물의 수호 | 무운" },
  "white-whale-swimming-dream": { keyword: "흰 수염 고래와 함께 헤엄치는 꿈", metaTitle: "흰 수염 고래 꿈 해몽 | 거대한 조력자와 성공 | 무운" },
  "wild-ginseng-discovery-dream": { keyword: "깊은 산속에서 산삼을 발견하고 캐는 꿈", metaTitle: "산삼 캐는 꿈 해몽 | 소원 성취와 횡재수의 상징 | 무운" },
  "wild-ginseng-discovery-dream-2": { keyword: "깊은 산속에서 산삼을 발견하고 캐는 꿈", metaTitle: "산삼 캐는 꿈 해몽 | 소원 성취와 횡재수의 상징 | 무운" },
  "wings-growing-and-flying-dream": { keyword: "어깨에 날개가 돋아 하늘을 나는 꿈 자유 승진 성취", metaTitle: "어깨에 날개가 돋는 꿈 해몽 | 자유와 승진 | 무운" },
  "wolf-chasing-nightmare-meaning": { keyword: "날카로운 이빨을 가진 늑대에게 쫓기다가 막다른 길에 다다르는 꿈", metaTitle: "늑대에게 쫓기는 꿈 해몽 | 위기 탈출과 심리 분석 | 무운 사주" },
};

const dictionaryKeywordMap: Record<string, { title: string; categoryLabel: string; metaTitle: string; metaDescription: string }> = {
  "gap-ja": { title: "갑자(甲子)", categoryLabel: "사주 기초", metaTitle: "갑자(甲子) 뜻과 사주 해석: 새로운 시작의 리더십", metaDescription: "육십갑자의 시작인 갑자의 사주적 의미와 현대적 성공 전략을 확인하세요. 새로운 시작을 꿈꾸는 당신을 위한 가이드." },
  "yeok-ma-sal": { title: "역마살(驛馬煞)", categoryLabel: "운세 개념", metaTitle: "역마살 사주 풀이: 떠돌이 팔자? 아니, 글로벌 인재!", metaDescription: "이동과 변화의 상징 역마살! 현대 사회에서 역마살을 성공의 기회로 바꾸는 법과 직업 추천을 담았습니다." },
  "do-hwa-sal": { title: "도화살(桃花煞)", categoryLabel: "관계 & 궁합", metaTitle: "도화살 뜻과 특징: 나도 혹시 연예인 사주?", metaDescription: "매력 자본의 시대, 도화살은 강력한 무기입니다. 사주에 숨겨진 나의 인기 비결과 활용법을 알아보세요." },
  "baek-ho-sal": { title: "백호살(白虎煞)", categoryLabel: "운세 개념", metaTitle: "백호살 사주 해석: 무서운 살이 성공의 열쇠로?", metaDescription: "강한 카리스마의 상징 백호살! 위기를 기회로 바꾸는 백호살 사주의 특징과 직업적 성공 비결을 공개합니다." },
  "bi-gyeon": { title: "비견(比肩)", categoryLabel: "십신", metaTitle: "사주 십신 비견(比肩) 해석: 자존감과 인간관계", metaDescription: "내 사주에 비견이 많다면? 자아 성찰과 대인관계의 핵심 키워드인 비견의 의미를 쉽게 풀이해 드립니다." },
  "sang-gwan": { title: "상관(傷官)", categoryLabel: "십신", metaTitle: "사주 상관(傷官) 뜻: 천재성인가 반항심인가?", metaDescription: "예술가와 혁신가의 사주, 상관! 조직 생활 팁과 당신의 재능을 꽃피울 수 있는 방법을 알아보세요." },
  "jeong-jae": { title: "정재(正財)", categoryLabel: "재물 & 직업", metaTitle: "정재(正財) 사주와 재물운: 부자되는 습관", metaDescription: "차곡차곡 쌓이는 부의 기운, 정재! 안정적인 재테크와 직장 생활에서 성공하는 법을 사주학적으로 분석합니다." },
  "pyeon-in": { title: "편인(偏印)", categoryLabel: "십신", metaTitle: "사주 편인(偏印) 해석: 독특한 재능과 전문성", metaDescription: "남다른 직관과 예술적 감각의 편인! 고독을 지혜로 바꾸는 방법과 편인 사주의 성공 공식을 알려드립니다." },
  "goe-gang-sal": { title: "괴강살(魁罡煞)", categoryLabel: "운세 개념", metaTitle: "괴강살 사주: 여장부와 리더의 카리스마", metaDescription: "북두칠성의 정기를 받은 괴강살! 인생의 파고를 넘어 정상에 서는 법과 괴강살 사주의 특징을 분석합니다." },
  "hong-yeom-sal": { title: "홍염살(紅艶煞)", categoryLabel: "관계 & 궁합", metaTitle: "홍염살과 도화살 차이점: 나만의 숨은 매력 찾기", metaDescription: "은근한 매력의 소유자 홍염살! 사람을 끌어당기는 사주 속 홍염살의 특징과 연애운을 높이는 법을 확인하세요." },
  "cheon-eul-gwi-in": { title: "천을귀인(天乙貴人)", categoryLabel: "운세 개념", metaTitle: "천을귀인(天乙貴人) 뜻: 내 사주에 수호천사가?", metaDescription: "위기를 기회로 바꾸는 최고의 길신, 천을귀인! 내 사주 속 귀인의 존재와 복을 부르는 법을 확인하세요." },
  "pyeon-gwan": { title: "편관(偏官)", categoryLabel: "십신", metaTitle: "사주 편관(偏官) 해석: 카리스마와 명예의 상징", metaDescription: "나를 단련시키는 강한 기운 편관! 조직 내에서의 성공 비결과 편관 사주의 스트레스 관리법을 공개합니다." },
  "sik-sin": { title: "식신(食神)", categoryLabel: "십신", metaTitle: "식신(食神) 사주: 평생 먹을 복과 재능", metaDescription: "인생의 즐거움을 아는 식신! 타고난 재능을 돈으로 바꾸는 법과 건강한 삶을 위한 사주 조언을 담았습니다." },
  "hwa-gae-sal": { title: "화개살(華蓋煞)", categoryLabel: "운세 개념", metaTitle: "화개살 뜻과 특징: 예술가와 종교인의 사주", metaDescription: "고독을 예술로 승화시키는 화개살! 내면의 깊이를 더하고 잠재력을 깨우는 사주 풀이를 만나보세요." },
  "yang-in-sal": { title: "양인살(羊刃煞)", categoryLabel: "운세 개념", metaTitle: "양인살 사주: 성공을 부르는 강한 의지력", metaDescription: "인생의 승부사 양인살! 강한 성격을 다스려 성공으로 이끄는 비결과 적합한 직업군을 제안합니다." },
  "jeong-in": { title: "정인(正印)", categoryLabel: "십신", metaTitle: "사주 정인(正印) 뜻: 공부운과 인덕의 결합", metaDescription: "사랑과 학문의 별 정인! 합격운을 높이는 법과 인품으로 성공하는 정인 사주의 특징을 알아봅니다." },
  "geop-jae": { title: "겁재(劫財)", categoryLabel: "십신", metaTitle: "겁재(劫財) 사주 해석: 경쟁심을 성공으로 바꾸는 법", metaDescription: "돈을 잃는 사주라고요? 아니요! 현대 사회에서 겁재가 가진 강력한 경쟁력과 부의 쟁취 전략을 확인하세요." },
  "won-jin-sal": { title: "원진살(元嗔煞)", categoryLabel: "관계 & 궁합", metaTitle: "원진살 뜻과 궁합: 애증의 관계를 푸는 열쇠", metaDescription: "자꾸만 부딪히는 우리, 혹시 원진살? 원진살의 원인과 관계를 회복하는 지혜로운 소통법을 제안합니다." },
  "mun-chang-gwi-in": { title: "문창귀인(文昌貴人)", categoryLabel: "사주 기초", metaTitle: "문창귀인 뜻: 공부 잘하는 사주와 글재주", metaDescription: "지혜의 상징 문창귀인! 학업 성취도를 높이고 창의적인 글쓰기 능력을 발휘하는 법을 알아봅니다." },
  "sam-jae": { title: "삼재(三災)", categoryLabel: "운세 개념", metaTitle: "삼재 뜻과 계산법: 두려움 대신 대비하는 지혜", metaDescription: "삼재라고 무조건 안 좋을까요? 들삼재, 눌삼재, 날삼재의 의미와 삼재를 무사히 넘기는 마음가짐을 공유합니다." },
  "sang-gwan-pae-in": { title: "상관패인(傷官佩印)", categoryLabel: "십신", metaTitle: "상관패인 뜻: 천재적 재능에 날개를 다는 법", metaDescription: "파격과 논리의 결합, 상관패인! 사주에 숨겨진 최고의 엘리트 코스와 성공 전략을 분석합니다." },
  "jae-saeng-gwan": { title: "재생관(財生官)", categoryLabel: "재물 & 직업", metaTitle: "재생관 사주: 부와 명예를 동시에 거머쥐는 운", metaDescription: "재물운이 명예운으로 이어지는 재생관의 원리! 직장 내 승진운과 사업적 성공의 상관관계를 알아봅니다." },
  "gong-mang": { title: "공망(空亡)", categoryLabel: "운세 개념", metaTitle: "사주 공망(空亡) 뜻과 해석: 비어있음의 미학", metaDescription: "공망이라고 실망하지 마세요! 세속적 성공을 넘어 정신적 풍요를 찾는 공망 사주의 특별한 활용법." },
  "gwan-in-sang-saeng": { title: "관인상생(官印相生)", categoryLabel: "재물 & 직업", metaTitle: "관인상생 사주: 직장 운과 승진의 비밀", metaDescription: "조직에서 사랑받는 비결은? 관인상생의 흐름을 통해 보는 안정적인 커리어 성공 공식과 인간관계 팁." },
  "hyeon-chim-sal": { title: "현침살(懸針殺)", categoryLabel: "건강 & 신체", metaTitle: "현침살 사주: 날카로운 재능과 전문 기술의 상징", metaDescription: "바늘처럼 예리한 현침살! 정밀한 기술과 분석력으로 성공하는 현침살 사주의 특징과 직업 추천." },
  "sik-sin-je-sal": { title: "식신제살(食神制殺)", categoryLabel: "십신", metaTitle: "식신제살 뜻: 위기를 해결하는 최고의 지략가", metaDescription: "내 사주에 해결사의 기운이? 식신제살의 원리와 어려움을 극복하고 성공하는 사주 풀이를 만나보세요." },
  "cheon-mun-seong": { title: "천문성(天文星)", categoryLabel: "기타", metaTitle: "천문성 사주: 사람의 마음을 읽는 특별한 직관", metaDescription: "남다른 예지력과 공감 능력의 비밀, 천문성! 활인업(活人業) 사주의 특징과 타고난 영적 재능을 알아보세요." },
  "chak-sal": { title: "양착살/음착살(陽錯殺/陰錯殺)", categoryLabel: "관계 & 궁합", metaTitle: "양착살 음착살 해석: 관계의 어긋남을 극복하는 법", metaDescription: "자꾸만 엇갈리는 인연 때문에 고민인가요? 착살의 의미를 현대적으로 풀이하고 행복한 인간관계를 맺는 지혜를 전합니다." },
  "gwi-mun-gwan-sal": { title: "귀문관살(鬼門關殺)", categoryLabel: "운세 개념", metaTitle: "귀문관살 사주: 천재와 예민함 사이의 한 끗 차이", metaDescription: "집착을 집중으로 바꾸는 법! 귀문관살 사주의 독특한 매력과 정신적 에너지를 관리하는 노하우를 공개합니다." },
  "gan-yeo-ji-dong": { title: "간여지동(干與支同)", categoryLabel: "사주 기초", metaTitle: "간여지동 사주 특징: 고집일까, 뚝심일까?", metaDescription: "내 사주 기둥이 같은 오행이라면? 강한 자아를 가진 간여지동 사주의 장단점과 성공적인 사회생활 팁을 전해드립니다." },
  "geum-su-ssang-cheong": { title: "금수쌍청(金水雙淸)", categoryLabel: "사주 기초", metaTitle: "금수쌍청 사주: 맑은 지성과 미모의 결합", metaDescription: "금과 수의 기운이 만났을 때 생기는 특별한 총명함! 사주 속 금수쌍청의 의미와 성공 공식을 풀어드립니다." },
  "do-se-ju-ok": { title: "도세주옥(淘洗珠玉)", categoryLabel: "사주 기초", metaTitle: "도세주옥(淘洗珠玉) 해석: 나를 빛내는 최고의 운", metaDescription: "보석이 물을 만나는 사주, 도세주옥! 나의 재능을 세상에 화려하게 데뷔시키는 비결을 알아보세요." },
  "sang-gwan-saeng-jae": { title: "상관생재(傷官生財)", categoryLabel: "재물 & 직업", metaTitle: "상관생재 사주: 아이디어로 부자 되는 법", metaDescription: "천재성과 재물운의 만남! 상관생재 사주가 가진 독보적인 사업 수완과 성공 키워드를 정리해 드립니다." },
  "sal-in-sang-saeng": { title: "살인상생(殺印相生)", categoryLabel: "십신", metaTitle: "살인상생 뜻: 역경을 딛고 리더가 되는 사주", metaDescription: "힘든 상황을 성공의 발판으로 만드는 살인상생의 힘! 위기를 기회로 바꾸는 사주학적 조언을 담았습니다." },
  "baek-ho-dae-sal": { title: "백호대살(白虎大煞)", categoryLabel: "운세 개념", metaTitle: "백호대살 사주: 무서운 살? 아니, 강력한 성공의 힘!", metaDescription: "백호대살 사주가 가진 압도적인 추진력과 카리스마! 현대 사회에서 성공을 쟁취하는 백호대살 활용법." },
  "cheon-ui-seong": { title: "천의성(天醫星)", categoryLabel: "기타", metaTitle: "천의성 사주: 사람을 살리고 치유하는 천직", metaDescription: "하늘의 의사라는 뜻의 천의성! 사주에 천의성이 있을 때 어울리는 직업과 삶의 태도를 알아봅니다." },
  "go-ran-sal": { title: "고란살(孤鸞煞)", categoryLabel: "관계 & 궁합", metaTitle: "고란살 뜻: 외로운 사주일까, 당당한 독립일까?", metaDescription: "고란살 사주의 특징과 연애 고민 해결법! 혼자서도 잘 해내는 멋진 당신을 위한 사주 카운슬링." },
  "cheon-mun-gwi-in": { title: "천문귀인(天門貴人)", categoryLabel: "사주 기초", metaTitle: "천문귀인 사주: 미래를 예측하는 탁월한 통찰력", metaDescription: "지혜와 예견력을 가진 사주 속 귀인, 천문귀인! 나의 타고난 지적 재능을 극대화하는 방법을 제안합니다." },
  "je-wang": { title: "제왕(帝旺)", categoryLabel: "운세 개념", metaTitle: "십이운성 제왕(帝旺): 사주에서 가장 강력한 성공 기운", metaDescription: "내 사주에 제왕의 기운이 있다면? 최고의 권력과 성공을 거머쥐는 제왕 사주의 운용 전략." },
  "jae-da-sin-yak": { title: "재다신약(財多身弱)", categoryLabel: "재물 & 직업", metaTitle: "재다신약 사주 탈출법: 재물을 내 것으로 만드는 비결", metaDescription: "돈은 많은데 내 주머니엔 안 들어온다면? 재다신약 사주가 부자가 되기 위해 필요한 마음가짐과 실천 팁." },
  "mok-hwa-tong-myeong": { title: "목화통명(木火通明)", categoryLabel: "사주 기초", metaTitle: "목화통명 사주: 천재성과 명예의 조화", metaDescription: "지혜가 밝게 빛나는 사주, 목화통명! 글재주와 학문으로 성공하는 사주적 특징과 현대적 성공 전략을 분석합니다." },
  "su-hwa-gi-je": { title: "수화기제(水火旣濟)", categoryLabel: "운세 개념", metaTitle: "수화기제 뜻: 완벽한 균형과 성공의 마침표", metaDescription: "갈등을 넘어 조화로! 수화기제 사주가 가진 안정감과 인생의 전성기를 유지하는 비결을 공유합니다." },
  "sik-sin-saeng-jae": { title: "식신생재(食神生財)", categoryLabel: "재물 & 직업", metaTitle: "식신생재 사주: 즐겁게 돈 버는 '덕업일치' 비결", metaDescription: "내가 잘하는 일이 돈이 되는 식신생재! 평생 재물운이 마르지 않는 사주 특징과 직업 추천을 담았습니다." },
  "hyeong-sal": { title: "형살(刑殺)", categoryLabel: "운세 개념", metaTitle: "형살 사주 풀이: 갈등을 이기는 전문 기술", metaDescription: "무서운 살이 아니라 특별한 능력! 인사신, 축술미 삼형살의 의미와 이를 직업적 성공으로 승화시키는 법." },
  "jeong-gwan": { title: "정관(正官)", categoryLabel: "십신", metaTitle: "사주 정관(正官) 해석: 명예와 신뢰를 얻는 법", metaDescription: "바른 길을 걷는 정관 사주! 안정적인 직장 운과 사회적 지위를 높이는 정관의 특징을 쉽게 설명해 드립니다." },
  "am-rok": { title: "암록(暗祿)", categoryLabel: "재물 & 직업", metaTitle: "암록(暗祿) 뜻: 평생 돈 걱정 없는 숨은 재복", metaDescription: "보이지 않는 곳에서 나를 돕는 귀인, 암록! 사주에 숨겨진 재물운과 위기 탈출의 비결을 확인하세요." },
  "do-sik": { title: "도식(倒食)", categoryLabel: "운세 개념", metaTitle: "사주 도식(倒食) 해석: 위기를 기회로 바꾸는 휴식", metaDescription: "잘 나가던 일에 제동이 걸렸다면? 도식의 의미를 이해하고 지혜롭게 슬럼프를 극복하는 법을 알려드립니다." },
  "cheon-deok-gwi-in": { title: "천덕귀인(天德貴人)", categoryLabel: "운세 개념", metaTitle: "천덕귀인 사주: 하늘이 돕는 천운의 소유자", metaDescription: "모든 재앙을 막아주는 최고의 길신 천덕귀인! 내 사주 속 천덕귀인을 찾는 법과 복을 누리는 지혜를 전합니다." },
  "geon-rok": { title: "건록(建祿)", categoryLabel: "재물 & 직업", metaTitle: "사주 건록(建祿) 특징: 성공하는 자수성가 사주", metaDescription: "스스로 부를 창조하는 힘, 건록! 독립심과 강한 운을 가진 건록 사주의 성공 방정식과 직업적 조언." },
  "hap": { title: "합(合)", categoryLabel: "관계 & 궁합", metaTitle: "사주 합(合)의 의미: 인연과 협업의 비밀", metaDescription: "사주에 합이 많으면 다정하다? 천간합과 지지합을 통해 보는 나의 인간관계 성향과 궁합의 원리." },
  "gyeong-guk-ji-saek-meaning": { title: "경국지색(傾國之色)의 매력과 현대적 영향력 관리법", categoryLabel: "관계 & 궁합", metaTitle: "경국지색 뜻과 현대적 의미: 매력을 권력으로 만드는 법", metaDescription: "경국지색의 유래와 현대적 해석을 알아봅니다. 독보적인 매력을 사회적 영향력으로 전환하는 개운법을 확인하세요." },
  "geum-sang-cheom-hwa-synergy": { title: "금상첨화(錦上添花)의 운세 활용과 시너지 극대화 전략", categoryLabel: "운세 개념", metaTitle: "금상첨화의 뜻과 운세 시너지: 좋은 운을 두 배로 쓰는 법", metaDescription: "좋은 일이 겹치는 금상첨화의 원리와 현대적 적용법을 설명합니다. 행운의 시기를 놓치지 않는 마음가짐을 배워보세요." },
  "dae-gi-man-seong-success": { title: "대기만성(大器晩成)형 사주의 특징과 인내의 가치", categoryLabel: "재물 & 직업", metaTitle: "대기만성 사주 풀이: 늦게 피는 꽃이 더 아름다운 이유", metaDescription: "큰 그릇을 만드는 인내의 시간, 대기만성의 명리학적 의미를 분석합니다. 후반전 성공을 위한 마음가짐을 확인하세요." },
  "deung-ra-gye-gap-meaning": { title: "등라계갑(藤蘿繫甲)의 대인관계 전략과 상생의 기술", categoryLabel: "관계 & 궁합", metaTitle: "등라계갑의 지혜: 귀인을 만나 성공의 사다리를 타는 법", metaDescription: "넝쿨이 나무를 타고 오르는 등라계갑의 원리와 현대적 인맥 관리법을 소개합니다. 상생을 통한 성공 전략을 확인하세요." },
  "myeong-gyeong-ji-su-mindset": { title: "명경지수(明鏡止水)의 마음 다스림과 명료한 의사결정", categoryLabel: "건강 & 신체", metaTitle: "명경지수의 개운법: 혼란한 운을 다스리는 고요한 힘", metaDescription: "맑은 거울 같은 마음, 명경지수의 의미와 현대적 실천법을 알아봅니다. 흔들리지 않는 판단력을 기르는 비결을 확인하세요." },
  "mu-so-bul-wi-power": { title: "무소불위(無所不爲)의 추진력과 책임 있는 권력 관리", categoryLabel: "재물 & 직업", metaTitle: "무소불위의 운세 활용: 강력한 힘을 다스리는 리더의 지혜", metaDescription: "무엇이든 이룰 수 있는 무소불위의 에너지와 그 부작용을 막는 법을 알아봅니다. 성공적인 리더를 위한 명리 가이드를 확인하세요." },
  "sa-pil-gwi-jeong-karma": { title: "사필귀정(事必歸正)과 운의 인과응보 원리", categoryLabel: "운세 개념", metaTitle: "사필귀정과 인과응보: 당신의 노력이 배신당하지 않는 이유", metaDescription: "모든 것이 제자리를 찾는 사필귀정의 원리를 명리학적으로 풀이합니다. 정직한 노력의 가치와 개운법을 확인하세요." },
  "sal-sin-seong-in-spirit": { title: "살신성인(殺身成仁)의 헌신과 활인업(活人業)의 공덕", categoryLabel: "재물 & 직업", metaTitle: "살신성인의 현대적 해석: 타인을 돕는 삶이 가져오는 복록", metaDescription: "자신을 내어줌으로써 더 큰 운을 얻는 살신성인의 원리를 알아봅니다. 활인업과 공덕이 인생에 미치는 영향을 확인하세요." },
  "yu-bi-mu-hwan-strategy": { title: "유비무환(有備無환)의 자산 관리와 위기 대응 기술", categoryLabel: "재물 & 직업", metaTitle: "유비무환의 명리 전략: 위기를 기회로 바꾸는 사전 준비", metaDescription: "평소의 준비가 근심을 없애는 유비무환의 지혜를 알아봅니다. 운의 리듬에 맞춘 자산 및 인생 관리법을 확인하세요." },
  "jeon-hwa-wi-bok-transformation": { title: "전화위복(轉禍爲福)의 위기 돌파와 운명 전환의 법칙", categoryLabel: "운세 개념", metaTitle: "전화위복의 개운법: 고난을 행운으로 바꾸는 운명 반전술", metaDescription: "화가 복이 되는 전화위복의 원리와 위기 대처법을 알아봅니다. 역경을 딛고 일어서는 명리적 지혜를 확인하세요." },
  "gyeol-ja-hae-ji-resolution": { title: "결자해지(結者解之)의 관계 회복과 운의 정화법", categoryLabel: "관계 & 궁합", metaTitle: "결자해지의 지혜: 꼬인 인간관계를 풀고 운을 여는 법", metaDescription: "스스로 맺은 매듭을 푸는 결자해지의 원리를 알아봅니다. 갈등 해결을 통한 운의 정화와 개운법을 확인하세요." },
  "go-jin-gam-rae-reward": { title: "고진감래(苦盡甘來)의 인내와 성공의 달콤한 열매", categoryLabel: "운세 개념", metaTitle: "고진감래 사주 풀이: 힘든 시기를 버티면 반드시 복이 온다", metaDescription: "고생 끝에 낙이 오는 고진감래의 의미와 운의 흐름을 분석합니다. 시련을 희망으로 바꾸는 명리적 조언을 확인하세요." },
  "gwa-yu-bul-geup-balance": { title: "과유불급(過猶不及)의 균형 잡기와 중용의 처세술", categoryLabel: "사주 기초", metaTitle: "과유불급의 개운법: 사주의 중화를 돕는 절제의 힘", metaDescription: "지나침이 화를 부르는 이유를 명리학적으로 풀이합니다. 과유불급의 태도로 인생의 균형을 되찾는 법을 확인하세요." },
  "gun-gye-il-hak-talent": { title: "군계일학(群鷄一鶴)의 개성과 독보적인 재능 발현법", categoryLabel: "재물 & 직업", metaTitle: "군계일학 사주: 독보적인 존재감으로 세상을 리드하는 법", metaDescription: "평범함을 거부하는 강력한 재능, 군계일학의 기운을 분석합니다. 자신만의 차별화된 매력을 발산하는 비결을 확인하세요." },
  "gwon-bul-sip-nyeon-modesty": { title: "권불십년(權不十年)의 명예 관리와 겸손의 미학", categoryLabel: "관계 & 궁합", metaTitle: "권불십년의 경고: 잘 나갈 때 운을 지키는 비결", metaDescription: "권력의 덧없음과 겸손의 중요성을 명리학적으로 풀이합니다. 성공의 정점에서 운의 하락기를 대비하는 법을 확인하세요." },
  "gi-go-man-jang-control": { title: "기고만장(氣高萬丈)의 에너지 조절과 감정 컨트롤", categoryLabel: "건강 & 신체", metaTitle: "기고만장한 기운의 활용법: 열정을 성과로 바꾸는 조절력", metaDescription: "넘치는 기운이 독이 되지 않게 하는 명리적 조언을 담았습니다. 기고만장한 에너지를 다스려 성공을 거머쥐는 법을 확인하세요." },
  "nan-hyeong-nan-je-rival": { title: "난형난제(難兄難弟)의 경쟁 관계와 동반 성장 전략", categoryLabel: "관계 & 궁합", metaTitle: "난형난제의 경쟁학: 유능한 라이벌과 함께 성공하는 법", metaDescription: "우열을 가리기 힘든 난형난제 관계의 명리적 이점을 분석합니다. 경쟁을 성장의 동력으로 바꾸는 상생 전략을 확인하세요." },
  "no-ik-jang-vitality": { title: "노익장(老益壯)의 지속 가능한 활동력과 자기 관리", categoryLabel: "건강 & 신체", metaTitle: "노익장 사주: 나이가 들수록 운이 트이는 사람들의 특징", metaDescription: "중년 이후 더 강력해지는 활동력, 노익장의 기운을 알아봅니다. 평생 현역으로 살 수 있는 명리적 비결을 확인하세요." },
  "da-da-ik-seon-growth": { title: "다다익선(多多益善)의 자원 활용과 확장 전략", categoryLabel: "재물 & 직업", metaTitle: "다다익선의 운세 전략: 내 그릇을 키워 더 많은 복을 담는 법", metaDescription: "많을수록 좋은 다다익선의 원리와 이를 감당하는 사주적 조건을 분석합니다. 성공적인 확장을 위한 명리 가이드를 확인하세요." },
  "dan-sa-pyo-eum-happiness": { title: "단사표음(簞食瓢飮)의 소박한 행복과 안빈낙도", categoryLabel: "기타", metaTitle: "단사표음의 행복론: 부족함 속에서 풍요를 찾는 마음 공부", metaDescription: "소박한 삶의 아름다움, 단사표음의 현대적 의미를 알아봅니다. 정신적 만족을 통해 평온한 운을 만드는 법을 확인하세요." },
  "il-chwi-wol-jang-growth": { title: "일취월장(日就月將)의 성장 정체기 돌파와 자기 계발법", categoryLabel: "재물 & 직업", metaTitle: "일취월장의 기운: 매일 성장하는 사주와 성공의 임계점", metaDescription: "나날이 발전하는 일취월장의 명리적 원리를 분석합니다. 정체기를 극복하고 폭발적인 성장을 이끄는 개운법을 확인하세요." },
  "yu-gu-mu-eon-silence": { title: "유구무언(有口無言)의 구설수 방어와 침묵의 처세술", categoryLabel: "관계 & 궁합", metaTitle: "유구무언의 개운법: 구설수를 잠재우는 침묵의 힘", metaDescription: "입을 닫아 운을 지키는 유구무언의 지혜를 알아봅니다. 상관견관 등 갈등의 시기에 필요한 명리적 처세를 확인하세요." },
  "ja-gang-bul-sik-discipline": { title: "자강불식(自強不息)의 자기 주도적 삶과 성공의 루틴", categoryLabel: "사주 기초", metaTitle: "자강불식의 의지: 스스로 운명을 바꾸는 성실함의 힘", metaDescription: "쉬지 않고 정진하는 자강불식의 명리적 의미를 분석합니다. 자기 주도적 삶을 통해 성공을 일구는 비결을 확인하세요." },
  "go-seong-nak-il-resilience": { title: "고성낙일(孤城落日)의 고독한 운세와 재기의 지혜", categoryLabel: "운세 개념", metaTitle: "고성낙일의 시기를 지나는 법: 고립을 성찰로 바꾸는 지혜", metaDescription: "세력이 저물고 홀로 남겨진 고성낙일의 명리적 의미를 풀이합니다. 운의 하락기에서 다시 일어설 에너지를 찾는 법을 확인하세요." },
  "geum-gwa-ok-jo-values": { title: "금과옥조(金科玉條)의 원칙 수립과 신뢰 자본 쌓기", categoryLabel: "사주 기초", metaTitle: "금과옥조의 가치관: 흔들리지 않는 원칙으로 운을 다스리는 법", metaDescription: "인생의 소중한 규칙, 금과옥조의 명리적 가치를 분석합니다. 확고한 신념이 가져오는 사회적 성공과 신뢰의 비결을 확인하세요." },
  "cheon-jin-nan-man-charisma": { title: "천진난만(天眞爛漫)의 순수성과 창의적 에너지 발현", categoryLabel: "관계 & 궁합", metaTitle: "천진난만한 사주의 매력: 순수함으로 대중의 마음을 훔치는 법", metaDescription: "가식 없는 맑음, 천진난만의 명리적 분석과 현대적 활용법을 알아봅니다. 진정성 있는 태도로 운을 열어보세요." },
  "on-go-ji-sin-insight": { title: "온고지신(溫故知新)의 지혜와 과거 경험의 자산화", categoryLabel: "사주 기초", metaTitle: "온고지신의 통찰력: 과거의 경험을 황금으로 바꾸는 법", metaDescription: "옛것을 배워 새 길을 여는 온고지신의 명리적 활용법을 소개합니다. 경험을 자산으로 만드는 지혜로운 개운법을 확인하세요." },
  "oe-yu-nae-gang-resilience": { title: "외유내강(外柔內剛)의 유연한 리더십과 내면 관리", categoryLabel: "관계 & 궁합", metaTitle: "외유내강 사주의 비밀: 부드러움 속에 감춰진 강력한 성공 에너지", metaDescription: "겉은 유연하고 속은 단단한 외유내강의 명리적 분석을 담았습니다. 진정한 내면의 힘을 기르는 개운법을 확인하세요." },
  "su-jeok-seok-cheon-persistence": { title: "수적석천(水滴石穿)의 끈기와 운의 임계점 돌파", categoryLabel: "운세 개념", metaTitle: "수적석천의 지혜: 물방울 같은 꾸준함이 돌 같은 운명을 바꾼다", metaDescription: "작은 노력의 반복이 가져오는 거대한 변화, 수적석천의 명리적 의미를 분석합니다. 꾸준함으로 개운하는 법을 확인하세요." },
  "go-jin-gam-rae-victory": { title: "고진감래(苦盡甘來)의 인내와 성공의 달콤한 보상", categoryLabel: "운세 개념", metaTitle: "고진감래 사주: 힘든 시기를 버텨낸 당신에게 올 큰 복", metaDescription: "고난 뒤에 찾아오는 행복, 고진감래의 명리적 원리를 알아봅니다. 시련을 견디고 찬란한 보상을 받는 비결을 확인하세요." },
  "go-jin-gam-rae-success": { title: "고진감래(苦盡甘래)의 인내와 성공의 달콤한 열매", categoryLabel: "운세 개념", metaTitle: "고진감래 사주 풀이: 힘든 시기를 버티면 반드시 복이 온다", metaDescription: "고생 끝에 낙이 오는 고진감래의 의미와 운의 흐름을 분석합니다. 시련을 희망으로 바꾸는 명리적 조언을 확인하세요." },
  "gwal-mok-sang-dae-growth": { title: "괄목상대(刮目相對)의 급격한 성장과 반전의 운명", categoryLabel: "재물 & 직업", metaTitle: "괄목상대의 개운법: 주변을 놀라게 할 대역전의 비결", metaDescription: "짧은 시간에 비약적으로 발전하는 괄목상대의 원리를 알아봅니다. 정체기를 깨고 도약하는 명리적 지혜를 확인하세요." },
  "gwon-to-jung-rae-comeback": { title: "권토중래(捲土重來)의 재기와 불굴의 도전 정신", categoryLabel: "운세 개념", metaTitle: "권토중래의 비결: 실패를 성공의 발판으로 바꾸는 법", metaDescription: "다시 일어서는 힘, 권토중래의 의미와 재기를 돕는 운세 활용법을 소개합니다. 불굴의 투지로 인생의 2막을 여는 법을 확인하세요." },
  "geum-ji-ok-yeop-value": { title: "금지옥엽(金枝玉葉)의 귀한 인연과 자존감 보호", categoryLabel: "관계 & 궁합", metaTitle: "금지옥엽 사주: 타고난 귀함과 자존감을 지키는 법", metaDescription: "귀한 존재를 뜻하는 금지옥엽의 명리적 의미를 풀이합니다. 스스로를 귀하게 여겨 운을 높이는 자존감 개운법을 확인하세요." },
  "nak-hwa-yu-su-flow": { title: "낙화유수(落花流水)의 순응과 자연스러운 운의 흐름", categoryLabel: "운세 개념", metaTitle: "낙화유수의 지혜: 집착을 버리고 운의 흐름에 맡기는 법", metaDescription: "순리를 따르는 낙화유수의 의미와 정서적 평온을 찾는 법을 알아봅니다. 억지스러운 노력을 멈추고 운을 따르는 비결을 확인하세요." },
  "ma-i-dong-pung-focus": { title: "마이동풍(馬耳東風)의 소신 경영과 부정적 기운 차단", categoryLabel: "사주 기초", metaTitle: "마이동풍의 처세술: 주변의 소음을 이겨내고 성공하는 법", metaDescription: "타인의 비난을 흘려보내는 마이동풍의 지혜를 알아봅니다. 강한 멘탈로 자신의 신념을 지키는 개운법을 확인하세요." },
  "myeong-bul-heo-jeon-reputation": { title: "명불허전(名不虛傳)의 실력 쌓기와 브랜드 가치", categoryLabel: "재물 & 직업", metaTitle: "명불허전의 가치: 이름값을 실력으로 증명하는 법", metaDescription: "명성에 합당한 능력을 뜻하는 명불허전의 의미를 분석합니다. 실질적인 전문성을 통해 브랜드 가치를 높이는 법을 확인하세요." },
  "baek-jeon-bul-tae-strategy": { title: "백전불태(百戰不殆)의 전략적 사고와 자기 객관화", categoryLabel: "사주 기초", metaTitle: "백전불태의 인생 전략: 사주 분석으로 실패를 예방하는 법", metaDescription: "나를 알고 적을 아는 지혜, 백전불태의 현대적 해석을 알아봅니다. 자기 객관화를 통해 위태롭지 않은 성공을 거두는 비결을 확인하세요." },
  "hwa-ryong-jeom-jeong-peak": { title: "화룡점정(畫龍點睛)의 마무리와 성과 극대화 기술", categoryLabel: "재물 & 직업", metaTitle: "화룡점정의 마무리 비법: 일의 완성도를 높여 운을 잡는 법", metaDescription: "핵심을 찌르는 완벽한 마무리, 화룡점정의 의미와 성과 극대화 전략을 알아봅니다. 인생의 정점을 찍는 명리적 조언을 확인하세요." },
  "gae-gwa-cheon-seon-reform": { title: "개과천선(改過遷善)의 운명 교정과 자기 혁신법", categoryLabel: "운세 개념", metaTitle: "개과천선의 개운법: 과거를 지우고 새로운 운명을 쓰는 지혜", metaDescription: "잘못을 고쳐 선으로 나아가는 개과천선의 명리적 의미를 분석합니다. 자기 혁신을 통해 운의 흐름을 바꾸는 법을 확인하세요." },
  "gyeon-ri-sa-ui-wealth": { title: "견리사의(見利思義)의 재물 철학과 지속 가능한 부", categoryLabel: "재물 & 직업", metaTitle: "견리사의의 재물운 관리: 부와 명예를 동시에 거머쥐는 법", metaDescription: "이익 앞에서 의로움을 먼저 생각하는 견리사의의 명리적 해석을 담았습니다. 올바른 재물관으로 운을 지키는 비결을 확인하세요." },
  "go-rip-mu-won-solitude": { title: "고립무원(孤立無援)의 고독한 시기와 내면의 자립", categoryLabel: "관계 & 궁합", metaTitle: "고립무원의 시기를 지나는 법: 외로움을 자립의 동력으로", metaDescription: "도움받을 곳 없는 고립무원의 명리적 의미를 분석합니다. 고독한 운의 흐름 속에서 내면의 성취를 이루는 개운법을 확인하세요." },
  "dong-byeong-sang-ryeon-empathy": { title: "동병상련(同病相憐)의 공감 능력과 치유의 인연", categoryLabel: "관계 & 궁합", metaTitle: "동병상련의 치유학: 아픔을 나누어 복을 만드는 인연의 신비", metaDescription: "같은 처지의 사람끼리 돕는 동병상련의 명리적 가치를 알아봅니다. 공감을 통해 악연을 선연으로 바꾸는 법을 확인하세요." },
  "ma-bu-jak-chim-grit": { title: "마부작침(磨斧作針)의 장인 정신과 대운의 완성", categoryLabel: "재물 & 직업", metaTitle: "마부작침의 성공학: 꾸준함으로 바위를 뚫고 운을 얻는 법", metaDescription: "도끼를 갈아 바늘을 만드는 마부작침의 명리적 해석을 전합니다. 포기하지 않는 끈기가 어떻게 대운을 완성하는지 확인하세요." },
  "sa-myeon-cho-ga-crisis": { title: "사면초가(四面楚歌)의 위기 관리와 운명의 탈출구", categoryLabel: "운세 개념", metaTitle: "사면초가의 위기 돌파: 막막한 운명에서 탈출구를 찾는 법", metaDescription: "사방이 막힌 사면초가 상황의 명리적 대처법을 소개합니다. 고립된 운의 흐름을 깨고 다시 일어나는 법을 확인하세요." },
  "su-su-bang-gwan-patience": { title: "수수방관(袖手傍觀)의 절제와 관조의 미학", categoryLabel: "관계 & 궁합", metaTitle: "수수방관의 처세: 불필요한 갈등을 피하고 운을 지키는 법", metaDescription: "팔짱 끼고 지켜보는 수수방관의 명리적 역설을 알아봅니다. 개입하지 않음으로써 얻는 평온과 지혜로운 기다림을 확인하세요." },
  "yeok-ji-sa-ji-empathy": { title: "역지사지(易地思之)의 공감과 인간관계 개운법", categoryLabel: "관계 & 궁합", metaTitle: "역지사지의 지혜: 인간관계의 갈등을 풀고 인덕을 쌓는 비결", metaDescription: "처지를 바꿔 생각하는 역지사지의 명리적 효능을 분석합니다. 타인의 입장을 헤아려 악연을 선연으로 바꾸는 법을 확인하세요." },
  "yu-jong-ui-mi-completion": { title: "유종의 미(有終之美)와 운의 결실을 맺는 법", categoryLabel: "운세 개념", metaTitle: "유종의 미를 거두는 법: 완벽한 마무리로 운의 결실을 맺는 비결", metaDescription: "끝맺음의 중요성을 뜻하는 유종의 미를 명리학적으로 풀이합니다. 인생의 단계를 아름답게 마무리하고 새 운을 맞는 법을 확인하세요." },
  "cheon-jae-il-u-opportunity": { title: "천재일우(千載一遇)의 기회 포착과 운의 타이밍", categoryLabel: "사주 기초", metaTitle: "천재일우의 기회 포착: 인생의 대운이 열릴 때 비상하는 법", metaDescription: "좀처럼 오기 힘든 절호의 기회, 천재일우의 명리적 배경을 알아봅니다. 운명의 골든타임을 포착하여 성공을 거머쥐는 비결을 확인하세요." },
  "gyeok-hwa-so-yang-solution": { title: "격화소양(隔靴搔痒)의 답답함과 용신 찾기 전략", categoryLabel: "사주 기초", metaTitle: "격화소양의 운세: 헛수고를 멈추고 인생의 핵심을 찾는 법", metaDescription: "애써도 성과 없는 격화소양의 상황을 명리학적으로 분석합니다. 노력의 방향을 수정하여 개운하는 비결을 확인하세요." },
  "go-jang-nan-myeong-partnership": { title: "고장난명(孤掌難鳴)의 협력 전략과 상생 인프라", categoryLabel: "관계 & 궁합", metaTitle: "고장난명의 지혜: 독불장군을 벗어나 협력으로 개운하는 법", metaDescription: "혼자서는 소리를 낼 수 없는 고장난명의 원리를 명리학적으로 풀이합니다. 파트너십을 통해 운을 극대화하는 법을 확인하세요." },
  "geum-gwa-ok-jo-principle": { title: "금과옥조(金科玉條)의 원칙 수립과 신뢰 자본 구축", categoryLabel: "사주 기초", metaTitle: "금과옥조의 처세: 흔들리지 않는 원칙으로 명예를 쌓는 법", metaDescription: "인생의 소중한 규칙을 뜻하는 금과옥조의 명리학적 가치를 분석합니다. 원칙을 지켜 운을 강화하는 비결을 확인하세요." },
  "nang-jung-ji-chu-talent": { title: "낭중지추(囊中之錐)의 재능 발현과 자연스러운 성공", categoryLabel: "재물 & 직업", metaTitle: "낭중지추 사주: 숨길 수 없는 재능으로 성공을 쟁취하는 법", metaDescription: "주머니 속 송곳 같은 비범한 재능, 낭중지추의 명리적 의미를 풀이합니다. 자신의 가치를 세상에 드러내는 개운법을 확인하세요." },
  "no-sim-cho-sa-anxiety": { title: "노심초사(勞心焦思)의 에너지 소모와 불안 관리", categoryLabel: "건강 & 신체", metaTitle: "노심초사의 굴레에서 벗어나는 법: 불안을 실행력으로 전환하기", metaDescription: "과도한 걱정이 운세에 미치는 영향, 노심초사의 명리적 해석을 전합니다. 마음의 평온을 되찾고 운을 틔우는 법을 확인하세요." },
  "da-sa-da-nan-resilience": { title: "다사다난(多事多難)의 시련 극복과 회복 탄력성", categoryLabel: "운세 개념", metaTitle: "다사다난한 운을 축복으로 바꾸는 법: 시련 속의 성장 전략", metaDescription: "일도 많고 탈도 많은 다사다난의 시기를 지혜롭게 넘기는 법을 알아봅니다. 명리학적으로 위기를 기회로 전환하는 법을 확인하세요." },
  "dae-dong-so-i-harmony": { title: "대동소이(大同小異)의 차이 극복과 화합의 기술", categoryLabel: "관계 & 궁합", metaTitle: "대동소이의 화합법: 작은 차이를 넘어 큰 인연을 맺는 법", metaDescription: "같음 속의 다름을 인정하는 대동소이의 명리적 해석을 전합니다. 인간관계의 갈등을 해소하고 상생하는 비결을 확인하세요." },
  "dong-go-dong-rak-teamwork": { title: "동고동락(同苦同樂)의 팀워크와 성공의 공유", categoryLabel: "관계 & 궁합", metaTitle: "동고동락의 인적 자산: 고난을 함께하고 성공을 나누는 운의 힘", metaDescription: "즐거움과 괴로움을 공유하는 동고동락의 가치를 명리학적으로 분석합니다. 진정한 내 편을 만들어 대운을 잡는 법을 확인하세요." },
  "ma-cheon-ru-ambition": { title: "마천루(摩天樓)의 야망과 균형 잡힌 성공", categoryLabel: "재물 & 직업", metaTitle: "마천루 사주: 거대한 성공을 일구고 유지하는 비결", metaDescription: "하늘을 찌르는 야망, 마천루의 명리적 의미와 성공 전략을 알아봅니다. 높은 성취 뒤의 위기를 관리하는 법을 확인하세요." },
  "man-sa-hyeong-tong-flow": { title: "만사형통(萬事亨通)의 순행과 복록의 선순환", categoryLabel: "운세 개념", metaTitle: "만사형통의 운세 관리: 모든 일이 풀리는 황금기를 활용하는 법", metaDescription: "만사가 순조로운 만사형통의 명리적 배경과 실천법을 알아봅니다. 운의 선순환을 유지하고 확장하는 비결을 확인하세요." },
  "sa-myeon-cho-ga-strategy": { title: "사면초가(四面楚歌)의 위기 관리와 운명의 탈출구", categoryLabel: "운세 개념", metaTitle: "사면초가의 위기 대처법: 사주상 고립을 돌파구로 바꾸는 법", metaDescription: "사방이 막힌 사면초가 상황의 명리적 의미와 탈출 전략을 알아봅니다. 극한의 위기를 기회로 바꾸는 마음가짐을 확인하세요." },
  "pung-jeon-deung-hwa-resilience": { title: "풍전등화(風前燈火)의 위기와 내면의 중심 잡기", categoryLabel: "운세 개념", metaTitle: "풍전등화의 위기 극복: 흔들리는 운명 속에서 중심을 잡는 법", metaDescription: "위태로운 상황을 뜻하는 풍전등화의 명리적 대처법을 알아봅니다. 거센 운명의 바람 속에서 나를 지키는 법을 확인하세요." },
  "ham-gu-mu-eon-silence": { title: "함구무언(緘口無言)의 구설수 차단과 기운 보존법", categoryLabel: "관계 & 궁합", metaTitle: "함구무언의 개운법: 구설수를 잠재우고 내면의 힘을 기르는 법", metaDescription: "말을 아껴 화를 피하는 함구무언의 명리적 지혜를 알아봅니다. 침묵을 통해 운의 흐름을 정화하는 비결을 확인하세요." },
  "hyeong-hyeong-saek-saek-uniqueness": { title: "형형색색(形形色色)의 개성 발휘와 다양성의 가치", categoryLabel: "사주 기초", metaTitle: "형형색색 사주 풀이: 자신만의 고유한 개성으로 성공하는 법", metaDescription: "다양성과 개성을 뜻하는 형형색색의 명리적 의미를 알아봅니다. 사주에 숨겨진 다채로운 재능을 발굴하고 활용하는 법을 확인하세요." },
  "ho-yeon-ji-gi-spirit": { title: "호연지기(浩然之氣)의 기개와 대운을 담는 그릇", categoryLabel: "사주 기초", metaTitle: "호연지기의 개운법: 대범한 기개로 인생의 큰 운을 잡는 법", metaDescription: "넓고 큰 기운을 뜻하는 호연지기의 명리적 의미를 알아봅니다. 내면의 그릇을 키워 대운을 맞이하는 비결을 확인하세요." },
  "hwa-mu-sip-il-hong-modesty": { title: "화무십일홍(花無十日紅)의 겸손과 변화의 수용", categoryLabel: "운세 개념", metaTitle: "화무십일홍의 교훈: 전성기에 겸손하고 하락기를 대비하는 법", metaDescription: "화려함의 덧없음과 변화를 뜻하는 화무십일홍의 명리적 해석을 전합니다. 운의 리듬에 맞춰 인생을 경영하는 법을 확인하세요." },
  "heung-jin-bi-rae-balance": { title: "흥진비래(興盡悲來)의 균형 감각과 위기 관리", categoryLabel: "운세 개념", metaTitle: "흥진비래의 지혜: 인생의 기복 속에서 평정심을 유지하는 법", metaDescription: "즐거움 뒤에 오는 슬픔을 뜻하는 흥진비래의 명리적 의미를 알아봅니다. 운의 순환을 이해하고 마음의 평화를 찾는 법을 확인하세요." },
  "amrok-characteristics-wealth": { title: "암록(暗祿)의 특징과 보이지 않는 곳에서 터지는 횡재수", categoryLabel: "운세 개념", metaTitle: "암록 뜻과 특징 완벽 정리", metaDescription: "숨겨진 복록인 암록의 성격과 재물운을 확인하세요. 보이지 않는 귀인의 도움으로 부를 일구는 암록 개운법을 제공합니다." },
  "baekho-sal-characteristics-power": { title: "백호살의 특징과 위기를 돌파하는 강력한 성공 에너지", categoryLabel: "운세 개념", metaTitle: "백호살 뜻과 특징 완벽 정리", metaDescription: "강력한 카리스마를 가진 백호살의 성격과 활용법을 확인하세요. 위기를 기회로 만들고 대업을 이루는 백호살 개운법을 제공합니다." },
  "banghap-characteristics-power": { title: "방합(方合)의 특징과 끈끈한 결속으로 세력을 만드는 힘", categoryLabel: "사주 기초", metaTitle: "방합 뜻과 특징 완벽 정리", metaDescription: "강력한 세력의 상징인 방합의 성격과 성공법을 확인하세요. 조직의 결속을 다지고 든든한 기반을 만드는 방합 개운법을 제공합니다." },
  "bigeop-characteristics-ego": { title: "비겁(比劫)의 특징과 나를 지탱하는 강력한 자아의 힘", categoryLabel: "십신", metaTitle: "비겁 뜻과 특징 완벽 정리", metaDescription: "주체성과 경쟁력의 상징인 비겁의 성격과 성공법을 확인하세요. 자립심을 키우고 리더로 성장하는 비겁 개운법을 제공합니다." },
  "bigyeon-characteristics-identity": { title: "비견의 특징과 나를 지탱하는 든든한 주체성", categoryLabel: "십신", metaTitle: "비견 뜻과 특징 완벽 정리", metaDescription: "사주 주체성의 핵심인 비견의 성격과 활용법을 확인하세요. 자존감을 높이고 성공적인 인간관계를 만드는 비견 개운법을 제공합니다." },
  "byeonghwa-characteristics-success-guide": { title: "병화의 특징과 성공하는 운세 보는 법", categoryLabel: "health", metaTitle: "병화 뜻과 특징 완벽 정리 | 무운", metaDescription: "태양의 기운을 가진 병화의 성격과 운세 특징을 확인하세요. 현대 사회에서 병화가 성공하기 위한 실질적인 조언과 개운법을 제공합니다." },
  "byeongin-characteristics-daily-pillar": { title: "병인 일주의 특징과 숲속의 태양처럼 빛나는 리더십", categoryLabel: "basic", metaTitle: "병인 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "태양의 열정을 가진 병인 일주의 성격과 운세를 확인하세요. 창의적 지혜와 리더십으로 성공하는 병인의 개운 비결과 조언을 제공합니다." },
  "byeongja-characteristics-daily-pillar": { title: "병자 일주의 특징과 호수 위 태양처럼 눈부신 운", categoryLabel: "basic", metaTitle: "병자 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "품격 있는 기운을 가진 병자 일주의 성격과 운세를 확인하세요. 정관의 바른 성품과 태양의 지혜로 성공하는 병자의 개운 비결과 조언을 제공합니다." },
  "byeongsul-characteristics-daily-pillar": { title: "병술 일주의 특징과 붉은 노을 속의 지혜", categoryLabel: "basic", metaTitle: "병술 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "따뜻한 태양의 기운을 가진 병술 일주의 성격과 운세를 확인하세요. 다재다능한 병술이 사회에서 인정받고 성공하는 비결과 개운법을 제공합니다." },
  "cheondeok-gwiin-characteristics": { title: "천덕귀인(天德貴人)의 특징과 하늘이 굽어살피는 복록", categoryLabel: "운세 개념", metaTitle: "천덕귀인 뜻과 특징 완벽 정리", metaDescription: "하늘의 가호인 천덕귀인의 복록과 활용법을 확인하세요. 위기를 극복하고 만인의 사랑을 받는 천덕귀인 개운법을 제공합니다." },
  "cheoneul-gwiin-characteristics-luck": { title: "천을귀인의 특징과 인생의 고비를 넘기는 복록", categoryLabel: "운세 개념", metaTitle: "천을귀인 뜻과 특징 완벽 정리", metaDescription: "사주 최고의 길신 천을귀인의 복록과 활용법을 확인하세요. 위기를 기회로 바꾸고 좋은 인연을 끌어당기는 천을귀인 개운법을 제공합니다." },
  "chung-characteristics-dynamic": { title: "충(沖)의 특징과 위기 속에 숨겨진 폭발적인 변화의 운", categoryLabel: "사주 기초", metaTitle: "충 뜻과 특징 완벽 정리", metaDescription: "변화와 혁신의 상징인 충의 성격과 활용법을 확인하세요. 충돌을 도약의 기회로 바꾸고 성공하는 충 개운법을 제공합니다." },
  "dohwa-sal-characteristics-charm": { title: "도화살의 특징과 현대적 매력 자본 활용법", categoryLabel: "운세 개념", metaTitle: "도화살 뜻과 특징 완벽 정리", metaDescription: "현대 사회의 매력 자본인 도화살의 성격과 활용법을 확인하세요. 구설을 피하고 인기를 성공으로 바꾸는 도화살 개운법을 제공합니다." },
  "dosejuyok-characteristics-beauty": { title: "도세주옥(淘洗珠玉)의 특징과 물에 씻긴 보석처럼 빛나는 인생", categoryLabel: "운세 개념", metaTitle: "도세주옥 뜻과 특징 완벽 정리", metaDescription: "보석의 광채를 더하는 도세주옥의 성격과 운세를 확인하세요. 재능을 세상에 드러내고 스타가 되는 도세주옥 개운법을 제공합니다." },
  "eulhae-characteristics-daily-pillar": { title: "을해 일주의 특징과 바다를 건너는 연꽃의 지혜", categoryLabel: "basic", metaTitle: "을해 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "지혜로운 물의 기운을 가진 을해 일주의 성격과 운세를 확인하세요. 학문적 소양과 유연함으로 성공하는 을해의 개운 비법과 조언을 제공합니다." },
  "eulmi-characteristics-daily-pillar": { title: "을미 일주의 특징과 사막의 선인장처럼 강인한 운", categoryLabel: "basic", metaTitle: "을미 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "끈질긴 생명력을 가진 을미 일주의 성격과 운세를 확인하세요. 재물 창고와 백호살의 힘으로 성공하는 을미의 개운 비결과 조언을 제공합니다." },
  "eulmok-characteristics-fortune-guide": { title: "을목의 특징과 운세 흐름 완벽 가이드", categoryLabel: "health", metaTitle: "을목 뜻과 특징 완벽 정리 | 무운", metaDescription: "사주에서 을목의 특징과 성격, 직업운을 상세히 풀이해 드립니다. 끈질긴 생명력의 상징 을목의 개운법을 지금 바로 확인하세요." },
  "eulsa-characteristics-daily-pillar": { title: "을사 일주의 특징과 꽃밭의 영리한 뱀처럼 사는 법", categoryLabel: "basic", metaTitle: "을사 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "화려한 재능을 가진 을사 일주의 성격과 운세를 확인하세요. 영리한 처세와 표현력으로 성공하는 을사의 개운 비결과 조언을 제공합니다." },
  "ganyeojidong-characteristics-ego": { title: "간여지동(干與支同)의 특징과 흔들리지 않는 강력한 자존감", categoryLabel: "사주 기초", metaTitle: "간여지동 뜻과 특징 완벽 정리", metaDescription: "강력한 자아의 상징인 간여지동의 성격과 성공법을 확인하세요. 주체성을 성공으로 바꾸고 인간관계를 개선하는 간여지동 개운법을 제공합니다." },
  "gapin-characteristics-daily-pillar": { title: "갑인 일주의 특징과 숲의 제왕으로 우뚝 서는 운", categoryLabel: "basic", metaTitle: "갑인 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "강력한 제왕의 기상을 가진 갑인 일주의 성격과 운세를 확인하세요. 독립적인 추진력으로 성공하는 갑인의 개운 비결과 조언을 제공합니다." },
  "gapmok-characteristics-leadership-success": { title: "갑목의 특징과 리더로 성공하는 운세 비결", categoryLabel: "heavenly-stems", metaTitle: "갑목 뜻과 특징 완벽 정리 | 무운", metaDescription: "거목의 기운을 가진 갑목의 성격과 리더십 특징을 확인하세요. 성공적인 삶을 위한 갑목의 추진력 활용법과 맞춤형 개운법을 제공합니다." },
  "gapsul-characteristics-daily-pillar": { title: "갑술 일주의 특징과 황금 산을 지키는 청색 개의 운", categoryLabel: "basic", metaTitle: "갑술 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "신의가 두터운 갑술 일주의 성격과 운세를 확인하세요. 편재의 복록과 강한 책임감으로 성공하는 갑술의 개운 비결과 조언을 제공합니다." },
  "geobjae-characteristics-competition": { title: "겁재의 특징과 위기를 기회로 바꾸는 강력한 승부욕", categoryLabel: "십신", metaTitle: "겁재 뜻과 특징 완벽 정리", metaDescription: "강력한 승부욕의 상징인 겁재의 성격과 성공법을 확인하세요. 경쟁을 뚫고 거대한 부를 일구는 겁재 개운법을 제공합니다." },
  "geumsussangcheong-characteristics": { title: "금수쌍청(金水雙淸)의 특징과 맑은 지혜로 세상을 비추는 운", categoryLabel: "사주 기초", metaTitle: "금수쌍청 뜻과 특징 완벽 정리", metaDescription: "맑은 지혜의 상징인 금수쌍청의 성격과 운세를 확인하세요. 비상한 두뇌로 성공하고 명예를 얻는 금수쌍청 개운법을 제공합니다." },
  "gimi-characteristics-daily-pillar": { title: "기미 일주의 특징과 메마른 땅에서 꽃을 피우는 인내", categoryLabel: "basic", metaTitle: "기미 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "우직한 끈기를 가진 기미 일주의 성격과 재물운을 확인하세요. 고난을 뚫고 실속 있는 성공을 이루는 기미의 개운 비결을 제공합니다." },
  "gimyo-characteristics-daily-pillar": { title: "기묘 일주의 특징과 정원의 토끼처럼 영리한 운", categoryLabel: "basic", metaTitle: "기묘 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "영리하고 섬세한 기묘 일주의 성격과 운세를 확인하세요. 편관의 긴장감을 창의력으로 승화시켜 성공하는 기묘의 개운 비결과 조언을 제공합니다." },
  "gito-characteristics-productivity-guide": { title: "기토의 특징과 결실을 맺는 생활 습관", categoryLabel: "heavenly-stems", metaTitle: "기토 뜻과 특징 완벽 정리 | 무운", metaDescription: "비옥한 대지의 기운을 가진 기토의 성격과 직업운을 확인하세요. 실속 있는 성공을 꿈꾸는 기토를 위한 맞춤형 개운법을 제공합니다." },
  "giyu-characteristics-daily-pillar": { title: "기유 일주의 특징과 옥토 위에서 울리는 황금 닭의 운", categoryLabel: "basic", metaTitle: "기유 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "단정하고 유능한 기유 일주의 성격과 운세를 확인하세요. 식신의 복록과 정교한 기술로 성공하는 기유의 개운 비법과 조언을 제공합니다." },
  "goegang-sal-characteristics-leader": { title: "괴강살의 특징과 세상을 지배하는 제왕의 기운", categoryLabel: "운세 개념", metaTitle: "괴강살 뜻과 특징 완벽 정리", metaDescription: "제왕의 기운을 가진 괴강살의 성격과 활용법을 확인하세요. 비범한 지능으로 성공을 거머쥐고 리더로 거듭나는 괴강살 개운법을 제공합니다." },
  "gongmang-characteristics-void": { title: "공망(空亡)의 특징과 비워냄으로써 더 큰 것을 채우는 법", categoryLabel: "사주 기초", metaTitle: "공망 뜻과 특징 완벽 정리", metaDescription: "비어 있는 기운인 공망의 성격과 활용법을 확인하세요. 집착을 내려놓고 더 큰 정신적 가치를 창조하는 공망 개운법을 제공합니다." },
  "gwanin-sangsaeng-characteristics": { title: "정관과 정인의 조화, 관인상생의 특징과 성공 법칙", categoryLabel: "사주 기초", metaTitle: "관인상생 뜻과 특징 완벽 정리", metaDescription: "명예와 학문의 조화인 관인상생의 성격과 성공법을 확인하세요. 조직에서 인정받고 높은 지위에 오르는 관인상생 개운법을 제공합니다." },
  "gwanseong-characteristics-honor": { title: "관성(官星)의 특징과 나를 다스려 명예를 얻는 법", categoryLabel: "십신", metaTitle: "관성 뜻과 특징 완벽 정리", metaDescription: "명예와 책임의 상징인 관성의 성격과 성공법을 확인하세요. 자신을 다스려 사회적 지위를 높이는 관성 개운법을 제공합니다." },
  "gwimun-characteristics-genius": { title: "귀문관살(鬼門關殺)의 특징과 천재적 몰입의 운명", categoryLabel: "운세 개념", metaTitle: "귀문관살 뜻과 특징 완벽 정리", metaDescription: "천재적 영감의 상징인 귀문관살의 성격과 활용법을 확인하세요. 예민한 직관을 독보적인 실력으로 바꾸는 귀문관살 개운법을 제공합니다." },
  "gyehae-characteristics-daily-pillar": { title: "계해 일주의 특징과 깊은 바다처럼 끝없는 지혜의 운", categoryLabel: "basic", metaTitle: "계해 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "깊은 바다의 지혜를 가진 계해 일주의 성격과 운세를 확인하세요. 강력한 제왕의 기운으로 대업을 이루는 계해의 개운 비결과 조언을 제공합니다." },
  "gyemyo-characteristics-daily-pillar": { title: "계묘 일주의 특징과 숲속의 비처럼 맑고 귀한 운", categoryLabel: "basic", metaTitle: "계묘 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "사랑받는 기운을 가진 계묘 일주의 성격과 운세를 확인하세요. 천을귀인의 복록과 식신의 지혜로 성공하는 계묘의 개운 비결과 조언을 제공합니다." },
  "gyeonggeum-characteristics-decision-guide": { title: "경금의 특징과 단단한 운명 만드는 법", categoryLabel: "heavenly-stems", metaTitle: "경금 뜻과 특징 완벽 정리 | 무운", metaDescription: "강인한 바위와 칼날의 기운을 가진 경금의 성격과 운세를 확인하세요. 성공적인 삶을 위한 경금의 결단력 활용법과 개운 조언을 담았습니다." },
  "gyeongin-characteristics-daily-pillar": { title: "경인 일주의 특징과 호랑이처럼 기회를 잡는 법", categoryLabel: "basic", metaTitle: "경인 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "호랑이의 기운을 가진 경인 일주의 성격과 재물운을 확인하세요. 강력한 추진력으로 성공을 거머쥐는 경인의 개운 조언을 제공합니다." },
  "gyeongja-characteristics-daily-pillar": { title: "경자 일주의 특징과 맑은 물가 위 바위의 지혜", categoryLabel: "basic", metaTitle: "경자 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "예리한 지능을 가진 경자 일주의 성격과 운세를 확인하세요. 상관의 언변과 냉철한 분석력으로 성공하는 경자의 개운 비결과 조언을 제공합니다." },
  "gyeongsul-characteristics-daily-pillar": { title: "경술 일주의 특징과 황금 산을 지키는 하얀 개의 운", categoryLabel: "basic", metaTitle: "경술 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "강력한 카리스마를 가진 경술 일주의 성격과 운세를 확인하세요. 괴강의 에너지와 의리로 성공하는 경술의 개운 비결과 조언을 제공합니다." },
  "gyesa-characteristics-daily-pillar": { title: "계사 일주의 특징과 천을귀인의 복록 가이드", categoryLabel: "basic", metaTitle: "계사 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "천을귀인의 복을 가진 계사 일주의 성격과 운세를 확인하세요. 지혜로운 처세로 명예와 부를 얻는 계사의 성공 비결과 개운법을 제공합니다." },
  "gyesu-characteristics-etiquette-guide": { title: "계수의 특징과 지혜로운 처세술 가이드", categoryLabel: "heavenly-stems", metaTitle: "계수 뜻과 특징 완벽 정리 | 무운", metaDescription: "단비와 이슬의 기운을 가진 계수의 성격과 지혜로운 운세 풀이를 확인하세요. 섬세한 계수가 성공하기 위한 마음가짐과 개운법을 안내합니다." },
  "hap-characteristics-harmony": { title: "합(合)의 특징과 인연을 끌어당기는 상생의 조화", categoryLabel: "사주 기초", metaTitle: "합 뜻과 특징 완벽 정리", metaDescription: "화합과 상생의 상징인 합의 성격과 활용법을 확인하세요. 인연을 끌어당기고 사회적 성공을 돕는 합 개운법을 제공합니다." },
  "hongyeom-sal-characteristics-attraction": { title: "홍염살의 특징과 사람을 홀리는 치명적인 매력", categoryLabel: "운세 개념", metaTitle: "홍염살 뜻과 특징 완벽 정리", metaDescription: "사람을 매혹하는 홍염살의 성격과 활용법을 확인하세요. 치명적인 매력을 팬덤과 성공으로 바꾸는 홍염살 개운법을 제공합니다." },
  "hwagae-sal-characteristics-art": { title: "화개살의 특징과 예술적 재능으로 성공하는 법", categoryLabel: "운세 개념", metaTitle: "화개살 뜻과 특징 완벽 정리", metaDescription: "고독을 창조로 바꾸는 화개살의 성격과 활용법을 확인하세요. 예술적 재능을 깨우고 정신적 성공을 이루는 화개살 개운법을 제공합니다." },
  "hyeonchim-sal-characteristics-expert": { title: "현침살의 특징과 예리한 감각으로 전문가 되는 법", categoryLabel: "운세 개념", metaTitle: "현침살 뜻과 특징 완벽 정리", metaDescription: "예리한 감각을 가진 현침살의 성격과 활용법을 확인하세요. 정밀한 기술로 성공하고 대체 불가능한 전문가가 되는 현침살 개운법을 제공합니다." },
  "hyeongsal-characteristics-expert": { title: "형살(刑殺)의 특징과 시시비비를 가려 전문가로 성공하는 법", categoryLabel: "사주 기초", metaTitle: "형살 뜻과 특징 완벽 정리", metaDescription: "전문성의 상징인 형살의 성격과 성공법을 확인하세요. 날카로운 기운을 권위와 실력으로 바꾸는 형살 개운법을 제공합니다." },
  "ilji-characteristics-destiny-guide": { title: "일지(日支)의 특징과 나를 아는 사주 보는 법", categoryLabel: "basic", metaTitle: "일지 뜻과 특징 완벽 정리 | 무운", metaDescription: "사주 일지가 결정하는 본인의 내면 성격과 배우자운을 확인하세요. 나를 가장 잘 아는 방법, 일지 분석과 개운 조언을 제공합니다." },
  "ilji-characteristics-foundation": { title: "일지(日支)의 특징과 나를 지탱하는 내면의 뿌리", categoryLabel: "사주 기초", metaTitle: "일지 뜻과 특징 완벽 정리", metaDescription: "내면 성격과 배우자운의 핵심인 일지의 성격과 활용법을 확인하세요. 가정의 행복과 안정을 지키는 일지 개운법을 제공합니다." },
  "imin-characteristics-daily-pillar": { title: "임인 일주의 특징과 바다를 건너는 호랑이의 운", categoryLabel: "basic", metaTitle: "임인 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "지혜롭고 낙천적인 임인 일주의 성격과 운세를 확인하세요. 문창귀인의 복록과 식신의 활동력으로 성공하는 임인의 개운 비결과 조언을 제공합니다." },
  "imjin-characteristics-daily-pillar": { title: "임진 일주의 특징과 흑룡처럼 승천하는 기운", categoryLabel: "basic", metaTitle: "임진 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "흑룡의 기운을 가진 임진 일주의 성격과 운세를 확인하세요. 괴강의 힘으로 난관을 뚫고 대업을 이루는 임진의 성공 비결을 제공합니다." },
  "imo-characteristics-daily-pillar": { title: "임오 일주의 특징과 바다 위를 달리는 적토마의 운", categoryLabel: "basic", metaTitle: "임오 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "영리하고 재물복이 많은 임오 일주의 성격과 운세를 확인하세요. 수화기제의 지혜로 사회적 성공을 이루는 임오의 개운 비결과 조언을 제공합니다." },
  "imsu-characteristics-wisdom-wealth": { title: "임수의 특징과 흐르는 물처럼 부자 되는 법", categoryLabel: "heavenly-stems", metaTitle: "임수 뜻과 특징 완벽 정리 | 무운", metaDescription: "거대한 바다의 기운을 가진 임수의 성격과 재물운을 확인하세요. 지혜로운 임수가 현대 사회에서 큰 운을 잡는 방법과 개운 조언을 제공합니다." },
  "inseong-characteristics-wisdom": { title: "인성(印星)의 특징과 나를 채워주는 지혜의 에너지", categoryLabel: "십신", metaTitle: "인성 뜻과 특징 완벽 정리", metaDescription: "지혜와 학문의 상징인 인성의 성격과 성공법을 확인하세요. 내면의 힘을 기르고 사회적 자격을 갖추는 인성 개운법을 제공합니다." },
  "jaesaeng-gwan-characteristics": { title: "재생관의 특징과 부를 바탕으로 명예를 높이는 성공학", categoryLabel: "사주 기초", metaTitle: "재생관 뜻과 특징 완벽 정리", metaDescription: "부와 명예의 조화인 재생관의 성격과 성공법을 확인하세요. 경제력을 바탕으로 사회적 지위를 높이는 재생관 개운법을 제공합니다." },
  "jaeseong-characteristics-wealth": { title: "재성(財星)의 특징과 현실적인 부를 창출하는 감각", categoryLabel: "십신", metaTitle: "재성 뜻과 특징 완벽 정리", metaDescription: "부와 현실 감각의 상징인 재성의 성격과 성공법을 확인하세요. 자산을 관리하고 경제적 자유를 이루는 재성 개운법을 제공합니다." },
  "jeong-in-characteristics-blessing": { title: "정인의 특징과 평생을 보살피는 따뜻한 학문과 복록", categoryLabel: "십신", metaTitle: "정인 뜻과 특징 완벽 정리", metaDescription: "인덕과 학문의 상징인 정인의 성격과 성공법을 확인하세요. 사랑받는 매력을 키우고 명예를 얻는 정인 개운법을 제공합니다." },
  "jeongchuk-characteristics-daily-pillar": { title: "정축 일주의 특징과 설원 속 촛불처럼 귀한 운세", categoryLabel: "basic", metaTitle: "정축 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "따뜻한 지혜를 가진 정축 일주의 성격과 운세를 확인하세요. 식신의 복록과 강한 인내심으로 성공하는 정축의 개운 비법과 조언을 제공합니다." },
  "jeonggwan-characteristics-honor": { title: "정관의 특징과 바른 길로 이끄는 안정된 명예의 별", categoryLabel: "십신", metaTitle: "정관 뜻과 특징 완벽 정리", metaDescription: "품격 있는 명예의 상징인 정관의 성격과 성공법을 확인하세요. 원칙을 지키며 사회적 지위를 높이는 정관 개운법을 제공합니다." },
  "jeonghae-characteristics-daily-pillar": { title: "정해 일주의 특징과 바다 위 뜬 달처럼 고귀한 운", categoryLabel: "basic", metaTitle: "정해 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "고귀한 기운을 가진 정해 일주의 성격과 운세를 확인하세요. 천을귀인의 복록과 정관의 지혜로 성공하는 정해의 개운 비결과 조언을 제공합니다." },
  "jeonghwa-characteristics-inner-power": { title: "정화의 특징과 내면의 힘을 키우는 법", categoryLabel: "heavenly-stems", metaTitle: "정화 뜻과 특징 완벽 정리 | 무운", metaDescription: "촛불과 별빛의 기운을 가진 정화의 성격과 운세 특징을 확인하세요. 섬세한 정화가 현대 사회에서 성공하기 위한 맞춤형 조언을 제공합니다." },
  "jeongjae-characteristics-stability": { title: "정재의 특징과 성실함으로 일구는 철통 보안 자산운", categoryLabel: "십신", metaTitle: "정재 뜻과 특징 완벽 정리", metaDescription: "안정적인 부의 상징인 정재의 성격과 관리법을 확인하세요. 성실함으로 자산을 지키고 평안한 노후를 만드는 정재 개운법을 제공합니다." },
  "jeongmyo-characteristics-daily-pillar": { title: "정묘 일주의 특징과 달빛 아래 핀 꽃처럼 우아한 삶", categoryLabel: "basic", metaTitle: "정묘 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "섬세한 감수성을 가진 정묘 일주의 성격과 운세를 확인하세요. 예술적 직관과 지혜로 성공하는 정묘의 개운 비결과 조언을 제공합니다." },
  "jeongyu-characteristics-daily-pillar": { title: "정유 일주의 특징과 밤하늘을 비추는 보석의 운", categoryLabel: "basic", metaTitle: "정유 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "보석 같은 기운을 가진 정유 일주의 성격과 운세를 확인하세요. 귀인의 복록과 천부적인 감각으로 성공하는 정유의 개운 비법을 제공합니다." },
  "johu-characteristics-balance": { title: "조후(調候)의 특징과 삶의 온도와 습도를 조절하는 법", categoryLabel: "건강 & 신체", metaTitle: "조후 뜻과 특징 완벽 정리", metaDescription: "삶의 온도를 조절하는 조후의 성격과 활용법을 확인하세요. 마음의 안정과 신체 건강을 지키는 조후 개운법을 제공합니다." },
  "mokhwatongmyeong-characteristics": { title: "목화통명(木火通明)의 특징과 세상을 밝히는 찬란한 지혜", categoryLabel: "사주 기초", metaTitle: "목화통명 뜻과 특징 완벽 정리", metaDescription: "찬란한 지혜의 상징인 목화통명의 성격과 운세를 확인하세요. 재능을 발휘해 세상을 밝히고 성공하는 목화통명 개운법을 제공합니다." },
  "muin-characteristics-daily-pillar": { title: "무인 일주의 특징과 산속의 호랑이처럼 당당한 운", categoryLabel: "basic", metaTitle: "무인 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "강력한 카리스마를 가진 무인 일주의 성격과 운세를 확인하세요. 편관의 리더십과 개척 정신으로 성공하는 무인의 개운 비결과 조언을 제공합니다." },
  "munchang-gwiin-characteristics-wisdom": { title: "문창귀인의 특징과 학문적 성공을 부르는 지혜의 운", categoryLabel: "운세 개념", metaTitle: "문창귀인 뜻과 특징 완벽 정리", metaDescription: "천부적인 지능을 가진 문창귀인의 성격과 활용법을 확인하세요. 학문과 예술에서 성공하고 지식 자산을 키우는 문창귀인 개운법을 제공합니다." },
  "muo-characteristics-daily-pillar": { title: "무오 일주의 특징과 타오르는 불꽃의 카리스마", categoryLabel: "basic", metaTitle: "무오 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "타오르는 열정을 가진 무오 일주의 성격과 리더십을 확인하세요. 강력한 제왕의 기운으로 성공을 거머쥐는 무오의 개운 조언을 제공합니다." },
  "musin-characteristics-daily-pillar": { title: "무신 일주의 특징과 황금 바위 위 원숭이의 지혜", categoryLabel: "basic", metaTitle: "무신 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "다재다능한 기운을 가진 무신 일주의 성격과 운세를 확인하세요. 식신의 복록과 영리한 지혜로 성공하는 무신의 개운 비결과 조언을 제공합니다." },
  "muto-characteristics-wealth-guide": { title: "무토의 특징과 믿음직한 부자 되는 법", categoryLabel: "heavenly-stems", metaTitle: "무토 뜻과 특징 완벽 정리 | 무운", metaDescription: "거대한 산의 기운을 가진 무토의 성격과 재물운 특징을 확인하세요. 신뢰받는 리더 무토가 성공하기 위한 실천적인 조언을 제공합니다." },
  "pyeon-in-characteristics-insight": { title: "편인의 특징과 보이지 않는 이치를 꿰뚫는 신비한 통찰력", categoryLabel: "십신", metaTitle: "편인 뜻과 특징 완벽 정리", metaDescription: "신비로운 통찰력의 상징인 편인의 성격과 성공법을 확인하세요. 독보적인 창의성을 발휘하고 전문성을 키우는 편인 개운법을 제공합니다." },
  "pyeongwan-characteristics-authority": { title: "편관의 특징과 한계를 돌파하는 강력한 카리스마", categoryLabel: "십신", metaTitle: "편관 뜻과 특징 완벽 정리", metaDescription: "강력한 권위의 상징인 편관의 성격과 성공법을 확인하세요. 시련을 이겨내고 최고의 명예를 얻는 편관 개운법을 제공합니다." },
  "pyeonjae-characteristics-wealth": { title: "편재의 특징과 큰 부를 움켜쥐는 역동적인 재물운", categoryLabel: "십신", metaTitle: "편재 뜻과 특징 완벽 정리", metaDescription: "거대한 부의 흐름인 편재의 성격과 투자법을 확인하세요. 시장을 장악하고 대부호가 되는 편재 개운법을 제공합니다." },
  "samhap-characteristics-success": { title: "삼합(三合)의 특징과 사회적 성공을 위한 강력한 결속", categoryLabel: "사주 기초", metaTitle: "삼합 뜻과 특징 완벽 정리", metaDescription: "거대한 협력의 상징인 삼합의 성격과 성공법을 확인하세요. 팀워크를 극대화하고 사회적 대업을 이루는 삼합 개운법을 제공합니다." },
  "sanggwan-characteristics-innovation": { title: "상관의 특징과 세상을 깨우는 천재적인 혁신의 힘", categoryLabel: "십신", metaTitle: "상관 뜻과 특징 완벽 정리", metaDescription: "천재적인 혁신의 상징인 상관의 성격과 성공법을 확인하세요. 비범한 재능을 발휘하고 구설을 피하는 상관 개운법을 제공합니다." },
  "sanggwan-paein-characteristics": { title: "상관패인의 특징과 천재적 재능을 지혜로 다스리는 법", categoryLabel: "사주 기초", metaTitle: "상관패인 뜻과 특징 완벽 정리", metaDescription: "재능과 학문의 조화인 상관패인의 성격과 성공법을 확인하세요. 천재성을 전문성으로 승화시키고 정점에 오르는 상관패인 개운법을 제공합니다." },
  "sarin-sangsaeng-characteristics": { title: "살인상생의 특징과 위기를 기회로 바꾸는 영웅의 지혜", categoryLabel: "사주 기초", metaTitle: "살인상생 뜻과 특징 완벽 정리", metaDescription: "위기를 기회로 바꾸는 살인상생의 성격과 성공법을 확인하세요. 고난을 이겨내고 최고의 권위를 얻는 살인상생 개운법을 제공합니다." },
  "siji-characteristics-future-luck": { title: "시지(時支)의 특징과 노년의 복록을 결정하는 비밀", categoryLabel: "사주 기초", metaTitle: "시지 뜻과 특징 완벽 정리", metaDescription: "노후 복록과 자녀운의 핵심인 시지의 성격과 활용법을 확인하세요. 인생의 결실을 맺고 평안한 노년을 보내는 시지 개운법을 제공합니다." },
  "siksang-characteristics-creativity": { title: "식상(食傷)의 특징과 나의 재능을 세상에 꽃피우는 힘", categoryLabel: "십신", metaTitle: "식상 뜻과 특징 완벽 정리", metaDescription: "표현력과 창의성의 상징인 식상의 성격과 성공법을 확인하세요. 재능을 발휘하고 부를 창출하는 식상 개운법을 제공합니다." },
  "siksin-characteristics-talent": { title: "식신의 특징과 풍요로운 의식주를 부르는 복록의 별", categoryLabel: "십신", metaTitle: "식신 뜻과 특징 완벽 정리", metaDescription: "풍요로운 삶의 상징인 식신의 성격과 활용법을 확인하세요. 재능을 발굴하고 안정적인 부를 쌓는 식신 개운법을 제공합니다." },
  "siksin-jesal-characteristics": { title: "식신제살의 특징과 위기를 단번에 제압하는 카리스마", categoryLabel: "사주 기초", metaTitle: "식신제살 뜻과 특징 완벽 정리", metaDescription: "위기 극복의 상징인 식신제살의 성격과 성공법을 확인하세요. 실력으로 난관을 뚫고 영웅이 되는 식신제살 개운법을 제공합니다." },
  "siksin-saengjae-characteristics": { title: "식신생재의 특징과 스스로 부를 일구는 자수성가운", categoryLabel: "사주 기초", metaTitle: "식신생재 뜻과 특징 완벽 정리", metaDescription: "스스로 부를 만드는 식신생재의 성격과 성공법을 확인하세요. 재능을 돈으로 바꾸고 부자가 되는 식신생재 개운법을 제공합니다." },
  "sinchuk-characteristics-daily-pillar": { title: "신축 일주의 특징과 하얀 소처럼 우직한 보석의 운", categoryLabel: "basic", metaTitle: "신축 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "우직한 인내심을 가진 신축 일주의 성격과 운세를 확인하세요. 정교한 실력과 집념으로 전문가가 되는 신축의 개운 비결과 조언을 제공합니다." },
  "singang-saju-characteristics-power": { title: "신강 사주의 특징과 주도적으로 운명을 개척하는 법", categoryLabel: "사주 기초", metaTitle: "신강 사주 뜻과 특징 완벽 정리", metaDescription: "강력한 자아의 상징인 신강 사주의 성격과 성공법을 확인하세요. 넘치는 에너지를 조절하고 리더로 성장하는 신강 개운법을 제공합니다." },
  "singeum-characteristics-gemstone-guide": { title: "신금의 특징과 보석처럼 빛나는 인생 비결", categoryLabel: "heavenly-stems", metaTitle: "신금 뜻과 특징 완벽 정리 | 무운", metaDescription: "완성된 보석의 기운을 가진 신금의 성격과 직업운을 확인하세요. 섬세하고 예리한 신금이 인생의 가치를 높이는 개운 조언을 제공합니다." },
  "sinhae-characteristics-daily-pillar": { title: "신해 일주의 특징과 맑은 물가에 씻긴 보석의 운", categoryLabel: "basic", metaTitle: "신해 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "찬란한 보석의 기운을 가진 신해 일주의 성격과 운세를 확인하세요. 상관의 지혜와 우아한 감각으로 성공하는 신해의 개운 비결과 조언을 제공합니다." },
  "sinmyo-characteristics-daily-pillar": { title: "신묘 일주의 특징과 섬세한 미학의 성공학", categoryLabel: "basic", metaTitle: "신묘 일주 뜻과 특징 완벽 정리 | 무운", metaDescription: "예리한 보석의 기운을 가진 신묘 일주의 성격과 운세를 확인하세요. 섬세한 감각으로 전문직에서 성공하는 신묘의 개운 비법을 제공합니다." },
  "sinyak-saju-characteristics-wisdom": { title: "신약 사주의 특징과 유연함으로 실속을 챙기는 지혜", categoryLabel: "사주 기초", metaTitle: "신약 사주 뜻과 특징 완벽 정리", metaDescription: "유연한 적응력의 상징인 신약 사주의 성격과 성공법을 확인하세요. 인맥과 자격을 활용해 실속 있게 성공하는 신약 개운법을 제공합니다." },
  "wolji-characteristics-social-success": { title: "월지(月支)의 특징과 사회적 성공의 법칙", categoryLabel: "basic", metaTitle: "월지 뜻과 특징 완벽 정리 | 무운", metaDescription: "사주 월지가 결정하는 본인의 사회적 성공과 직업 적성을 확인하세요. 타고난 환경을 성공의 발판으로 만드는 월지 분석법을 제공합니다." },
  "wonjin-sal-characteristics-love": { title: "원진살(元嗔煞)의 특징과 애증을 넘어 화합으로 가는 법", categoryLabel: "운세 개념", metaTitle: "원진살 뜻과 특징 완벽 정리", metaDescription: "애증의 상징인 원진살의 성격과 극복법을 확인하세요. 인간관계의 갈등을 예술적 영감과 치유의 힘으로 바꾸는 원진살 개운법을 제공합니다." },
  "yangin-sal-characteristics-action": { title: "양인살의 특징과 난관을 돌파하는 강력한 칼날의 운", categoryLabel: "운세 개념", metaTitle: "양인살 뜻과 특징 완벽 정리", metaDescription: "강력한 추진력을 가진 양인살의 성격과 활용법을 확인하세요. 투쟁심을 성공으로 바꾸고 정점에 오르는 양인살 개운법을 제공합니다." },
  "yeokjisaji-empathy-relationships": { title: "역지사지(易地思之)의 공감과 인간관계 개운법", categoryLabel: "관계 & 궁합", metaTitle: "역지사지 뜻과 사주 개운법 완벽 정리", metaDescription: "인간관계의 핵심인 역지사지의 성격과 활용법을 확인하세요. 상대의 마음을 얻고 인복을 불러오는 공감의 지혜와 개운법을 제공합니다." },
  "yeokma-sal-characteristics-travel": { title: "역마살의 특징과 글로벌 성공을 부르는 이동의 운", categoryLabel: "운세 개념", metaTitle: "역마살 뜻과 특징 완벽 정리", metaDescription: "글로벌 시대의 성공 무기인 역마살의 성격과 활용법을 확인하세요. 변화를 기회로 만들고 운을 상승시키는 역마살 개운법을 제공합니다." },
  "yongsin-characteristics-key-success": { title: "용신(用神)의 특징과 내 운명을 구하는 최고의 열쇠", categoryLabel: "사주 기초", metaTitle: "용신 뜻과 특징 완벽 정리", metaDescription: "운명을 바꾸는 핵심 에너지인 용신의 성격과 찾는 법을 확인하세요. 나에게 필요한 기운을 활용해 성공을 부르는 용신 개운법을 제공합니다." },
  "yukhae-sal-characteristics-relief": { title: "육해살(六害殺)의 특징과 막힌 인연을 뚫는 화해의 기술", categoryLabel: "운세 개념", metaTitle: "육해살 뜻과 특징 완벽 정리", metaDescription: "정체된 기운의 상징인 육해살의 성격과 활용법을 확인하세요. 막힌 인간관계를 풀고 운을 정화하는 육해살 개운법을 제공합니다." },
};

const metaData: Record<string, { title: string, description: string, h1?: string, services?: { href: string, label: string }[], bodyContent?: string }> = {
    '/': {
      title: "무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이 및 2026년 운세",
      description: "회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 병오년 신년운세, 토정비결, 궁합, 타로, 꿈해몽까지 모든 서비스가 완전 무료입니다.",
      h1: "무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이",
      bodyContent: `
        <section>
          <h2>무운(MuUn)이란?</h2>
          <p>무운(MuUn)은 30년 경력 역술인의 전문 지식을 바탕으로 만든 100% 무료 사주·운세 서비스입니다. 회원가입이 필요 없고, 개인정보를 서버에 저장하지 않으며, 생년월일만 입력하면 바로 사주풀이 결과를 확인할 수 있습니다.</p>
          <h2>무운의 주요 서비스</h2>
          <ul>
            <li><a href="/yearly-fortune">2026년 신년운세</a>: 2026년 병오년 한 해의 운세를 월별로 상세히 분석합니다.</li>
            <li><a href="/manselyeok">무료 만세력</a>: 사주팔자(四柱八字), 오행(五行) 구성, 천간지지(天干地支)를 무료로 조회합니다.</li>
            <li><a href="/lifelong-saju">평생 사주 분석</a>: 타고난 기질, 재물운, 직업운, 연애운, 결혼운을 종합 분석합니다.</li>
            <li><a href="/compatibility">정밀 궁합 분석</a>: 두 사람의 사주 오행 궁합과 성격 궁합을 정밀하게 분석합니다.</li>
            <li><a href="/family-saju">가족 사주 분석</a>: 가족 구성원 각각의 사주를 종합하여 가족 간의 오행 조화를 분석합니다.</li>
            <li><a href="/tojeong">토정비결</a>: 이지함 선생의 원문 계산법으로 2026년 한 해의 흐름을 확인합니다.</li>
            <li><a href="/tarot">타로 상담</a>: 고민되는 문제에 대한 해답을 타로 카드를 통해 확인합니다.</li>
            <li><a href="/dream">꿈해몽 사전</a>: 방대한 데이터를 바탕으로 꿈의 의미를 해석합니다.</li>
          </ul>
          <h2>왜 무운을 선택해야 할까요?</h2>
          <p>무운은 회원가입 없이, 개인정보 저장 없이, 결제 없이 모든 서비스를 이용할 수 있습니다. 30년 내공의 역술인이 직접 검증한 사주 알고리즘을 기반으로 정확하고 신뢰할 수 있는 운세 풀이를 제공합니다.</p>
        </section>
      `,
      services: [
        { href: '/yearly-fortune', label: '2026년 신년운세' },
        { href: '/manselyeok', label: '무료 만세력' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/tojeong', label: '토정비결' },
        { href: '/tarot', label: '타로 상담' },
        { href: '/dream', label: '꿈해몽 사전' },
        { href: '/guide', label: '운세 칼럼' },
      ]
    },
    '/yearly-fortune': {
      title: "2026년 무료 신년운세 - 회원가입 없이 바로 확인 | 무운",
      description: "회원가입 없이 생년월일만 입력하면 바로 확인하는 2026년 병오년 무료 신년운세. 월별 운세, 재물운, 직업운, 애정운까지 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "2026년 무료 신년운세",
      bodyContent: `
        <section>
          <h2>2026년 병오년(丙午年) 신년운세란?</h2>
          <p>2026년은 병오년(丙午年)으로, 붉은 말의 해입니다. 병화(丙火)의 기운이 강하게 작용하여 활동적이고 열정적인 에너지가 넘치는 한 해가 될 것으로 예측됩니다. 무운의 2026년 신년운세는 사주팔자(四柱八字)를 기반으로 개인별 맞춤 운세를 제공합니다.</p>
          <h2>신년운세에서 확인할 수 있는 내용</h2>
          <ul>
            <li>월별 운세: 1월부터 12월까지 월별 길흉(吉凶)과 주요 운의 흐름</li>
            <li>재물운(財物運): 2026년 한 해의 재물 운세와 투자, 사업 운</li>
            <li>직업운(職業運): 직장, 사업, 승진, 이직에 관한 운세</li>
            <li>애정운(愛情運): 연애, 결혼, 인간관계에 관한 운세</li>
            <li>건강운(健康運): 건강 관리 포인트와 주의해야 할 시기</li>
          </ul>
          <p>생년월일만 입력하면 회원가입 없이 즉시 확인할 수 있으며, 개인정보는 서버에 저장되지 않습니다.</p>
        </section>
        <form aria-label="신년운세 입력 폼">
          <fieldset>
            <legend>생년월일 입력</legend>
            <label for="yf-name">이름</label>
            <input id="yf-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="yf-birth">생년월일</label>
            <input id="yf-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="yf-time">태어난 시간</label>
            <select id="yf-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">신년운세 보기</button>
        </form>
      `,
      services: [
        { href: '/manselyeok', label: '만세력 분석' },
        { href: '/lifelong-saju', label: '평생 사주' },
        { href: '/tojeong', label: '토정비결' },
      ]
    },
    '/manselyeok': {
      title: "무료 만세력 조회 - 회원가입 없이 사주팔자 확인 | 무운 (MuUn)",
      description: "회원가입 없이 생년월일시만 입력하면 바로 확인하는 무료 만세력 분석. 사주팔자, 오행 구성, 천간지지를 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 만세력 조회",
      bodyContent: `
        <section>
          <h2>만세력(萬歲曆)이란?</h2>
          <p>만세력(萬歲曆)은 태어난 연도, 월, 일, 시간을 기준으로 사주팔자(四柱八字)를 구성하는 데 사용되는 동양 역법(曆法)입니다. 사주팔자는 태어난 순간의 우주적 기운을 네 개의 기둥(四柱)과 여덟 글자(八字)로 표현한 것으로, 개인의 타고난 기질과 운명의 흐름을 파악하는 데 활용됩니다.</p>
          <h2>만세력 조회로 알 수 있는 것</h2>
          <ul>
            <li>사주팔자(四柱八字): 연주(年柱), 월주(月柱), 일주(日柱), 시주(時柱)의 천간(天干)과 지지(地支)</li>
            <li>오행(五行) 구성: 목(木), 화(火), 토(土), 금(金), 수(水)의 분포와 강약</li>
            <li>일간(日干): 나를 상징하는 글자로, 성격과 기질의 핵심</li>
            <li>대운(大運): 10년 단위로 변화하는 운의 흐름</li>
            <li>세운(歲運): 해마다 변화하는 운의 흐름</li>
          </ul>
          <p>무운의 만세력은 양력과 음력을 모두 지원하며, 태어난 시간을 모르는 경우에도 조회가 가능합니다.</p>
        </section>
        <form aria-label="만세력 조회 폼">
          <fieldset>
            <legend>사용자 정보 입력</legend>
            <label for="ms-name">이름</label>
            <input id="ms-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" checked /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="ms-birth">생년월일</label>
            <input id="ms-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="ms-time">태어난 시간</label>
            <select id="ms-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">만세력 분석하기</button>
        </form>
      `,
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/lifelong-saju', label: '평생 사주' },
      ]
    },
    '/daily-fortune': {
      title: "무료 오늘의 운세 - 회원가입 없이 사주 기반 일일 운세 확인 | 무운 (MuUn)",
      description: "회원가입 없이 생년월일만 입력하면 바로 확인하는 무료 오늘의 운세. 사주팔자를 기반으로 총운·재물운·애정운·건강운을 개인정보 저장 없이 100% 무료로 매일 제공합니다.",
      h1: "무료 오늘의 운세",
      bodyContent: `
        <section>
          <h2>오늘의 운세란? - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 생년월일만 입력하면 바로 확인하는 무료 오늘의 운세 서비스입니다. 오늘의 운세는 사주팔자(四柱八字)와 오늘의 일진(日辰)을 결합하여 개인별 맞춤 하루 운세를 제공합니다. 매일 변화하는 천간(天干)과 지지(地支)의 기운이 나의 사주와 어떻게 상호작용하는지 분석하여, 오늘 하루의 길흉(吉凶)과 주의사항을 안내합니다.</p>
          <h2>오늘의 운세에서 확인할 수 있는 내용</h2>
          <ul>
            <li>오늘의 총운(總運): 오늘 하루 전반적인 운세의 흐름</li>
            <li>재물운(財物運): 오늘의 금전 운세와 투자 적합도</li>
            <li>애정운(愛情運): 오늘의 연애 및 인간관계 운세</li>
            <li>건강운(健康運): 오늘 주의해야 할 건강 포인트</li>
            <li>행운의 색상, 숫자, 방향</li>
          </ul>
        </section>
        <form aria-label="오늘운세 입력 폼">
          <fieldset>
            <legend>생년월일 입력</legend>
            <label for="df-name">이름</label>
            <input id="df-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="df-birth">생년월일</label>
            <input id="df-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="df-time">태어난 시간</label>
            <select id="df-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">오늘운세 보기</button>
        </form>
      `,
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/manselyeok', label: '만세력 분석' },
      ]
    },
    '/astrology': {
      title: "무료 점성술 네이탈 차트 분석 - 별자리·행성 배치로 보는 내 운명 | 무운 (MuUn)",
      description: "생년월일·출생지 입력만으로 무료로 확인하는 네이탈 차트(탄생 차트) 기반 점성술 풀이. 태양·달·수성·금성·화성 등 7개 행성의 별자리 위치를 분석해 성격·연애운·직업운을 알려드립니다.",
      h1: "무료 점성술 네이탈 차트 분석",
      bodyContent: `
        <section>
          <h2>네이탈 차트(탄생 차트)란? - 무료 점성술 풀이</h2>
          <p>네이탈 차트(Natal Chart, 탄생 차트·출생 차트)는 내가 태어난 순간 하늘의 행성들이 어느 별자리에 위치했는지를 기록한 천문 지도입니다. 서양 점성술에서는 이 지도를 바탕으로 개인의 성격, 재능, 연애 스타일, 직업 적성, 인생 흐름을 분석합니다. 무운의 점성술 서비스는 회원가입·개인정보 저장 없이 생년월일과 출생 도시만 입력하면 즉시 네이탈 차트를 계산하고 한국어로 풀이해 드립니다.</p>
          <h2>별자리별 성격 - 태양 별자리(Sun Sign)로 보는 나의 본질</h2>
          <p>태양 별자리는 점성술에서 가장 기본이 되는 요소로, 생년월일만으로 확인할 수 있습니다. 양자리(3/21~4/19)는 개척 정신과 리더십, 황소자리(4/20~5/20)는 안정과 감각적 풍요, 쌍둥이자리(5/21~6/21)는 지적 호기심과 소통, 게자리(6/22~7/22)는 감수성과 보호 본능을 상징합니다. 사자자리(7/23~8/22)는 카리스마와 창의성, 처녀자리(8/23~9/22)는 분석력과 완벽주의, 천칭자리(9/23~10/22)는 균형과 미적 감각, 전갈자리(10/23~11/21)는 깊은 직관과 변혁의 힘을 지닙니다. 사수자리(11/22~12/21)는 자유와 철학적 탐구, 염소자리(12/22~1/19)는 책임감과 성취 지향, 물병자리(1/20~2/18)는 혁신과 인도주의, 물고기자리(2/19~3/20)는 공감 능력과 영적 감수성을 나타냅니다.</p>
          <h2>달 별자리(Moon Sign)와 상승궁(Ascendant) - 숨겨진 내면 분석</h2>
          <p>달 별자리(Moon Sign)는 약 2.5일마다 별자리를 이동하므로 정확한 출생 시간이 있어야 정밀하게 계산됩니다. 달 별자리는 감정 반응 방식, 무의식적 습관, 안정감을 느끼는 환경을 나타냅니다. 상승궁(Ascendant, 어센던트)은 출생 시각과 장소에 따라 결정되며, 타인에게 보이는 첫인상과 사회적 페르소나를 의미합니다. 태양·달·상승궁 세 가지를 함께 분석하면 훨씬 입체적인 자기 이해가 가능합니다.</p>
          <h2>행성별 의미 - 수성·금성·화성·목성·토성</h2>
          <ul>
            <li><strong>수성(Mercury)</strong>: 사고방식, 의사소통 스타일, 학습 능력을 지배합니다.</li>
            <li><strong>금성(Venus)</strong>: 연애관, 미적 취향, 대인관계에서의 매력을 나타냅니다.</li>
            <li><strong>화성(Mars)</strong>: 행동력, 욕망, 경쟁심과 에너지 사용 방식을 보여줍니다.</li>
            <li><strong>목성(Jupiter)</strong>: 행운, 성장, 확장의 영역과 풍요를 가져오는 분야를 알려줍니다.</li>
            <li><strong>토성(Saturn)</strong>: 책임, 제약, 인내를 통해 성숙해지는 삶의 과제를 상징합니다.</li>
          </ul>
          <h2>점성술과 사주의 차이 - 서양 점성술 vs 동양 명리학</h2>
          <p>서양 점성술(Western Astrology)은 태어난 순간 행성의 황도 좌표를 기반으로 분석하는 반면, 동양 명리학(사주팔자)은 연·월·일·시의 천간지지(天干地支) 조합으로 운명을 해석합니다. 두 체계 모두 출생 시각을 중시하며, 개인의 타고난 기질과 인생 흐름을 파악한다는 공통점이 있습니다. 무운에서는 서양 점성술과 동양 사주풀이를 모두 무료로 제공하므로 두 관점을 비교해보실 수 있습니다.</p>
        </section>
      `,
      services: [
        { href: '/psychology', label: '심리테스트' },
        { href: '/lifelong-saju', label: '평생 사주' },
        { href: '/compatibility', label: '궁합 분석' },
      ]
    },
    '/lifelong-saju': {
      title: "무료 평생사주 풀이 - 회원가입 없이 타고난 운명 분석 | 무운",
      description: "회원가입·개인정보 저장 없이 확인하는 무료 평생사주 풀이. 타고난 기질, 인생 운세, 연애운, 결혼운, 재물운을 100% 무료로 분석해드립니다.",
      h1: "무료 평생사주 풀이",
      bodyContent: `
        <section>
          <h2>평생사주(平生四柱)란?</h2>
          <p>평생사주(平生四柱)는 사주팔자(四柱八字)를 기반으로 개인의 타고난 기질, 성격, 그리고 일생에 걸친 운의 흐름을 종합적으로 분석하는 명리학(命理學)의 핵심 분야입니다. 단순한 연간 운세를 넘어, 대운(大運)의 흐름에 따라 10년 단위로 변화하는 인생의 큰 흐름을 파악할 수 있습니다.</p>
          <h2>평생사주 분석으로 알 수 있는 것</h2>
          <ul>
            <li>타고난 기질과 성격: 일간(日干)을 중심으로 분석한 나의 본질적인 성격</li>
            <li>재물운(財物運): 재물을 모으는 방식과 재물복의 크기</li>
            <li>직업운(職業運): 적성에 맞는 직업군과 성공하기 유리한 분야</li>
            <li>연애운·결혼운: 이상적인 배우자의 유형과 결혼 시기</li>
            <li>대운(大運) 분석: 10년 단위로 변화하는 인생의 큰 흐름</li>
            <li>건강운(健康運): 체질에 따른 건강 관리 포인트</li>
          </ul>
          <p>무운의 평생사주는 30년 내공의 역술인이 검증한 알고리즘을 기반으로, 회원가입 없이 생년월일만 입력하면 즉시 확인할 수 있습니다.</p>
        </section>
        <form aria-label="평생사주 입력 폼">
          <fieldset>
            <legend>생년월일 입력</legend>
            <label for="ls-name">이름</label>
            <input id="ls-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="ls-birth">생년월일</label>
            <input id="ls-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="ls-time">태어난 시간</label>
            <select id="ls-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">평생사주 보기</button>
        </form>
      `,
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/compatibility', label: '궁합 분석' },
        { href: '/manselyeok', label: '만세력' },
      ]
    },
    '/compatibility': {
      title: "무료 궁합 보기 - 회원가입 없이 사주 궁합 분석 | 무운 (MuUn)",
      description: "회원가입 없이 두 사람의 생년월일만으로 바로 확인하는 무료 사주 궁합. 오행 궁합, 성격 궁합, 연애 궁합을 개인정보 저장 없이 100% 무료로 분석합니다.",
      h1: "무료 궁합 보기",
      bodyContent: `
        <section style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">
          <h2>사주 궁합(四柱 宮合)이란?</h2>
          <p>사주 궁합(四柱 宮合)은 두 사람의 사주팔자(四柱八字)를 비교하여 오행(五行)의 조화와 상생(相生)·상극(相剋) 관계를 분석하는 명리학의 응용 분야입니다. 단순한 띠 궁합을 넘어, 두 사람의 기질, 성격, 가치관의 조화를 종합적으로 파악할 수 있습니다.</p>
          <h2>궁합 분석으로 알 수 있는 것</h2>
          <ul>
            <li>오행 궁합: 두 사람의 오행(목·화·토·금·수) 분포와 상생·상극 관계</li>
            <li>성격 궁합: 일간(日干)을 기반으로 한 성격의 조화도</li>
            <li>연애 궁합: 연애 스타일의 일치도와 갈등 요인</li>
            <li>결혼 궁합: 장기적인 관계의 안정성과 발전 가능성</li>
            <li>합(合)과 충(沖): 두 사주 간의 특별한 인연과 갈등 요소</li>
          </ul>
          <p>두 사람의 생년월일만 입력하면 회원가입 없이 즉시 궁합 결과를 확인할 수 있습니다.</p>
        </section>
        <form aria-label="궁합 입력 폼">
          <fieldset>
            <legend>첫 번째 사람</legend>
            <label for="compat-name1">이름</label>
            <input id="compat-name1" type="text" name="name1" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender1" value="male" /> 남성</label>
            <label><input type="radio" name="gender1" value="female" checked /> 여성</label>
            <label for="compat-birth1">생년월일</label>
            <input id="compat-birth1" type="text" name="birthDate1" placeholder="YYYY. MM. DD" />
            <label for="compat-time1">태어난 시간</label>
            <select id="compat-time1" name="birthTime1">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31" selected>오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType1" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType1" value="lunar" /> 음력</label>
          </fieldset>
          <fieldset>
            <legend>두 번째 사람</legend>
            <label for="compat-name2">이름</label>
            <input id="compat-name2" type="text" name="name2" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender2" value="male" checked /> 남성</label>
            <label><input type="radio" name="gender2" value="female" /> 여성</label>
            <label for="compat-birth2">생년월일</label>
            <input id="compat-birth2" type="text" name="birthDate2" placeholder="YYYY. MM. DD" />
            <label for="compat-time2">태어난 시간</label>
            <select id="compat-time2" name="birthTime2">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31" selected>오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType2" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType2" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">궁합 결과 보기</button>
        </form>
        <section aria-label="궁합 결과" style="position:absolute;clip:rect(0,0,0,0);width:1px;height:1px;overflow:hidden;">
          <h2>궁합 분석 결과</h2>
          <div>
            <h3>오행 궁합</h3>
            <p>두 사람의 오행 조화를 분석한 결과입니다.</p>
          </div>
          <div>
            <h3>성격 궁합</h3>
            <p>일간(日干)을 기반으로 한 성격 조화도입니다.</p>
          </div>
          <div>
            <h3>연애 궁합</h3>
            <p>연애 스타일 일치도와 주요 갈등 요인입니다.</p>
          </div>
          <div>
            <h3>종합 점수</h3>
            <p>전체 궁합 종합 점수입니다.</p>
          </div>
        </section>
      `,
      services: [
        { href: '/hybrid-compatibility', label: '사주×MBTI 하이브리드 궁합' },
        { href: '/family-saju', label: '가족 사주 분석' },
      ]
    },
    '/hybrid-compatibility': {
      title: "무료 사주×MBTI 하이브리드 궁합 - 회원가입 없이 960가지 궁합 분석 | 무운 (MuUn)",
      description: "회원가입 없이 바로 확인하는 무료 사주×MBTI 하이브리드 궁합. 사주 오행과 MBTI를 결합한 960가지 맞춤 궁합 분석을 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 사주×MBTI 하이브리드 궁합",
      bodyContent: `
        <section>
          <h2>사주×MBTI 하이브리드 궁합이란? - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 생년월일과 MBTI만 입력하면 바로 확인하는 무료 하이브리드 궁합 서비스입니다. 사주×MBTI 하이브리드 궁합은 동양의 사주 오행(五行) 분석과 서양의 MBTI 성격 유형 이론을 결합한 무운만의 독창적인 궁합 분석 방법입니다. 사주가 타고난 에너지의 '하드웨어'라면, MBTI는 후천적으로 형성된 성격의 '소프트웨어'입니다. 두 가지를 함께 분석하면 훨씬 더 입체적이고 정확한 궁합 결과를 얻을 수 있습니다.</p>
          <h2>하이브리드 궁합 분석 내용</h2>
          <ul>
            <li>960가지 조합 분석: 5가지 오행 유형 × 16가지 MBTI 유형의 모든 조합</li>
            <li>에너지 저울: 두 사람의 오행 에너지 균형과 보완 관계</li>
            <li>4대 영역 리포트: 소통, 가치관, 생활방식, 감정 표현 방식의 조화도</li>
            <li>인연 타임라인: 관계의 발전 단계와 주요 전환점 예측</li>
            <li>갈등 처방전: 두 사람의 차이를 극복하는 구체적인 방법 제시</li>
          </ul>
        </section>
        <form aria-label="하이브리드 궁합 입력 폼">
          <fieldset>
            <legend>첫 번째 사람</legend>
            <label for="hc-name1">이름</label>
            <input id="hc-name1" type="text" name="name1" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender1" value="male" /> 남성</label>
            <label><input type="radio" name="gender1" value="female" checked /> 여성</label>
            <label for="hc-birth1">생년월일</label>
            <input id="hc-birth1" type="text" name="birthDate1" placeholder="YYYY. MM. DD" />
            <label for="hc-mbti1">MBTI</label>
            <select id="hc-mbti1" name="mbti1">
              <option value="">MBTI 선택</option>
              <option>INTJ</option><option>INTP</option><option>ENTJ</option><option>ENTP</option>
              <option>INFJ</option><option>INFP</option><option>ENFJ</option><option>ENFP</option>
              <option>ISTJ</option><option>ISFJ</option><option>ESTJ</option><option>ESFJ</option>
              <option>ISTP</option><option>ISFP</option><option>ESTP</option><option>ESFP</option>
            </select>
          </fieldset>
          <fieldset>
            <legend>두 번째 사람</legend>
            <label for="hc-name2">이름</label>
            <input id="hc-name2" type="text" name="name2" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender2" value="male" checked /> 남성</label>
            <label><input type="radio" name="gender2" value="female" /> 여성</label>
            <label for="hc-birth2">생년월일</label>
            <input id="hc-birth2" type="text" name="birthDate2" placeholder="YYYY. MM. DD" />
            <label for="hc-mbti2">MBTI</label>
            <select id="hc-mbti2" name="mbti2">
              <option value="">MBTI 선택</option>
              <option>INTJ</option><option>INTP</option><option>ENTJ</option><option>ENTP</option>
              <option>INFJ</option><option>INFP</option><option>ENFJ</option><option>ENFP</option>
              <option>ISTJ</option><option>ISFJ</option><option>ESTJ</option><option>ESFJ</option>
              <option>ISTP</option><option>ISFP</option><option>ESTP</option><option>ESFP</option>
            </select>
          </fieldset>
          <button type="submit">하이브리드 궁합 보기</button>
        </form>
      `,
      services: [
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/family-saju', label: '가족 사주 분석' },
      ]
    },
    '/tojeong': {
      title: "2026년 무료 토정비결 - 회원가입 없이 한 해 운세 확인 | 무운",
      description: "이지함 선생의 원문 괎 계산법으로 보는 2026년 병오년 무료 토정비결. 회원가입·개인정보 저장 없이 한 해의 흐름을 100% 무료로 확인하세요.",
      h1: "2026년 무료 토정비결",
      bodyContent: `
        <section>
          <h2>토정비결(土亭秘訣)이란?</h2>
          <p>토정비결(土亭秘訣)은 조선 중기의 학자 이지함(李之菡, 호: 土亭) 선생이 저술한 것으로 전해지는 한 해의 운세 예측서입니다. 태어난 연도, 월, 일을 기반으로 괘(卦)를 뽑아 한 해의 길흉(吉凶)과 월별 운세를 풀이합니다. 매년 새해가 되면 가장 많이 찾는 전통 운세 중 하나입니다.</p>
          <h2>2026년 토정비결 풀이 내용</h2>
          <ul>
            <li>연간 총운(總運): 2026년 한 해 전반의 운세 흐름</li>
            <li>월별 운세: 1월부터 12월까지 각 달의 길흉과 주의사항</li>
            <li>재물운(財物運): 한 해의 금전 운세와 재물의 흐름</li>
            <li>건강운(健康運): 주의해야 할 건강 관련 사항</li>
            <li>인간관계운: 가족, 직장, 대인관계의 흐름</li>
          </ul>
          <p>무운의 토정비결은 이지함 선생의 원문 괘 계산법을 충실히 재현하여, 회원가입 없이 생년월일만 입력하면 즉시 확인할 수 있습니다.</p>
        </section>
        <form aria-label="토정비결 입력 폼">
          <fieldset>
            <legend>생년월일 입력</legend>
            <label for="tj-name">이름</label>
            <input id="tj-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="tj-birth">생년월일</label>
            <input id="tj-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">토정비결 보기</button>
        </form>
      `,
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/lifelong-saju', label: '평생 사주' },
      ]
    },
    '/psychology': {
      title: "무료 심리테스트 - 회원가입 없이 성격 분석 및 잠재력 발견 | 무운 (MuUn)",
      description: "회원가입 없이 바로 시작하는 무료 심리테스트. 나의 진짜 성격, 숨겨진 잠재력, 대인관계 스타일을 개인정보 저장 없이 100% 무료로 분석합니다.",
      h1: "무료 심리테스트 및 성격 분석",
      bodyContent: `
        <section>
          <h2>심리테스트란? - 회원가입 없이 무료로 시작</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 100% 무료로 바로 시작하는 심리테스트 서비스입니다. 무운의 심리테스트는 심리학 이론을 기반으로 나의 진짜 성격, 숨겨진 잠재력, 대인관계 스타일을 재미있고 쉽게 파악할 수 있도록 설계된 테스트입니다. 사주 오행(五行) 분석과 결합하여 동서양의 관점에서 나를 더 깊이 이해할 수 있습니다.</p>
          <h2>심리테스트 종류</h2>
          <ul>
            <li>성격 유형 테스트: 나의 기본적인 성격 유형과 강점 파악</li>
            <li>대인관계 스타일 테스트: 타인과의 관계에서 나타나는 패턴 분석</li>
            <li>스트레스 대처 방식 테스트: 어려운 상황에서 나의 반응 유형 확인</li>
            <li>잠재력 발견 테스트: 아직 발휘되지 않은 나의 숨겨진 능력 탐색</li>
          </ul>
        </section>
      `,
      services: [
        { href: '/astrology', label: '서양 점성술' },
        { href: '/tarot', label: '타로 상담' },
      ]
    },
    '/tarot': {
      title: "무료 타로 - 회원가입 없이 무료로 | 무운 (MuUn)",
      description: "회원가입 없이 바로 시작하는 무료 타로 상담. 고민되는 문제에 대한 해답을 개인정보 저장 없이 100% 무료로 확인하세요.",
      h1: "무료 타로 상담",
      bodyContent: `
        <section>
          <h2>타로(Tarot)란?</h2>
          <p>타로(Tarot)는 78장의 카드를 사용하여 질문자의 현재 상황, 숨겨진 감정, 미래의 가능성을 직관적으로 탐색하는 점술 도구입니다. 22장의 메이저 아르카나(Major Arcana)와 56장의 마이너 아르카나(Minor Arcana)로 구성되며, 각 카드는 고유한 상징과 의미를 담고 있습니다.</p>
          <h2>무운 타로 상담 방법</h2>
          <ul>
            <li>원 카드 스프레드: 오늘 하루의 핵심 메시지를 한 장의 카드로 확인</li>
            <li>쓰리 카드 스프레드: 과거-현재-미래의 흐름을 세 장의 카드로 분석</li>
            <li>켈틱 크로스: 복잡한 상황을 10장의 카드로 심층 분석</li>
            <li>연애 타로: 현재 연애 상황과 상대방의 마음을 타로로 확인</li>
          </ul>
          <p>회원가입 없이 바로 시작할 수 있으며, 개인정보는 서버에 저장되지 않습니다.</p>
        </section>
        <form aria-label="타로 상담 폼">
          <fieldset>
            <legend>타로 상담 시작</legend>
            <label for="tarot-question">고민 또는 질문</label>
            <input id="tarot-question" type="text" name="question" placeholder="오늘의 고민을 입력하세요" autocomplete="off" />
          </fieldset>
          <button type="submit">타로 카드 뽑기</button>
        </form>
      `,
      services: [
        { href: '/psychology', label: '심리테스트' },
        { href: '/dream', label: '꿈해몽 사전' },
      ]
    },
    '/dream': {
      title: "무료 꿈해몽 사전 - 회원가입 없이 꿈 풀이 확인 | 무운 (MuUn)",
      description: "어젯밤 꿈의 의미가 궁금하신가요? 회원가입 없이 바로 검색하는 무료 꿈해몽 사전. 방대한 데이터를 바탕으로 정확한 꿈 풀이를 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 꿈해몽 사전",
      bodyContent: `
        <section>
          <h2>꿈해몽(夢解夢)이란?</h2>
          <p>꿈해몽(夢解夢)은 꿈에서 나타난 상징과 이미지를 해석하여 그 의미를 파악하는 전통적인 점술 방법입니다. 동양의 전통 꿈 해석 이론과 현대 심리학의 꿈 분석 이론을 결합하여, 꿈이 전달하는 메시지를 보다 정확하게 이해할 수 있습니다.</p>
          <h2>자주 꾸는 꿈의 의미</h2>
          <ul>
            <li>돼지 꿈: 재물운과 풍요를 상징하는 대표적인 길몽</li>
            <li>불 꿈: 열정, 변화, 새로운 시작을 의미하는 꿈</li>
            <li>물 꿈: 감정의 흐름, 무의식, 정화를 상징하는 꿈</li>
            <li>뱀 꿈: 지혜, 변화, 또는 위험을 경고하는 꿈</li>
            <li>하늘을 나는 꿈: 자유, 성취, 목표 달성을 암시하는 꿈</li>
            <li>죽음에 관한 꿈: 변화와 새로운 시작을 의미하는 경우가 많음</li>
          </ul>
          <p>무운의 꿈해몽 사전은 350가지 이상의 꿈 유형을 수록하고 있으며, 키워드 검색으로 원하는 꿈의 의미를 즉시 확인할 수 있습니다.</p>
        </section>
      `,
      services: [
        { href: '/tarot', label: '타로 상담' },
        { href: '/psychology', label: '심리테스트' },
      ]
    },
    '/family-saju': {
      title: "무료 가족사주 분석 - 회원가입 없이 우리 가족 궁합과 오행 조화 확인 | 무운 (MuUn)",
      description: "회원가입 없이 생년월일만 입력하면 바로 확인하는 무료 가족사주 분석. 부모·자녀·배우자의 사주팔자를 종합하여 가족 간 오행 조화와 관계 역학을 개인정보 저장 없이 100% 무료로 분석합니다.",
      h1: "무료 가족사주 분석",
      bodyContent: `
        <section>
          <h2>가족사주(家族四柱)란? - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 생년월일만 입력하면 바로 확인하는 무료 가족사주 분석 서비스입니다. 가족사주(家族四柱)는 가족 구성원 각각의 사주팔자(四柱八字)를 종합적으로 분석하여, 가족 간의 오행(五行) 조화와 관계 역학을 파악하는 명리학(命理學)의 응용 분야입니다. 개인의 사주를 넘어 가족 전체의 기운이 어떻게 상호작용하는지를 분석함으로써, 가족 관계의 강점과 보완해야 할 부분을 파악할 수 있습니다.</p>
          <h2>가족사주로 알 수 있는 것</h2>
          <ul>
            <li>부부 오행 궁합: 배우자 간의 오행 상생(相生)·상극(相剋) 관계와 조화도</li>
            <li>부모-자녀 관계: 부모와 자녀 사주 간의 기운 흐름과 교육 방향</li>
            <li>형제자매 관계: 형제자매 간의 성격 차이와 상호 보완 관계</li>
            <li>가족 전체 오행 균형: 가족 구성원의 오행을 합산하여 가족 전체의 기운 파악</li>
            <li>갈등 원인 분석: 가족 간 갈등의 사주적 원인과 해결 방향 제시</li>
          </ul>
          <h2>가족사주 분석 방법</h2>
          <p>가족 구성원의 생년월일을 각각 입력하면, 무운이 각 구성원의 사주팔자를 분석하고 가족 간의 오행 조화를 종합적으로 평가합니다. 회원가입이나 결제 없이 무료로 이용할 수 있으며, 입력된 정보는 서버에 저장되지 않습니다.</p>
          <h2>가족사주가 중요한 이유</h2>
          <p>사주명리학에서는 가족 구성원의 사주가 서로 영향을 주고받는다고 봅니다. 예를 들어, 화(火) 기운이 강한 아버지와 수(水) 기운이 강한 어머니는 상극(相剋) 관계이지만, 이 사이에서 태어난 목(木) 기운의 자녀가 완충 역할을 할 수 있습니다. 이처럼 가족사주 분석을 통해 가족 내 역학 관계를 이해하고, 더 조화로운 가정을 만드는 데 도움을 받을 수 있습니다.</p>
        </section>
        <form aria-label="가족사주 입력 폼">
          <fieldset>
            <legend>가족 구성원 정보 입력</legend>
            <label for="fs-name1">구성원 1 이름</label>
            <input id="fs-name1" type="text" name="name1" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender1" value="male" /> 남성</label>
            <label><input type="radio" name="gender1" value="female" /> 여성</label>
            <label for="fs-birth1">생년월일</label>
            <input id="fs-birth1" type="text" name="birthDate1" placeholder="YYYY. MM. DD" />
            <label for="fs-name2">구성원 2 이름</label>
            <input id="fs-name2" type="text" name="name2" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender2" value="male" /> 남성</label>
            <label><input type="radio" name="gender2" value="female" /> 여성</label>
            <label for="fs-birth2">생년월일</label>
            <input id="fs-birth2" type="text" name="birthDate2" placeholder="YYYY. MM. DD" />
          </fieldset>
          <button type="submit">가족사주 분석하기</button>
        </form>
      `,
      services: [
        { href: '/compatibility', label: '정밀 궁합 분석' },
        { href: '/hybrid-compatibility', label: '하이브리드 궁합' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
      ]
    },
    '/fortune-dictionary': {
      title: "무료 사주 용어 사전 - 회원가입 없이 명리학 핵심 용어 학습 | 무운 (MuUn)",
      description: "회원가입 없이 무료로 학습하는 사주 명리학 용어 사전. 천간, 지지, 오행, 십신, 대운 등 사주 기초 개념을 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 사주 용어 사전",
      bodyContent: `
        <section>
          <h2>사주 용어 사전이란? - 회원가입 없이 무료로 학습</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 100% 무료로 학습할 수 있는 사주 명리학 용어 사전입니다. 사주 명리학(命理學)은 수천 년의 역사를 가진 동양의 전통 학문으로, 다양한 전문 용어를 사용합니다. 무운의 사주 용어 사전은 초보자도 쉽게 이해할 수 있도록 핵심 명리학 용어를 쉬운 언어로 풀이합니다.</p>
          <h2>주요 사주 용어</h2>
          <ul>
            <li>천간(天干): 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)의 10가지 하늘의 기운</li>
            <li>지지(地支): 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)의 12가지 땅의 기운</li>
            <li>오행(五行): 목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기본 에너지</li>
            <li>십신(十神): 비겁, 식상, 재성, 관성, 인성의 다섯 가지 관계를 음양으로 나눈 열 가지 개념</li>
            <li>대운(大運): 10년 단위로 변화하는 운의 큰 흐름</li>
            <li>세운(歲運): 해마다 변화하는 운의 흐름</li>
          </ul>
        </section>
      `,
      services: [
        { href: '/guide', label: '운세 칼럼' },
        { href: '/manselyeok', label: '만세력 분석' },
      ]
    },
    '/naming': {
      title: "무료 작명소 | 사주로 짓는 아이 이름 추천 - 무운",
      description: "작명소 방문 없이 무료로. 사주 오행 분석부터 81수리 길흉 검증까지, 아이의 생년월일만 입력하면 한자 이름과 영어 이름을 함께 추천해드립니다.",
      h1: "무료 작명소 - 사주로 짓는 아이 이름 추천",
      bodyContent: `
        <section>
          <h2>무운 무료 작명소란? - 회원가입 없이 무료로 이용</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 100% 무료로 이용하는 사주 맞춤 작명 서비스입니다. 무운 작명소는 아기의 사주팔자(四柱八字) 오행 분석과 전통 성명학의 81수리(數理) 이론을 결합하여, 아이에게 가장 잘 맞는 이름 후보를 자동으로 추천합니다.</p>
          <h2>작명 원리 - 81수리 성명학</h2>
          <p>성명학(姓名學)에서는 이름의 획수(劃數)가 가진 수리(數理)가 운명에 영향을 미친다고 봅니다. 무운 작명소는 원격(元格)·형격(亨格)·이격(利格)·정격(貞格) 4격이 모두 길수(吉數)인 이름만 추천합니다.</p>
          <ul>
            <li>원격(元格): 이름 두 글자의 획수 합 - 초년운(初年運)</li>
            <li>형격(亨格): 성씨와 이름 첫째 글자의 획수 합 - 청년운(靑年運)</li>
            <li>이격(利格): 성씨와 이름 둘째 글자의 획수 합 - 장년운(壯年運)</li>
            <li>정격(貞格): 성씨와 이름 두 글자의 획수 합 - 말년운(末年運)</li>
          </ul>
          <h2>사주 오행 맞춤 한자 선정</h2>
          <p>아기의 생년월일시로 사주팔자를 분석하여 부족한 오행(五行)을 파악하고, 해당 오행의 기운을 보완하는 한자를 우선 추천합니다. 대법원 인명용 한자 5,382자 중에서 선별합니다.</p>
          <h2>음운 조화 검토</h2>
          <p>성씨와 이름의 초성 오행이 상생(相生) 관계를 이루는지 확인하고, 사(死)·궀(鬼) 등 기피 발음을 자동으로 필터링합니다.</p>
          <h2>어떻게 이름을 추천하나요?</h2>
          <ol>
            <li>STEP 1 사주팔자 분석: 아이가 태어난 연·월·일·시를 8개의 한자로 풀어냅니다. 목·화·토·금·수 다섯 가지 기운 중 어떤 것이 부족한지 파악하고, 이름은 그 부족한 기운을 채워주는 방향으로 짓습니다.</li>
            <li>STEP 2 한자 선별: 대법원이 인명용으로 허가한 한자 중에서 뜻이 좋고 실제 이름에 쓰이는 한자만 추려낸 검증된 풀로 후보를 만듭니다. 부정적인 뜻, 어두운 의미의 한자는 구조적으로 배제됩니다.</li>
            <li>STEP 3 81수리 검증: 성과 이름의 획수 조합에서 나오는 네 가지 격(원·형·이·정)을 81수리 길흉표와 대조합니다. 네 가지 격이 모두 길수인 조합만 최종 후보로 올라옵니다.</li>
            <li>STEP 4 최종 추천: 오행 보완, 수리 길흉, 발음 조화, 성별 어울림을 종합 채점해 점수가 높은 순서로 이름 후보를 보여드립니다.</li>
            <li>STEP 5 영어 이름 추천: 한자 이름이 정해지면, 발음과 느낌이 어울리는 영어 이름도 함께 추천해드립니다.</li>
          </ol>
          <p>한자 이름부터 영어 이름까지, 아이의 이름을 한 번에 완성하세요.</p>
        </section>
        <form aria-label="작명 입력 폼">
          <fieldset>
            <legend>아기 정보 입력</legend>
            <label for="nm-surname">성(姓)</label>
            <input id="nm-surname" type="text" name="surname" placeholder="성씨 (예: 김)" autocomplete="off" maxlength="2" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남아</label>
            <label><input type="radio" name="gender" value="female" /> 여아</label>
            <label for="nm-birth">생년월일</label>
            <input id="nm-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="nm-time">태어난 시간</label>
            <select id="nm-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">이름 추천받기</button>
        </form>
      `,
      services: [
        { href: '/lifelong-saju', label: '평생 사주 분석' },
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/compatibility', label: '궁합 분석' },
      ]
    },
    '/naming-service': {
      title: "전문 작명 서비스 - 사주 맞춤 이름 추천 | 무운",
      description: "사주 오행과 81수리 성명학을 결합한 전문 작명 서비스. 아기 이름, 개명, 상호명까지 생년월일 기반으로 최적의 이름을 추천합니다.",
      h1: "전문 작명 서비스",
      bodyContent: `
        <section>
          <h2>무운 작명 서비스란?</h2>
          <p>사주팔자(四柱八字) 오행 분석과 전통 성명학의 81수리(數理) 이론을 결합하여, 아이에게 가장 잘 맞는 이름 후보를 자동으로 추천하는 전문 작명 서비스입니다. 아기 이름, 개명, 상호명 등 다양한 작명 목적에 맞춰 이용하실 수 있습니다.</p>
          <h2>작명 서비스 특징</h2>
          <ul>
            <li>사주 오행 보완: 부족한 오행을 채워주는 한자 우선 추천</li>
            <li>81수리 길흉 검증: 원격·형격·이격·정격 4격 모두 길수인 이름만 추천</li>
            <li>대법원 인명용 한자: 5,382자 중 선별된 검증된 한자 사용</li>
            <li>음운 조화 검토: 성씨와 이름의 초성 오행 상생 관계 확인</li>
          </ul>
        </section>
        <form aria-label="작명 서비스 입력 폼">
          <fieldset>
            <legend>작명 정보 입력</legend>
            <label for="ns-surname">성(姓)</label>
            <input id="ns-surname" type="text" name="surname" placeholder="성씨 (예: 김)" autocomplete="off" maxlength="2" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남아</label>
            <label><input type="radio" name="gender" value="female" /> 여아</label>
            <label for="ns-birth">생년월일</label>
            <input id="ns-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="ns-time">태어난 시간</label>
            <select id="ns-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">이름 추천받기</button>
        </form>
      `,
      services: [
        { href: '/naming', label: '무료 작명소' },
        { href: '/baby-naming', label: '아기 작명' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
      ]
    },
    '/baby-naming': {
      title: "무료 아기 작명 - 사주로 짓는 신생아 이름 추천 | 무운",
      description: "신생아 아기 이름을 사주 오행과 81수리 성명학으로 추천합니다. 회원가입 없이 생년월일만 입력하면 한자 이름과 영어 이름을 함께 추천해드립니다.",
      h1: "무료 아기 작명 - 신생아 이름 추천",
      bodyContent: `
        <section>
          <h2>아기 작명이란?</h2>
          <p>아기의 생년월일시로 사주팔자를 분석하여 부족한 오행(五行)을 파악하고, 해당 오행의 기운을 보완하는 한자를 우선 추천하는 신생아 이름 추천 서비스입니다. 81수리 성명학의 원격·형격·이격·정격 4격이 모두 길수인 이름만 추천합니다.</p>
          <h2>아기 작명 방법</h2>
          <ul>
            <li>성씨와 아기의 생년월일 입력</li>
            <li>사주팔자 오행 분석으로 보완할 기운 파악</li>
            <li>81수리 검증을 통과한 길한 이름 후보 추천</li>
            <li>한자 이름과 영어 이름 동시 추천</li>
          </ul>
        </section>
        <form aria-label="아기 작명 입력 폼">
          <fieldset>
            <legend>아기 정보 입력</legend>
            <label for="bn-surname">성(姓)</label>
            <input id="bn-surname" type="text" name="surname" placeholder="성씨 (예: 김)" autocomplete="off" maxlength="2" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남아</label>
            <label><input type="radio" name="gender" value="female" /> 여아</label>
            <label for="bn-birth">생년월일</label>
            <input id="bn-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="bn-time">태어난 시간</label>
            <select id="bn-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">아기 이름 추천받기</button>
        </form>
      `,
      services: [
        { href: '/naming', label: '무료 작명소' },
        { href: '/naming-service', label: '전문 작명 서비스' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
      ]
    },
    '/monthly-fortune': {
      title: "무료 이달의 운세 - 회원가입 없이 이번 달 운세 확인 | 무운 (MuUn)",
      description: "회원가입 없이 생년월일만 입력하면 바로 확인하는 무료 이달의 운세. 사주팔자를 기반으로 이번 달 총운·재물운·애정운·건강운을 개인정보 저장 없이 100% 무료로 제공합니다.",
      h1: "무료 이달의 운세",
      bodyContent: `
        <section>
          <h2>이달의 운세란? - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 생년월일만 입력하면 바로 확인하는 무료 이달의 운세 서비스입니다. 사주팔자(四柱八字)와 이번 달의 월운(月運)을 결합하여 개인별 맞춤 월간 운세를 제공합니다.</p>
          <h2>이달의 운세에서 확인할 수 있는 내용</h2>
          <ul>
            <li>이달의 총운(總運): 이번 달 전반적인 운세의 흐름</li>
            <li>재물운(財物運): 이번 달 금전 운세와 투자 적합도</li>
            <li>애정운(愛情運): 이번 달 연애 및 인간관계 운세</li>
            <li>건강운(健康運): 이번 달 주의해야 할 건강 포인트</li>
            <li>직업운(職業運): 이번 달 직장 및 사업 운세</li>
          </ul>
        </section>
        <form aria-label="이달운세 입력 폼">
          <fieldset>
            <legend>생년월일 입력</legend>
            <label for="mf-name">이름</label>
            <input id="mf-name" type="text" name="name" placeholder="이름" autocomplete="off" />
            <label>성별</label>
            <label><input type="radio" name="gender" value="male" /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
            <label for="mf-birth">생년월일</label>
            <input id="mf-birth" type="text" name="birthDate" placeholder="YYYY. MM. DD" />
            <label for="mf-time">태어난 시간</label>
            <select id="mf-time" name="birthTime">
              <option value="">모름 / 미입력</option>
              <option value="23:31">자시 (23:31~01:30)</option>
              <option value="01:31">축시 (01:31~03:30)</option>
              <option value="03:31">인시 (03:31~05:30)</option>
              <option value="05:31">묘시 (05:31~07:30)</option>
              <option value="07:31">진시 (07:31~09:30)</option>
              <option value="09:31">사시 (09:31~11:30)</option>
              <option value="11:31">오시 (11:31~13:30)</option>
              <option value="13:31">미시 (13:31~15:30)</option>
              <option value="15:31">신시 (15:31~17:30)</option>
              <option value="17:31">유시 (17:31~19:30)</option>
              <option value="19:31">술시 (19:31~21:30)</option>
              <option value="21:31">해시 (21:31~23:30)</option>
            </select>
            <label>양력/음력</label>
            <label><input type="radio" name="calendarType" value="solar" checked /> 양력</label>
            <label><input type="radio" name="calendarType" value="lunar" /> 음력</label>
          </fieldset>
          <button type="submit">이달운세 보기</button>
        </form>
      `,
      services: [
        { href: '/daily-fortune', label: '오늘의 운세' },
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/lifelong-saju', label: '평생 사주 분석' },
      ]
    },
    '/lucky-lunch': {
      title: "무료 오늘의 행운 점심 메뉴 추천 - 회원가입 없이 사주 오행 기반 추천 | 무운 (MuUn)",
      description: "회원가입 없이 바로 확인하는 무료 오늘의 행운 점심 메뉴. 사주 오행을 기반으로 오늘 나에게 행운을 가져다줄 점심 메뉴를 개인정보 저장 없이 100% 무료로 추천합니다.",
      h1: "무료 오늘의 행운 점심 메뉴",
      bodyContent: `
        <section>
          <h2>오행(五行)으로 보는 행운의 음식 - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 100% 무료로 확인하는 오늘의 행운 점심 메뉴 추천 서비스입니다. 동양 명리학에서는 음식도 오행(五行)의 기운을 담고 있다고 봅니다. 오늘의 일진(日辰)과 나의 사주 오행을 분석하여, 오늘 하루 나에게 가장 좋은 기운을 불어넣어 줄 점심 메뉴를 추천합니다.</p>
          <h2>오행별 음식의 특성</h2>
          <ul>
            <li>목(木): 신맛 음식, 녹색 채소류 - 간(肝)을 보하고 창의력을 높임</li>
            <li>화(火): 쓴맛 음식, 붉은 식재료 - 심장(心臟)을 보하고 활력을 높임</li>
            <li>토(土): 단맛 음식, 노란 식재료 - 비위(脾胃)를 보하고 안정감을 높임</li>
            <li>금(金): 매운맛 음식, 흰색 식재료 - 폐(肺)를 보하고 집중력을 높임</li>
            <li>수(水): 짠맛 음식, 검은 식재료 - 신장(腎臟)을 보하고 지혜를 높임</li>
          </ul>
        </section>
      `,
      services: [
        { href: '/daily-fortune', label: '오늘의 운세' },
        { href: '/tarot', label: '타로 상담' },
      ]
    },
    '/about': {
      title: "무운 소개 - 회원가입 없이 100% 무료 사주·운세 서비스 | 무운 (MuUn)",
      description: "무운(MuUn)은 회원가입 없이, 개인정보 저장 없이, 생년월일만으로 이용하는 100% 무료 사주·운세 서비스입니다. 30년 경력 역술인의 전문 지식을 바탕으로 만들었습니다.",
      h1: "무운 소개 - 회원가입 없는 100% 무료 사주 서비스",
      bodyContent: `
        <section>
          <h2>무운(MuUn)을 소개합니다</h2>
          <p>무운(MuUn)은 30년 경력 역술인의 전문 지식을 바탕으로 만든 100% 무료 사주·운세 서비스입니다. '무운(無運)'이라는 이름은 '운에 얽매이지 않는다'는 철학을 담고 있습니다. 운명을 아는 것은 운명에 지배당하기 위해서가 아니라, 더 현명하게 삶을 개척하기 위해서입니다.</p>
          <h2>무운의 철학</h2>
          <p>무운은 세 가지 원칙을 지킵니다. 첫째, 회원가입이 필요 없습니다. 둘째, 개인정보를 서버에 저장하지 않습니다. 셋째, 모든 서비스가 100% 무료입니다. 사주와 운세는 모든 사람이 쉽게 접근할 수 있어야 한다고 믿습니다.</p>
          <h2>무운의 서비스</h2>
          <p>무운은 사주풀이, 신년운세, 만세력, 궁합, 가족사주, 토정비결, 타로, 꿈해몽, 서양 점성술 등 다양한 운세 서비스를 제공합니다. 30년 내공의 역술인이 직접 검증한 알고리즘을 기반으로, 정확하고 신뢰할 수 있는 운세 풀이를 제공합니다.</p>
        </section>
      `,
      services: [
        { href: '/', label: '홈으로' },
        { href: '/contact', label: '문의하기' },
      ]
    },
    '/contact': {
      title: "문의하기 - 무운 (MuUn)",
      description: "무운 서비스에 대한 문의, 제안, 피드백을 남겨주세요.",
      h1: "문의하기",
      services: [
        { href: '/about', label: '무운 소개' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/privacy': {
      title: "개인정보처리방침 - 무운 (MuUn)",
      description: "무운(MuUn) 서비스의 개인정보처리방침입니다.",
      h1: "개인정보처리방침",
      services: [
        { href: '/terms', label: '이용약관' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/terms': {
      title: "이용약관 - 무운 (MuUn)",
      description: "무운(MuUn) 서비스의 이용약관입니다.",
      h1: "이용약관",
      services: [
        { href: '/privacy', label: '개인정보처리방침' },
        { href: '/', label: '홈으로' },
      ]
    },
    '/guide': {
      title: "무료 운세 칼럼 - 회원가입 없이 사주 지혜와 개운법 읽기 | 무운 (MuUn)",
      description: "회원가입 없이 무료로 읽는 사주 운세 칼럼. 30년 내공의 역술인이 전하는 대운 변화, 재물운, 자녀 교육, 개운법 등 실생활에 바로 적용하는 명리학 지혜를 100% 무료로 제공합니다.",
      h1: "무료 운세 칼럼 - 사주 지혜와 개운법",
      bodyContent: `
        <section>
          <h2>무운 운세 칼럼이란? - 회원가입 없이 무료로 읽기</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 100% 무료로 읽을 수 있는 사주 명리학 전문 칼럼 시리즈입니다. 무운 운세 칼럼은 30년 내공의 역술인이 직접 집필한 사주 명리학 전문 칼럼 시리즈입니다. 어렵고 딱딱하게 느껴지는 사주 이론을 실생활에 바로 적용할 수 있는 쉽고 실용적인 내용으로 풀어냅니다.</p>
          <h2>칼럼 주요 주제</h2>
          <ul>
            <li>대운(大運) 변화: 인생의 큰 흐름이 바뀌는 시기와 징조</li>
            <li>재물운 높이는 법: 사주 오행을 활용한 재물운 개선 방법</li>
            <li>자녀 교육과 사주: 아이의 사주에 맞는 교육 환경 조성법</li>
            <li>직업과 사주: 사주 오행별 적성에 맞는 직업 가이드</li>
            <li>가족 관계와 사주: 가족 간의 오행 조화를 이용한 관계 개선</li>
            <li>개운법(開運法): 나쁜 운을 극복하고 좋은 운을 불러오는 방법</li>
          </ul>
        </section>
      `,
      services: [
        { href: '/guide/luck-2026-daeun-change-b0d87c9e', label: '2026년 대운 변화: 당신의 운명이 바뀌는 시기를 미리 알아보세요' },
        { href: '/guide/luck-fortune-breakthrough-cef1d14a', label: '막혔던 운의 고속도로를 뻥 뚫어주는 세 가지 마법의 습관' },
        { href: '/guide/fortune-flow-2026-second-half-caution-e347d445', label: '2026년 하반기, \'이것\' 세 가지만 조심하면 평안합니다' },
        { href: '/guide/luck-room-cleaning-83c59830', label: '내 방 청소만 잘해도 막힌 운이 술술 풀리는 이유' },
        { href: '/guide/luck-fortune-secret-307e549f', label: '메마른 땅에 단비가 내리듯 당신의 인생을 촉촉하게 적셔줄 운의 비밀' },
      ]
    },
    '/guide/fortune-flow-2026-second-half-caution-e347d445': {
      title: "2026년 하반기 운세, 꼭 조심해야 할 3가지 주의사항 | 무운 (MuUn)",
      description: "병오년(붉은 말의 해) 하반기에 닥칠 수 있는 위험을 피하는 지혜를 나눕니다. 성급한 결정, 인간관계의 다툼, 무리한 투자 등 30년 경력 역술인의 조언.",
      h1: "2026년 하반기, '이것' 세 가지만 조심하면 평안합니다"
    },
    '/guide/luck-room-cleaning-83c59830': {
      title: "내 방 청소로 막힌 운 뚫기: 풍수 개운법 | 무운 (MuUn)",
      description: "인생이 안 풀릴 때 실천할 수 있는 가장 쉬운 방법인 주변 정리법을 소개합니다. 현관 청소와 물건 비우기를 통해 막힌 운을 뚫고 행운을 맞이하는 비결.",
      h1: "내 방 청소만 잘해도 막힌 운이 술술 풀리는 이유"
    },
    '/guide/luck-fortune-secret-307e549f': {
      title: "운이 좋아지는 비결: 30년 역술인이 알려주는 개운법 | 무운 (MuUn)",
      description: "30년 경력의 역술인이 알려주는 운이 좋아지는 비결입니다. 청소, 미소, 긍정적인 말하기 등 일상에서 바로 실천할 수 있는 쉬운 방법으로 당신의 운을 바꾸세요.",
      h1: "메마른 땅에 단비가 내리듯 당신의 인생을 촉촉하게 적셔줄 운의 비밀"
    },
    '/guide/luck-fortune-breakthrough-cef1d14a': {
      title: "안 풀리는 인생을 바꾸는 쉬운 개운법 3가지 | 무운 (MuUn)",
      description: "운을 바꾸는 것은 거창한 것이 아닙니다. 현관 청소, 긍정적인 말 습관, 아침 햇볕 쬐기 등 일상에서 바로 실천할 수 있는 30년 경력 역술인의 개운법.",
      h1: "막혔던 운의 고속도로를 뻥 뚫어주는 세 가지 마법의 습관"
    },
    '/guide/luck-2026-daeun-change-b0d87c9e': {
      title: "2026년 대운 변화 시기 확인법과 인생 역전 준비하기 | 무운 (MuUn)",
      description: "10년마다 바뀌는 대운의 원리와 2026년 병오년의 특성을 통해, 운의 교체기에 나타나는 징조와 대박 운을 잡기 위한 구체적인 개운법을 알려드립니다.",
      h1: "2026년 대운 변화: 당신의 운명이 바뀌는 시기를 미리 알아보세요"
    },
    '/guide/family-family-communication-90b3867b': {
      title: "가족 갈등 해결 사주 처방: 비겁의 충돌과 화합의 기술 | 무운 (MuUn)",
      description: "집에서 느끼는 소외감과 잦은 다툼, 사주 속 비겁의 경쟁 때문일 수 있습니다. 식상을 활용한 소통법과 거실 풍수로 화목한 가정을 만드세요.",
      h1: "가족 간의 대화가 단절되고 고립감을 느낄 때 점검해야 할 비겁의 충돌"
    },
    '/guide/money-new-business-d972ab00': {
      title: "사업 확장 전 필수 사주 체크: 식신생재와 대운의 흐름 | 무운 (MuUn)",
      description: "사업을 키워야 할 때와 멈춰야 할 때를 명확히 구분하세요. 사주 속 식신과 재성의 관계를 통해 본 성공적인 사업 확장 전략.",
      h1: "신규 사업이나 확장을 고민할 때 반드시 살펴야 할 식신생재의 동력"
    },
    '/guide/fortune-flow-gossip-slander-bc420b12': {
      title: "구설수 퇴치 사주 비결: 상관의 살성을 잠재우는 법 | 무운 (MuUn)",
      description: "억울한 비난과 오해로 힘드시나요? 사주 속 상관과 관성의 충돌을 이해하고, 구설을 막아주는 인성 개운법으로 명예를 지키세요.",
      h1: "구설수와 비방이 끊이지 않을 때 확인해야 할 상관의 돌출과 대처법"
    },
    '/guide/money-contract-deal-7ce3dbac': {
      title: "집 안 팔릴 때 보는 사주: 매매운과 문서운 강화법 | 무운 (MuUn)",
      description: "부동산 매매와 계약이 자꾸 미뤄지시나요? 사주 속 인성의 상태를 확인하고 막힌 매매운을 뚫어주는 명리학적 처방을 확인하세요.",
      h1: "문서 계약이나 매매가 자꾸 성사되지 않을 때 점검해야 할 인성의 고립"
    },
    '/guide/relation-bad-relationship-da1a0ab3': {
      title: "악연을 끊고 귀인을 만나는 사주 비법: 인맥 개운 전략 | 무운 (MuUn)",
      description: "주변 사람 때문에 힘들다면 사주 궁합을 확인하세요. 나를 돕는 귀인을 부르고 악연을 정리하는 명리학적 인연 관리법.",
      h1: "새로운 인연이 자꾸 나를 힘들게 할 때 점검해야 할 악연의 사주 구조"
    },
    '/guide/career-exam-failure-e55e0eda': {
      title: "시험 합격 사주 비결: 관인상생과 재극인 방지법 | 무운 (MuUn)",
      description: "공부한 만큼 성적이 안 나오시나요? 사주 속 합격의 기운인 관성과 인성을 체크하고, 집중력을 높여주는 명리학적 개운법을 확인하세요.",
      h1: "시험이나 자격증 취득이 자꾸 미끄러질 때 확인해야 할 관인상생의 단절"
    },
    '/guide/fortune-flow-project-failure-56c631ee': {
      title: "일이 자꾸 엎어질 때: 사주 공망과 파살 극복 전략 | 무운 (MuUn)",
      description: "노력해도 성과가 없는 이유, 혹시 공망운 때문인가요? 허무한 실패를 막고 마무리를 성공으로 이끄는 명리학적 대안.",
      h1: "공들인 프로젝트가 막판에 엎어질 때 확인해야 할 공망과 파살"
    },
    '/guide/health-baekhosal-yangsal-b9d9fef4': {
      title: "갑작스러운 질병과 사고 예방: 사주 살성 다스리는 법 | 무운 (MuUn)",
      description: "건강 운이 꺾이는 시기, 내 사주 속 백호살과 양인살을 체크하세요. 식신을 활용한 건강 회복법과 오행 생활 수칙.",
      h1: "유독 건강이 악화되는 해에 점검해야 할 백호살과 양인살의 준동"
    },
    '/guide/relation-couple-personality-93c37cd5': {
      title: "부부 싸움 멈추는 사주 처방: 일지 충과 형 다스리기 | 무운 (MuUn)",
      description: "성격 차이로 힘든 부부를 위한 명리학 가이드. 지지 충의 충돌을 완화하고 오행의 조화로 화목한 가정을 만드는 비결.",
      h1: "부부의 성격 차이가 극한으로 치달을 때 확인해야 할 일지 충과 형"
    },
    '/guide/money-wealth-leak-2ab03b7e': {
      title: "재물운 높이는 지갑 개운법: 사주 쟁재 현상 방어하기 | 무운 (MuUn)",
      description: "벌어도 돈이 안 모이는 사주라면? 군겁쟁재를 막고 재물을 지키는 문서화 전략과 오행 맞춤 지갑 선택법을 공개합니다.",
      h1: "재물운이 새나가는 쟁재(爭財) 현상을 막는 지갑 관리와 오행 보완법"
    },
    '/guide/career-promotion-blocked-727184d9': {
      title: "승진운 사주 분석: 직장 내 명예운 높이는 개운 비결 | 무운 (MuUn)",
      description: "실적은 좋은데 승진만 안 된다면? 사주 속 관성과 인성의 조화를 체크하세요. 명예운을 부르는 사무실 풍수와 오행 처방법.",
      h1: "승진 기회에서 번번이 밀릴 때 확인해야 할 관성과 인성의 불균형"
    },
    '/guide/health-menopause-depression-ba837dd6': {
      title: "갱년기 우울증 극복을 위한 사주 조후 상담 | 무운 (MuUn)",
      description: "무기력하고 우울한 마음, 내 사주의 계절이 바뀌고 있기 때문입니다. 오행의 조화를 통한 심리 회복과 실전 개운법.",
      h1: "갱년기 우울증과 무기력증이 깊어질 때의 명리학적 조후 처방"
    },
    '/guide/family-children-career-10175e9d': {
      title: "자녀 진로 상담: 사주 격국과 월령으로 찾는 천직 | 무운 (MuUn)",
      description: "자녀의 적성이 고민되시나요? 사주 원국의 격과 월령을 분석하여 아이가 가장 잘 할 수 있는 성공의 길을 열어주세요.",
      h1: "자녀의 진로 결정이 막막할 때 참고해야 할 월령과 격국의 힘"
    },
    '/guide/relation-business-partner-conflict-ca1d4df6': {
      title: "동업자 갈등 해결법: 사주 형살과 원진살 중재하기 | 무운 (MuUn)",
      description: "파트너와의 반복되는 싸움, 사주 지지의 형살 때문일 수 있습니다. 명리학으로 분석하는 상생의 협력 모델과 갈등 해소 전략.",
      h1: "사업 파트너와 사사건건 부딪힐 때 점검해야 할 지지 형살과 원진"
    },
    '/guide/career-startup-item-d1cb52ab': {
      title: "나에게 맞는 창업 아이템 찾기: 오행별 추천 업종 분석 | 무운 (MuUn)",
      description: "창업 전 필수 체크! 사주 오행에 맞는 사업 아이템으로 성공 확률을 높이세요. 대운에 따른 사업 확장 시기와 개운 전략 공개.",
      h1: "창업 아이템 선정이 고민될 때 확인해야 할 본인의 오행과 직업운"
    },
    '/guide/family-inheritance-conflict-0440c2eb': {
      title: "상속 분쟁과 형제 갈등: 사주 겁재를 다스리는 법 | 무운 (MuUn)",
      description: "유산 상속 후 깨진 형제 우애, 사주 속 겁재의 영향 때문일까요? 명리학으로 푸는 재산 분쟁 해결책과 가족운 회복 비결.",
      h1: "상속이나 증여 후 형제간의 불화가 깊어지는 명리학적 원인과 처방"
    },
    '/guide/money-pyeonjae-f34b5d66': {
      title: "주식 투자 실패 사주로 분석하기: 편재와 정재의 차이 | 무운 (MuUn)",
      description: "반복되는 투자 손실, 내 사주에 돈을 지키는 힘이 부족한 걸까요? 편재의 위험성과 정재의 안정감을 활용한 자산 관리 개운법.",
      h1: "투자 손실이 반복될 때 점검해야 할 편재의 허망함과 정재의 안정감"
    },
    '/guide/love-marriage-boredom-f6ab0c92': {
      title: "부부 권태기 극복 사주 비법: 원진살과 애정운 회복 | 무운 (MuUn)",
      description: "이유 없는 부부 갈등과 권태기, 사주 속 원진살 때문일 수 있습니다. 오행의 조화와 풍수 처방으로 다시 설레는 부부 관계를 만드세요.",
      h1: "결혼 생활의 권태기가 유독 길어질 때 확인해야 할 일지 원진살"
    },
    '/guide/money-inheritance-complex-caf5b63a': {
      title: "상속 분쟁 피하는 사주 분석: 편인과 겁재 다스리기 | 무운 (MuUn)",
      description: "유산 상속이나 증여가 꼬이는 명리학적 이유. 편인의 도식과 겁재의 쟁재를 막아 소중한 재산을 지키는 개운법을 확인하세요.",
      h1: "유독 상속이나 증여 문제가 복잡하게 꼬이는 사주상 편인과 겁재의 작용"
    },
    '/guide/career-workplace-relationship-d5779d29': {
      title: "직장 구설수 탈출법: 사주 비겁과 관성 다스리기 | 무운 (MuUn)",
      description: "동료와의 갈등과 시기 질투, 사주 속 비겁의 혼잡이 원인일 수 있습니다. 관성과 인성을 활용해 평온한 직장 생활을 만드는 비결.",
      h1: "직장 내 인간관계가 꼬일 때 점검해야 할 비겁의 쟁투와 관성의 유무"
    },
    '/guide/family-children-study-c0e4bb92': {
      title: "공부 안 하는 아이 사주 분석: 재극인 탈출과 집중력 강화 | 무운 (MuUn)",
      description: "자녀 성적 정체의 명리학적 이유. 사주 속 인성과 재성의 충돌을 해결하고 아이에게 맞는 최적의 학습 환경을 만들어주세요.",
      h1: "공부 효율이 오르지 않는 자녀를 위한 사주상 인성과 식상의 조절"
    },
    '/guide/money-partnership-money-c818fa3e': {
      title: "동업 사주 궁합: 실패하지 않는 비즈니스 파트너 찾기 | 무운 (MuUn)",
      description: "동업할 때 꼭 봐야 할 사주 특징. 비겁의 유불리와 재물 분배의 흐름을 분석하여 성공적인 사업 파트너십을 구축하세요.",
      h1: "동업을 고민 중이라면 반드시 확인해야 할 비겁과 재성의 관계"
    },
    '/guide/love-short-relationship-097407a0': {
      title: "금방 끝나는 연애, 내 사주 속 이별 살이 원인일까? | 무운 (MuUn)",
      description: "반복되는 이별의 명리학적 이유. 사주 일지의 충과 식상 과다를 다스려 안정적인 연애와 결혼 운을 여는 법을 알려드립니다.",
      h1: "연애가 매번 짧게 끝날 때 점검해야 할 일지와 식상의 과다"
    },
    '/guide/luck-new-home-moving-2ae23407': {
      title: "이사 후 재수 없는 이유? 사주 방위와 살성 확인법 | 무운 (MuUn)",
      description: "새집 이사 후 계속되는 우환, 혹시 이사 방향이 잘못된 건 아닐까요? 명리학으로 푸는 방위 개운법과 흉운 차단 비결.",
      h1: "새집 이사 후 우환이 겹칠 때 체크해야 할 방위와 합충의 변화"
    },
    '/guide/health-retirement-preparation-d266d217': {
      title: "평안한 노후를 위한 명리학 가이드: 인성과 식상의 조화 | 무운 (MuUn)",
      description: "노후 불안을 해소하는 사주 분석법. 인성의 안정감과 식상의 생명력을 높여 건강하고 풍요로운 노년을 준비하세요.",
      h1: "노후 준비가 불안할 때 확인해야 할 인성과 식상의 노년기 흐름"
    },
    '/guide/relation-jaengjae-e7afb912': {
      title: "부부 돈 싸움 해결법: 군겁쟁재 사주 극복하기 | 무운 (MuUn)",
      description: "벌어도 돈이 모이지 않는 부부라면? 사주 속 군겁쟁재 현상을 파악하고 재물운을 지키는 명리학적 대안을 확인하세요.",
      h1: "부부 사이의 경제적 갈등을 해결하는 사주상 군겁쟁재 다스리기"
    },
    '/guide/career-reemployment-blocked-51b24cc7': {
      title: "재취업 성공을 위한 명리 분석: 관인상생과 이직운 | 무운 (MuUn)",
      description: "계속되는 취업 낙방, 사주 속 관성과 인성의 조화를 체크하세요. 합격운을 높이는 오행 개운법과 면접 팁을 공개합니다.",
      h1: "재취업이나 이직이 자꾸 어긋날 때 점검해야 할 관성과 인성의 균형"
    },
    '/guide/family-children-conflict-045f10df': {
      title: "자녀 갈등 해결을 위한 명리 분석: 상관견관 다스리기 | 무운 (MuUn)",
      description: "자녀와의 반복되는 싸움, 사주 속 상관과 관성의 충돌이 원인일 수 있습니다. 오행의 원리로 푸는 자녀 교육과 관계 회복 비법.",
      h1: "자녀와의 갈등이 심해질 때 확인해야 할 사주상 상관견관의 원리"
    },
    '/guide/health-pyeongwan-pressure-4cef87ed': {
      title: "무기력증과 만성피로, 사주 속 편관을 다스리는 법 | 무운 (MuUn)",
      description: "이유 없는 몸의 통증과 스트레스는 사주상 편관의 공격 때문일 수 있습니다. 인성과 식신을 활용한 건강 회복 개운법을 확인하세요.",
      h1: "갑자기 몸이 무겁고 무기력할 때 의심해야 할 편관의 압박과 극복법"
    },
    '/guide/money-self-employed-sales-c67535fb': {
      title: "자영업 불황 극복을 위한 명리학적 매출 상승 비결 | 무운 (MuUn)",
      description: "갑자기 떨어진 매출, 사주 속 식상과 재성의 흐름만 바꿔도 살아납니다. 실전 개운법으로 사업 운을 전환하세요.",
      h1: "자영업 매출이 급격히 줄어들 때 점검해야 할 식상과 재성의 흐름"
    },
    '/guide/family-children-late-blessing-d737dc22': {
      title: "자식운 사주 풀이, 말년에 자식 덕 보는 팔자 특징 | 무운 (MuUn)",
      description: "자녀 문제로 고민하는 4060 세대를 위한 명리 전문가의 따뜻한 조언. 늦게 피는 자식 복과 부모 자식 간의 운명을 쉽게 풀어드립니다.",
      h1: "자식운 사주 풀이, 말년에 자식 덕 보는 팔자 특징"
    },
    '/guide/money-empty-wallet-13d60396': {
      title: "돈 복 터지는 사주 특징과 재물운 높이는 확실한 방법 5가지 | 무운 (MuUn)",
      description: "나만 왜 돈이 안 모일까 고민이라면? 30년 경력 마스터 역술인이 알려주는 재물운 좋아지는 법과 사주 속 부자 되는 시기를 알아보세요.",
      h1: "텅 빈 지갑이 두둑해지는 비결, 내 사주에 숨어있는 황금 열쇠 찾기"
    },
    '/guide/love-late-love-40s-5a0ac9d7': {
      title: "중년 재혼운과 연애운, 50대 60대에게도 다시 봄날이 올까요? | 무운 (MuUn)",
      description: "늦은 나이라고 포기하지 마세요. 30년 경력 역술인이 알려주는 중년 연애와 결혼운의 비밀, 내 진정한 짝을 만나는 법을 쉽고 다정하게 들려드립니다.",
      h1: "늦게 찾아온 인연이 더 아름다운 이유, 마흔 이후에 시작되는 진짜 사랑 이야기"
    },
    '/guide/money-wealth-control-63d84616': {
      title: "돈 들어오는 사주 따로 있다? 재물운 높이는 풍수와 개운법 총정리 | 무운 (MuUn)",
      description: "재물운이 궁금하신가요? 사주 명리학으로 본 돈을 부르는 징조와 지갑 관리법 등 일상에서 바로 실천할 수 있는 재테크 개운법을 알려드립니다.",
      h1: "돈이 새나가는 사주가 따로 있을까요? 재물운을 꽉 잡는 그릇 키우기"
    },
    '/guide/fortune-flow-late-bloom-fortune-9f61d4e0': {
      title: "말년 복 터지는 사주 특징, 인생 후반기 운세가 좋아지는 비결 3가지 | 무운 (MuUn)",
      description: "고생 끝에 낙이 온다는 말, 사실일까요? 30년 역술인이 알려주는 노년 운세 좋아지는 법과 말년 복을 부르는 마음가짐을 지금 확인해보세요.",
      h1: "젊어서 고생은 사서도 한다지만, 진짜 복은 인생 후반전에 터집니다"
    },
    '/guide/fortune-flow-treasure-map-1024440d': {
      title: "내 인생 대운 언제 바뀔까? 사주로 보는 운세 흐름과 대박 징조 3가지 | 무운 (MuUn)",
      description: "인생이 답답하고 막막한 분들을 위한 사주 명리 멘토링. 대운이 바뀌는 징조를 확인하고 내 사주에 맞는 개운법으로 행운을 불러오는 비결을 알려드립니다.",
      h1: "막막한 인생길, 내 사주의 보물 지도를 펼칠 시간입니다"
    },
    '/guide/love-restart-love-e5d27e20': {
      title: "중년 재혼운과 새로운 인연, 사주로 풀어보는 늦복 터지는 비결 | 무운 (MuUn)",
      description: "다시 사랑하고 싶은 5060을 위한 명리 전문가의 조언. 사주에 숨겨진 만혼운을 찾고, 상처를 치유하며 진정한 동반자를 만나는 법을 알려드립니다.",
      h1: "다시 시작하는 사랑이 더 단단한 이유, 당신의 인연은 이제부터 진짜입니다"
    },
    '/guide/love-late-love-276233a2': {
      title: "내 인연 언제 나타날까? 사주로 보는 결혼운과 진정한 짝 찾는 법 | 무운 (MuUn)",
      description: "인연이 닿지 않아 고민인 분들을 위한 명리 전문가의 다정한 조언. 늦게 만나는 인연이 더 행복한 이유와 내 사주에 맞는 배우자 특징을 확인하세요.",
      h1: "혼자가 편하다가도 문득 외로운 당신에게, 늦게 찾아오는 인연이 진짜 명작입니다"
    },
    '/guide/career-job-success-efcff2d4': {
      title: "취업운 언제 들어올까? 사주 명리로 확인하는 합격 비결과 개운법 | 무운 (MuUn)",
      description: "계속되는 취업 실패로 지친 당신을 위한 사주 명리 조언. 합격운이 들어오는 신호와 면접에서 승리하는 기운 관리법을 알려드립니다.",
      h1: "간절한 취업 소식, 사주로 풀어보는 합격의 문이 열리는 징조"
    },
    '/guide/career-career-change-b57094ba': {
      title: "이직 고민 해결! 사주로 보는 나에게 딱 맞는 취업운과 이직 시기 | 무운 (MuUn)",
      description: "퇴사하고 싶을 때, 이직 운이 있는지 궁금하시죠? 30년 경력 역술인이 알려주는 성공적인 이직 타이밍과 취업운 좋아지는 비법을 확인하세요.",
      h1: "답답한 직장 생활, 이직이 답일까요? 내 운의 때를 찾는 지혜"
    },
    '/guide/fortune-flow-children-blessing-late-231b77df': {
      title: "남편 복 자식 복 사주 극복하기, 5060 여성을 위한 말년 운 개운법 | 무운 (MuUn)",
      description: "가족에게 헌신하느라 지친 어머님들을 위한 사주 명리 멘토링. 자식 복과 남편 복에 연연하지 않고 내 인생의 진정한 복을 찾는 방법을 전합니다.",
      h1: "남편 복 자식 복 없다는 말에 상처받지 마세요, 말년 운이 귀인을 부릅니다"
    },
    '/guide/fortune-flow-late-bloom-golden-ef7596ef': {
      title: "50대 여성 사주 운세 대운 바뀌는 징조와 인생 황금기 찾는 법 | 무운 (MuUn)",
      description: "4050 여성들을 위한 명리 전문가의 따뜻한 조언. 늦게 피는 인생의 황금기와 대운이 들어올 때 나타나는 변화를 확인하고 희망찬 미래를 설계해 보세요.",
      h1: "늦게 피는 꽃이 더 아름답듯 쉰 살 넘어 찾아오는 제2의 인생 황금기 운세"
    },
    '/guide/family-f16e40e9': {
      title: "자식운 사주 풀이와 자녀 고민 해결하는 개운법 | 무운 (MuUn)",
      description: "자녀가 취업이나 결혼이 늦어져 고민이신가요? 30년 경력의 역술인이 전하는 자식 복이 늦게 터지는 사주 이야기와 마음가짐을 확인해보세요.",
      h1: "자식 복이 늦게 터지는 사주, 지금 고생은 보석을 닦는 과정입니다"
    },
    '/guide/health-children-fortune-words-c388f667': {
      title: "자녀 운 터지는 엄마의 습관, 4060 주부를 위한 복 부르는 풍수와 개운법 | 무운 (MuUn)",
      description: "자녀가 안 풀려 고민인가요? 30년 경력 역술인이 알려드리는 집안 운 높이는 비결과 자녀 운을 틔워주는 다정한 조언을 만나보세요.",
      h1: "자녀 운이 풀리는 엄마의 말 한마디, 집안에 복을 부르는 다정한 개운법"
    },
    '/guide/relation-children-education-60781ebe': {
      title: "자녀 사주 풀이와 기운을 살려주는 자녀 교육법 | 무운 (MuUn)",
      description: "30년 경력 역술인이 전하는 자녀 사주 해석과 성향별 교육 비법입니다. 아이의 타고난 기운을 이해하고 복을 부르는 환경 만드는 법을 쉽게 설명해 드립니다.",
      h1: "내 아이의 그릇을 키우는 부모의 지혜, 사주로 보는 자녀 교육의 비밀"
    },
    '/guide/relation-children-fortune-parent-331e43a6': {
      title: "자녀운을 높이는 부모의 지혜와 사주 소통법 | 무운 (MuUn)",
      description: "아이의 타고난 기운을 이해하고 부모와의 갈등을 해소하는 역술적 해법을 담았습니다. 자녀의 재능을 꽃피우고 행복한 관계를 만드는 실질적인 조언을 확인해 보세요.",
      h1: "우리 아이라는 귀한 손님, 자녀운을 꽃피우는 부모의 마음 그릇"
    },
    '/guide/health-body-revival-0659b745': {
      title: "사주로 보는 건강운과 몸의 기운 관리법 | 무운 (MuUn)",
      description: "타고난 체질과 사주 기운을 조율하여 건강을 지키는 비결을 알려드립니다. 오행의 원리를 활용한 음식, 생활 습관, 마음가짐으로 활력을 되찾는 쉬운 가이드입니다.",
      h1: "내 몸의 시든 꽃을 다시 피우는 법, 기운을 살리는 건강 관리"
    },
    '/guide/fortune-flow-fate-spring-db760b73': {
      title: "운이 좋아지는 징조와 대박 운 들어오는 신호 4가지 | 무운 (MuUn)",
      description: "인생의 흐름이 바뀌고 대박 운이 들어오기 직전에 나타나는 사람 관계, 환경, 마음가짐의 변화를 30년 경력 역술인의 시선으로 쉽게 풀어드립니다.",
      h1: "내 운명의 겨울이 끝나고 따스한 봄바람이 불어오는 신호"
    },
    '/guide/fortune-flow-winter-to-spring-90b79a03': {
      title: "대운 들어오는 징조와 운의 흐름 바꾸는 법 | 무운 (MuUn)",
      description: "30년 경력 역술인이 알려주는 운이 좋아질 때 나타나는 5가지 확실한 신호와 일상에서 행운을 부르는 마음가짐을 쉽게 설명해 드립니다.",
      h1: "내 인생의 겨울이 가고 봄이 오는 신호, 운의 흐름을 읽는 지혜"
    },
    '/guide/health-body-energy-fortune-30d117b4': {
      title: "건강과 운세의 상관관계 쉬운 개운법 | 무운 (MuUn)",
      description: "내 몸의 컨디션이 좋아져야 들어오는 복도 잡을 수 있습니다. 일상 속 작은 습관으로 운의 흐름을 바꾸는 건강 개운법을 30년 경력 역술인이 쉽게 알려드립니다.",
      h1: "내 몸의 기운을 살려야 운이 들어올 자리가 생깁니다"
    },
    '/guide/money-wealth-golden-9cb42942': {
      title: "내 인생의 곳간을 황금빛으로 가득 채우는 신비로운 재물운의 비밀 | 무운 (MuUn)",
      description: "30년 경력 역술인이 전하는 재물운을 높이는 3가지 핵심 비결. 지갑 정리부터 말투, 베풂의 지혜를 통해 막혔던 금전의 흐름을 뚫는 구체적인 개운법을 소개합니다.",
      h1: "내 인생의 곳간을 황금빛으로 가득 채우는 신비로운 재물운의 비밀"
    },
    '/guide/relation-golden-age-timing-86759dff': {
      title: "사주 대운이 들어오는 징조와 인생 타이밍 잡는 법 | 무운 (MuUn)",
      description: "인생의 황금기를 맞이하기 위해 꼭 알아야 할 운의 흐름과 징조를 30년 전문가가 쉽게 설명합니다. 내 인생의 계절을 파악하고 기회를 잡는 지혜를 배워보세요.",
      h1: "당신이 몰랐던 인생의 황금기를 부르는 \'운의 타이밍\'"
    },
    '/guide/fortune-flow-fate-magnifier-5ee9d8b5': {
      title: "내 인생의 운을 바꾸는 쉬운 사주 풀이와 개운법 | 무운 (MuUn)",
      description: "30년 경력의 역술인이 알려주는 인생 운 흐름 파악하기. 내 타고난 기운을 이해하고 삶의 매듭을 푸는 지혜를 일상적인 비유로 쉽게 설명합니다.",
      h1: "꽉 막힌 인생의 매듭을 술술 풀이해 주는 운명의 돋보기"
    },
    '/guide/luck-life-habits-7945bc54': {
      title: "운명 바꾸는 법과 막힌 운을 푸는 쉬운 개운법 | 무운 (MuUn)",
      description: "30년 경력 역술인이 알려주는 인생이 풀리는 법. 청소, 말버릇, 표정 관리 등 일상 속에서 바로 실천할 수 있는 쉬운 개운법으로 막힌 운을 뚫어보세요.",
      h1: "막혔던 인생의 매듭을 술술 풀이하는 마법 같은 마음 습관"
    },
    '/guide/saju-basic-saju-study-d9f2e703': {
      title: "사주 기초 공부, 나를 이해하는 인생 나침반 활용법 | 무운 (MuUn)",
      description: "사주팔자를 어렵게 느끼는 분들을 위해 사주 공부가 왜 내 삶을 바꾸는 도구가 되는지 설명합니다. 나라는 사람의 기질을 알고 활용하는 지혜를 배워보세요.",
      h1: "어색했던 사주 공부가 나를 바꾸는 마법 같은 도구가 될 때"
    },
    '/guide/luck-fortune-signs-d70daba9': {
      title: "인생이 잘 풀릴 때 나타나는 징조와 대운 맞이하는 법 | 무운 (MuUn)",
      description: "운이 좋아지기 직전 우리 주변에서 일어나는 신비로운 변화 세 가지를 소개합니다. 청소, 인간관계, 안색의 변화를 통해 내 인생의 황금기를 미리 알아차리는 법을 쉽게 설명해 드립니다.",
      h1: "인생이 잘 풀릴 때 나타나는 징조와 대운 맞이하는 법"
    },
  };

  // 동적 라우트 처리: /yearly-fortune/:birthDate
  let currentMeta = metaData[options.path];
  if (!currentMeta) {
    const yearlyFortuneMatch = options.path.match(/^\/yearly-fortune\/(\d{4}-\d{2}-\d{2})$/);
    const dreamMatch = options.path.match(/^\/dream\/([a-z0-9-]+)$/);
    const guideSlugMatch = options.path.match(/^\/guide\/([a-z0-9-]+)$/);
    const dictionarySlugMatch = options.path.match(/^\/dictionary\/([a-z0-9-]+)$/);
    
    if (yearlyFortuneMatch) {
      const birthDate = yearlyFortuneMatch[1];
      const year = birthDate.split('-')[0];
      currentMeta = {
        title: `${year}년생 2026년 신년운세 - 무운 (MuUn)`,
        description: `${year}년생의 2026년 병오년 신년운세를 무료로 확인하세요. 사주팔자를 기반으로 한 정밀 운세 풀이입니다.`,
        h1: `${year}년생 2026년 신년운세`,
        bodyContent: `
          <section>
            <h2>${year}년생 2026년 신년운세</h2>
            <p>${year}년생의 2026년 병오년(丙午年) 신년운세를 사주팔자(四柱八字) 기반으로 분석합니다. 생년월일을 입력하면 월별 운세, 재물운, 직업운, 애정운을 상세히 확인할 수 있습니다.</p>
          </section>
        `,
        services: [
          { href: '/yearly-fortune', label: '신년운세 홈' },
          { href: '/lifelong-saju', label: '평생 사주 분석' },
        ]
      };
    } else if (dreamMatch) {
      // 꿈해몽 개별 페이지 동적 메타 (한글 키워드 매핑 사용)
      const dreamSlug = dreamMatch[1];
      const dreamInfo = dreamKeywordMap[dreamSlug];
      // dreamKeywordMap에 없는 slug는 404 반환 (Soft 404 방지)
      if (!dreamInfo) {
        return {
          appHtml: '',
          head: {
            title: '<title>페이지를 찾을 수 없습니다 (404) | 무운</title>',
            meta: '<meta name="robots" content="noindex, nofollow">',
            link: '',
          },
          dehydratedState: {},
          statusCode: 404,
        };
      }
      const koreanKeyword = dreamInfo.keyword;
      const dreamMetaTitle = dreamInfo.metaTitle;
      currentMeta = {
        title: `${dreamMetaTitle} | 무운 꿈해몽 사전`,
        description: `${koreanKeyword}에 관한 꿈의 의미와 해석을 알아보세요. 무운 꿈해몽 사전에서 350가지 꿈의 상징과 길흉을 무료로 확인하세요.`,
        h1: `${koreanKeyword} 꿈해몽`,
        bodyContent: `
          <section>
            <h2>${koreanKeyword} 꿈의 의미</h2>
            <p>${koreanKeyword}에 관한 꿈은 다양한 의미를 담고 있습니다. 무운 꿈해몽 사전에서 꿈의 상징과 길흉을 자세히 확인하세요.</p>
          </section>
        `,
        services: [
          { href: '/dream', label: '꿈해몽 사전' },
          { href: '/yearly-fortune', label: '신년운세' },
        ]
      };
    } else if (guideSlugMatch) {
      // 칼럼 slug 기반 페이지 동적 메타 (metaData에 없는 경우 폴백)
      const guideSlug = guideSlugMatch[1];
      currentMeta = {
        title: `사주 칼럼 - ${guideSlug.replace(/-/g, ' ')} | 무운 (MuUn)`,
        description: `무운의 사주 칼럼에서 전문적인 운세 풀이와 개운법을 확인하세요. 30년 내공의 역술인이 전하는 지혜입니다.`,
        h1: guideSlug.replace(/-/g, ' '),
        services: [
          { href: '/guide', label: '운세 칼럼 목록' },
          { href: '/lifelong-saju', label: '평생 사주' },
        ]
      };
    } else if (dictionarySlugMatch) {
      // 운세 사전 개별 페이지 동적 메타 (SEO 최적화)
      const dictSlug = dictionarySlugMatch[1];
      const dictInfo = dictionaryKeywordMap[dictSlug];
      // dictionaryKeywordMap에 없는 slug는 404 반환 (Soft 404 방지)
      if (!dictInfo) {
        return {
          appHtml: '',
          head: {
            title: '<title>페이지를 찾을 수 없습니다 (404) | 무운</title>',
            meta: '<meta name="robots" content="noindex, nofollow">',
            link: '',
          },
          dehydratedState: {},
          statusCode: 404,
        };
      }
      const dictTitle = dictInfo.title;
      const dictCategory = dictInfo.categoryLabel || '운세 사전';
      const dictMetaTitle = dictInfo.metaTitle || `${dictTitle} - 사주팔자 ${dictCategory} 의미와 특성`;
      const dictMetaDesc = dictInfo.metaDescription || `${dictTitle}의 사주적 의미와 특성을 해설합니다. 무운 운세 사전에서 무료로 확인하세요.`;
      currentMeta = {
        title: `${dictMetaTitle} - 무운 운세 사전`,
        description: dictMetaDesc,
        h1: `${dictTitle} - ${dictCategory}`,
        bodyContent: `
          <section>
            <h2>${dictTitle}</h2>
            <p>${dictMetaDesc} 무운 운세 사전에서 사주팔자의 핵심 개념을 회원가입 없이 100% 무료로 확인하세요.</p>
          </section>
        `,
        services: [
          { href: '/fortune-dictionary', label: '운세 사전 목록' },
          { href: '/lifelong-saju', label: '평생 사주 분석' },
        ]
      };
    } else if (options.path.startsWith('/dream/') || options.path.startsWith('/guide/') || options.path.startsWith('/dictionary/')) {
      // 알 수 없는 dream/guide/dictionary 하위 경로 → 404 반환 (Soft 404 방지)
      return {
        appHtml: '',
        head: {
          title: '<title>페이지를 찾을 수 없습니다 (404) | 무운</title>',
          meta: '<meta name="robots" content="noindex, nofollow">',
          link: '',
        },
        dehydratedState: {},
        statusCode: 404,
      };
    } else {
      currentMeta = metaData['/'];
    }
  }

  // 내비게이션 링크 생성
  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/yearly-fortune', label: '신년운세' },
    { href: '/compatibility', label: '궁합' },
    { href: '/lifelong-saju', label: '평생사주' },
    { href: '/naming', label: '작명' },
  ];

  // 서비스 링크 HTML 생성
  const serviceLinksHtml = currentMeta.services
    ? currentMeta.services.map(s => `<li><a href="${s.href}">${s.label}</a></li>`).join('\n          ')
    : '';

  // 페이지별 canonical URL
  const canonicalUrl = `https://muunsaju.com${options.path}`;

  // 개인정보처리방침 본문
  const privacyContent = `
    <section>
      <h2>1. 개인정보의 처리 목적</h2>
      <p>'무운'(이하 '서비스')은 사용자가 입력한 생년월일, 태어난 시간, 성별 등의 정보를 오직 사주 및 운세 결과 계산을 위한 목적으로만 처리합니다. 본 서비스는 회원가입을 요구하지 않으며, 입력된 정보는 서버에 영구적으로 저장되지 않습니다.</p>
      <h2>2. 처리하는 개인정보 항목</h2>
      <ul>
        <li>필수항목: 이름(별칭), 성별, 생년월일, 태어난 시간</li>
        <li>자동수집항목: 접속 로그, 쿠키, 접속 IP 정보, 행태정보(클릭, 스크롤, 마우스 움직임 등)</li>
      </ul>
      <h2>3. 개인정보의 보유 및 이용기간</h2>
      <p>사용자가 입력한 사주 정보는 브라우저의 로컬 스토리지(Local Storage)에 임시 저장되어 사용자의 편의를 돕습니다. 서버에는 어떠한 개인 식별 정보도 저장되지 않으며, 브라우저 캐시를 삭제하거나 서비스를 종료하면 정보는 더 이상 이용되지 않습니다.</p>
      <h2>4. 제3자 제공 및 위탁</h2>
      <p>서비스는 사용자의 개인정보를 외부에 제공하거나 처리를 위탁하지 않습니다. 다만, 구글 애드센스 등 광고 서비스 이용 시 비식별화된 통계 정보가 활용될 수 있습니다.</p>
      <h3>4-1. Google AdSense 및 쿠키 사용 고지</h3>
      <p>본 서비스는 수익 창출 및 서비스 운영을 위해 Google AdSense 광고를 게재합니다. 상세 내용은 <a href="https://policies.google.com/technologies/ads">Google 광고 정책</a>을 확인하시기 바랍니다.</p>
      <h3>4-2. Microsoft Clarity 분석 도구 사용 고지</h3>
      <p>본 서비스는 이용자의 서비스 이용 행태 분석 및 서비스 최적화를 위해 Microsoft Clarity 분석 도구를 사용합니다. 상세 내용은 <a href="https://clarity.microsoft.com/terms">Microsoft Clarity 이용약관</a> 및 <a href="https://privacy.microsoft.com/ko-kr/privacystatement">Microsoft 개인정보처리방침</a>을 확인하시기 바랍니다.</p>
      <h2>5. 개인정보 보호책임자</h2>
      <p>이메일: ykwillow1@naver.com</p>
      <h2>6. 시행일</h2>
      <p>본 개인정보처리방침은 2026년 3월 6일부터 시행됩니다.</p>
    </section>
  `;

  // 본문 콘텐츠 결정
  let mainContent: string;
  if (options.path === '/privacy') {
    mainContent = privacyContent;
  } else if (currentMeta.bodyContent) {
    mainContent = currentMeta.bodyContent;
  } else {
    // 칼럼 상세 페이지 등 bodyContent가 없는 경우 기본 콘텐츠 생성
    mainContent = `
      <section>
        <p>${currentMeta.description}</p>
        ${serviceLinksHtml ? `<nav aria-label="관련 서비스"><ul>${serviceLinksHtml}</ul></nav>` : ''}
        <p>무운(MuUn)은 회원가입 없이, 개인정보를 저장하지 않는 100% 무료 사주·운세·타로·꿈해몽 서비스입니다. 생년월일만 입력하면 바로 확인할 수 있습니다.</p>
      </section>
    `;
  }

  // 풍부한 콘텐츠를 포함한 HTML 생성
  const appHtml = `
    <header>
      <nav aria-label="주요 메뉴">
        ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n        ')}
      </nav>
    </header>
    <main>
      <h1>${currentMeta.h1 || currentMeta.title}</h1>
      ${mainContent}
      ${serviceLinksHtml && !currentMeta.bodyContent ? '' : (serviceLinksHtml ? `<nav aria-label="관련 서비스"><ul>${serviceLinksHtml}</ul></nav>` : '')}
    </main>
    <footer>
      <nav aria-label="푸터 메뉴">
        <a href="/about">무운 소개</a>
        <a href="/privacy">개인정보처리방침</a>
        <a href="/terms">이용약관</a>
        <a href="/contact">문의하기</a>
      </nav>
      <p>© 2026 MUUN. All rights reserved.</p>
    </footer>
  `;

  // 페이지별 키워드 매핑
  const keywordsMap: Record<string, string> = {
    '/': '무료사주, 무료운세, 2026년운세, 사주풀이, 무료사주풀이, 신년운세, 토정비결, 궁합, 만세력, 타로, 꿈해몽, 회원가입없는사주',
    '/yearly-fortune': '2026년운세, 신년운세, 무료신년운세, 병오년운세, 2026년신년운세, 무료운세',
    '/lifelong-saju': '평생사주, 무료사주, 사주풀이, 무료사주풀이, 사주분석, 운명분석',
    '/compatibility': '궁합, 사주궁합, 무료궁합, 연애궁합, 결혼궁합, 궁합보기',
    '/tojeong': '토정비결, 2026년토정비결, 무료토정비결, 병오년토정비결',
    '/manselyeok': '만세력, 무료만세력, 사주팔자, 만세력조회',
    '/tarot': '타로, 무료타로, 타로상담, 타로카드, 온라인타로',
    '/dream': '꿈해몽, 무료꿈해몽, 꿈풀이, 꿈해몽사전',
    '/daily-fortune': '오늘의운세, 무료오늘의운세, 오늘운세, 매일운세',
    '/psychology': '심리테스트, 무료심리테스트, 성격분석, 심리분석',
    '/astrology': '점성술, 무료점성술, 네이탈차트, 탄생차트, 별자리운세, 서양점성술, 별자리성격, 태양별자리, 달별자리, 상승궁, 출생차트, natal chart, birth chart, 점성술풀이, 행성배치',
    '/family-saju': '가족사주, 가족궁합, 가족사주분석, 가족오행, 가족관계사주, 가족사주풀이',
    '/hybrid-compatibility': '하이브리드궁합, 사주MBTI궁합, 사주궁합, MBTI궁합',
    '/fortune-dictionary': '사주용어, 명리학용어, 사주사전, 천간지지, 오행, 십신',
    '/naming': '작명, 무료작명, 신생아작명, 아기이름, 작명소, 81수리, 성명학, 한자작명, 사주작명',
    '/lucky-lunch': '행운점심, 오행음식, 오늘점심추천, 사주음식',
    '/guide': '사주칼럼, 운세칼럼, 사주지혜, 개운법, 명리학칼럼',
  };
  const keywords = keywordsMap[options.path] || '무료사주, 무료운세, 사주풀이, 무운';

  // Schema.org 구조화 데이터 생성
  const isDreamPage = /^\/dream\/[a-z0-9-]+$/.test(options.path);
  const isGuidePage = /^\/guide\/[a-z0-9-]+$/.test(options.path);
  const isDictionaryPage = /^\/dictionary\/[a-z0-9-]+$/.test(options.path);

  let schemaData: object;
  if (isDreamPage) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": currentMeta.title,
      "description": currentMeta.description,
      "url": canonicalUrl,
      "publisher": {
        "@type": "Organization",
        "name": "무운 (MuUn)",
        "url": "https://muunsaju.com",
        "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/images/horse_mascot.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "inLanguage": "ko-KR"
    };
  } else if (isGuidePage) {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": currentMeta.h1 || currentMeta.title,
      "description": currentMeta.description,
      "url": canonicalUrl,
      "author": { "@type": "Organization", "name": "무운 (MuUn)" },
      "publisher": {
        "@type": "Organization",
        "name": "무운 (MuUn)",
        "url": "https://muunsaju.com",
        "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/images/horse_mascot.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "inLanguage": "ko-KR"
    };
  } else if (isDictionaryPage) {
    const dictSlugForSchema = options.path.replace('/dictionary/', '');
    const dictInfoForSchema = dictionaryKeywordMap[dictSlugForSchema];
    schemaData = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": dictInfoForSchema?.title || currentMeta.h1 || currentMeta.title,
      "description": currentMeta.description,
      "url": canonicalUrl,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "무운 운세 사전",
        "url": "https://muunsaju.com/fortune-dictionary"
      },
      "publisher": {
        "@type": "Organization",
        "name": "무운 (MuUn)",
        "url": "https://muunsaju.com",
        "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/images/horse_mascot.png" }
      },
      "inLanguage": "ko-KR"
    };
  } else if (options.path === '/naming') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "무운 무료 작명소",
      "url": "https://muunsaju.com/naming",
      "description": "사주 기반 무료 한자 이름 추천 서비스",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "inLanguage": "ko-KR",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW"
      },
      "publisher": {
        "@type": "Organization",
        "name": "무운 (MuUn)",
        "url": "https://muunsaju.com",
        "logo": { "@type": "ImageObject", "url": "https://muunsaju.com/images/horse_mascot.png" }
      }
    };
  } else if (options.path === '/') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "무운 (MuUn)",
      "url": "https://muunsaju.com",
      "description": currentMeta.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://muunsaju.com/dream?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "ko-KR"
    };
  } else {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": currentMeta.title,
      "description": currentMeta.description,
      "url": canonicalUrl,
      "publisher": { "@type": "Organization", "name": "무운 (MuUn)", "url": "https://muunsaju.com" },
      "inLanguage": "ko-KR"
    };
  }

  const schemaScript = `<script type="application/ld+json">${JSON.stringify(schemaData)}</script>`;

  // FAQPage 구조화 데이터 (페이지별 맞춤 FAQ)
  const faqMap: Record<string, Array<{question: string; answer: string}>> = {
    '/': [
      { question: '무운 사주는 무료인가요?', answer: '네, 무운(MuUn)의 모든 운세 서비스는 100% 무료입니다. 평생사주, 신년운세, 오늘의 운세, 궁합, 토정비결, 타로, 꿈해몽까지 회원가입 없이 무료로 이용하실 수 있습니다.' },
      { question: '회원가입 없이 사주를 볼 수 있나요?', answer: '네, 무운은 회원가입이 전혀 필요 없습니다. 생년월일만 입력하면 바로 사주풀이를 확인할 수 있습니다. 개인정보 저장도 하지 않습니다.' },
      { question: '무운 사주는 어떤 서비스를 제공하나요?', answer: '무운은 평생사주, 신년운세, 오늘의 운세, 사주 궁합, 토정비결, 타로, 꿈해몽 사전, 운세 칼럼, 사주 용어 사전, 만세력 등 다양한 운세 서비스를 무료로 제공합니다.' },
      { question: '사주 결과는 얼마나 정확한가요?', answer: '무운은 전통 명리학(사주팔자)을 기반으로 생년월일시를 분석합니다. 사주는 타고난 기운과 운의 흐름을 파악하는 도구로, 참고 자료로 활용하시기를 권장합니다.' },
      { question: '개인정보는 안전한가요?', answer: '무운은 입력하신 생년월일 정보를 서버에 저장하지 않습니다. 모든 분석은 입력 즉시 처리되며 별도로 보관되지 않아 개인정보 유출 걱정이 없습니다.' }
    ],
    '/lifelong-saju': [
      { question: '평생사주 풀이는 무료인가요?', answer: '네, 무운의 평생사주 풀이는 완전 무료입니다. 회원가입 없이 생년월일시만 입력하면 바로 확인하실 수 있습니다.' },
      { question: '평생사주를 보려면 무엇이 필요한가요?', answer: '생년월일과 출생 시간이 필요합니다. 출생 시간을 모르는 경우에도 시간 없이 분석이 가능합니다.' },
      { question: '평생사주와 신년운세의 차이는 무엇인가요?', answer: '평생사주는 타고난 사주팔자(四柱八字)를 분석하여 평생의 성격, 재물운, 직업운, 건강운 등을 파악합니다. 신년운세는 해당 연도의 운의 흐름을 분석합니다.' }
    ],
    '/yearly-fortune': [
      { question: '2026년 신년운세는 무료인가요?', answer: '네, 무운의 2026년 신년운세는 완전 무료입니다. 회원가입 없이 생년월일만 입력하면 바로 확인하실 수 있습니다.' },
      { question: '신년운세는 언제 보는 것이 좋나요?', answer: '신년운세는 양력 1월 1일 또는 음력 설날 이후에 보는 것이 일반적입니다. 사주 명리학에서는 입춘(2월 4일경)을 새해의 시작으로 보기도 합니다.' },
      { question: '신년운세에서 무엇을 알 수 있나요?', answer: '2026년 한 해의 전반적인 운의 흐름, 월별 운세, 재물운, 직업운, 애정운, 건강운 등을 확인하실 수 있습니다.' }
    ],
    '/compatibility': [
      { question: '사주 궁합은 무료인가요?', answer: '네, 무운의 사주 궁합 분석은 완전 무료입니다. 두 사람의 생년월일을 입력하면 회원가입 없이 바로 궁합을 확인하실 수 있습니다.' },
      { question: '궁합이 나쁘면 결혼하면 안 되나요?', answer: '궁합은 두 사람의 기운이 어떻게 조화를 이루는지 파악하는 참고 자료입니다. 궁합이 좋지 않더라도 서로 이해하고 노력하면 좋은 관계를 만들 수 있습니다.' },
      { question: '사주 궁합과 MBTI 궁합의 차이는 무엇인가요?', answer: '사주 궁합은 생년월일을 기반으로 오행의 조화를 분석하는 전통 방식이고, MBTI 궁합은 성격 유형을 기반으로 합니다. 무운에서는 두 가지를 결합한 하이브리드 궁합도 제공합니다.' }
    ],
    '/dream': [
      { question: '꿈해몽은 무료인가요?', answer: '네, 무운의 꿈해몽 사전은 완전 무료입니다. 350개 이상의 꿈 해석을 회원가입 없이 바로 확인하실 수 있습니다.' },
      { question: '꿈해몽은 얼마나 정확한가요?', answer: '꿈해몽은 전통적인 해몽 방식을 기반으로 합니다. 꿈의 의미는 개인의 상황과 심리 상태에 따라 다를 수 있으므로 참고 자료로 활용하시기를 권장합니다.' },
      { question: '돼지꿈을 꾸면 복권을 사야 하나요?', answer: '돼지꿈은 전통적으로 재물운과 행운을 상징합니다. 특히 황금 돼지꿈이나 돼지가 집에 들어오는 꿈은 길몽으로 여겨집니다. 다만 꿈해몽은 참고 자료이므로 과도한 기대는 삼가세요.' }
    ],
    '/tojeong': [
      { question: '토정비결은 무료인가요?', answer: '네, 무운의 토정비결은 완전 무료입니다. 회원가입 없이 생년월일만 입력하면 2026년 토정비결을 바로 확인하실 수 있습니다.' },
      { question: '토정비결이란 무엇인가요?', answer: '토정비결은 조선시대 이지함 선생이 만든 것으로 전해지는 한 해의 운세를 예측하는 방법입니다. 생년월일을 기반으로 그 해의 길흥화복을 64괴로 풀이합니다.' }
    ],
    '/astrology': [
      { question: '점성술 네이탈 차트 분석은 무료인가요?', answer: '네, 무운의 점성술 네이탈 차트 분석은 100% 무료입니다. 회원가입 없이 생년월일과 출생 도시만 입력하면 즉시 네이탈 차트를 계산하고 한국어로 풀이해 드립니다.' },
      { question: '네이탈 차트를 보려면 무엇이 필요한가요?', answer: '생년월일, 출생 시간(모르면 시간 없이도 분석 가능), 출생 도시가 필요합니다. 출생 시간이 있으면 달 별자리와 상승궁까지 정밀하게 계산할 수 있습니다.' },
      { question: '태양 별자리와 달 별자리의 차이는 무엇인가요?', answer: '태양 별자리(Sun Sign)는 태어난 날의 태양 위치로, 생년월일만으로 확인할 수 있습니다. 달 별자리(Moon Sign)는 달이 위치한 별자리로, 감정과 내면을 나타냅니다. 달은 약 2.5일마다 별자리를 이동하므로 정확한 출생 시간이 있어야 정밀하게 계산됩니다.' },
      { question: '점성술과 사주의 차이는 무엇인가요?', answer: '점성술은 태어난 순간 행성의 황도 좌표를 기반으로 성격과 운명을 분석하는 서양의 전통 학문입니다. 사주는 연·월·일·시의 천간지지 조합으로 운명을 해석하는 동양의 명리학입니다. 무운에서는 두 가지를 모두 무료로 제공하므로 비교해보실 수 있습니다.' },
      { question: '점성술 분석 결과는 얼마나 정확한가요?', answer: '무운의 점성술은 실제 시간대별 행성 위치를 계산하는 astronomy-engine 라이브러리를 사용하여 천문학적으로 정확합니다. 다만 점성술 풀이는 참고 자료로 활용하시기를 권장합니다.' }
    ],
    '/naming': [
      { question: '무운 작명소는 무료인가요?', answer: '네, 무운의 작명소는 완전 무료입니다. 회원가입 없이 아기의 생년월일시만 입력하면 사주 맞춤 이름 후보를 바로 확인하실 수 있습니다.' },
      { question: '81수리 작명이란 무엇인가요?', answer: '81수리 작명은 이름을 이루는 한자의 획수(劃數)를 기반으로 원격(元格)·형격(亨格)·이격(利格)·정격(貞格) 4격의 수리를 분석하는 전통 성명학 방식입니다. 1~81깊지 각 수에 길흥(吉凶)이 정해져 있으며, 4격이 모두 길수인 이름이 가장 이상적인 작명으로 봅니다.' },
      { question: '사주 오행을 고려한 작명이 필요한 이유는?', answer: '아기의 사주팔자에 부족한 오행(五行)이 있다면, 해당 오행의 기운을 담은 한자를 이름에 넣어 사주를 보완하는 효과를 기대할 수 있습니다. 무운 작명소는 사주 오행 분석과 81수리를 동시에 고려하여 최적의 이름을 추천합니다.' },
      { question: '작명 결과를 PDF로 저장할 수 있나요?', answer: '네, 무운 작명소에서는 작명 결과를 PDF로 다운로드할 수 있습니다. 이름 후보별 4격 수리, 오행 분석, 한자 의미를 포함한 완성도 높은 문서를 무료로 저장할 수 있습니다.' },
      { question: '작명 비용이 있나요?', answer: '완전 무료입니다. 회원가입 없이 바로 이용할 수 있습니다.' },
      { question: '어떤 원리로 이름을 추천하나요?', answer: '사주팔자 오행 분석, 대법원 인명용 한자 선별, 81수리 4격 길흉 검증을 거쳐 추천합니다.' },
      { question: '영어 이름도 추천해주나요?', answer: '네, 한자 이름과 발음·느낌이 어울리는 영어 이름도 함께 추천해드립니다.' }
    ]
  };

  const faqItems = faqMap[options.path];
  let faqScript = '';
  if (faqItems && faqItems.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    faqScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  }

  return {
    appHtml,
    head: {
      title: `<title>${currentMeta.title}</title>`,
      meta: [
        `<meta name="description" content="${currentMeta.description}">`,
        `<meta name="keywords" content="${keywords}">`,
        `<meta name="robots" content="index, follow">`,
        `<meta property="og:title" content="${currentMeta.title}">`,
        `<meta property="og:description" content="${currentMeta.description}">`,
        `<meta property="og:url" content="${canonicalUrl}">`,
        `<meta property="og:type" content="${(isGuidePage || isDictionaryPage || isDreamPage) ? 'article' : 'website'}">`,
        `<meta property="og:site_name" content="무운 (MuUn)">`,
        `<meta property="og:locale" content="ko_KR">`,
        `<meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${currentMeta.title}">`,
        `<meta name="twitter:description" content="${currentMeta.description}">`,
        `<link rel="alternate" type="application/rss+xml" title="무운 (MuUn) RSS" href="https://muunsaju.com/rss.xml">`,
        schemaScript,
        faqScript,
      ].filter(Boolean).join('\n    '),
      link: `<link rel="canonical" href="${canonicalUrl}">`,
    },
    dehydratedState: {},
  };
}
