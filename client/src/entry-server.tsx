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
  "zombie-attack-dream-meaning": { keyword: "좀비가 나타나 습격하는 꿈", metaTitle: "좀비 꿈 해몽 | 극심한 스트레스의 경고등 | 무운" }
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
      `,
      services: [
        { href: '/yearly-fortune', label: '신년운세' },
        { href: '/manselyeok', label: '만세력 분석' },
      ]
    },
    '/astrology': {
      title: "무료 서양 점성술 - 회원가입 없이 탄생 차트 분석 및 운명 해석 | 무운 (MuUn)",
      description: "회원가입 없이 바로 확인하는 무료 서양 점성술 탄생 차트 분석. 태어난 순간의 별자리와 행성 배치로 성격과 운명을 개인정보 저장 없이 100% 무료로 분석합니다.",
      h1: "무료 서양 점성술 - 탄생 차트 분석",
      bodyContent: `
        <section>
          <h2>서양 점성술(Western Astrology)이란? - 회원가입 없이 무료로 확인</h2>
          <p>회원가입 없이, 개인정보 저장 없이, 생년월일만 입력하면 바로 확인하는 무료 서양 점성술 탄생 차트 분석 서비스입니다. 서양 점성술은 태어난 순간의 태양, 달, 행성들의 위치를 기반으로 개인의 성격과 운명을 분석하는 학문입니다. 탄생 차트(Birth Chart, 네이탈 차트)는 출생 시각과 장소를 기준으로 계산되며, 12개의 별자리(황도 12궁)와 10개의 행성이 상호작용하는 방식을 분석합니다.</p>
          <h2>탄생 차트에서 확인할 수 있는 내용</h2>
          <ul>
            <li>태양 별자리(Sun Sign): 기본적인 성격과 자아 정체성</li>
            <li>달 별자리(Moon Sign): 감정, 직관, 내면의 자아</li>
            <li>상승 별자리(Ascendant): 외부에 보이는 모습과 첫인상</li>
            <li>행성 배치: 수성(의사소통), 금성(사랑), 화성(행동력) 등의 영향</li>
            <li>하우스(House): 삶의 12가지 영역에 대한 분석</li>
          </ul>
        </section>
      `,
      services: [
        { href: '/psychology', label: '심리테스트' },
        { href: '/lifelong-saju', label: '평생 사주' },
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
        <section>
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
      const koreanKeyword = dreamInfo?.keyword || dreamSlug.replace(/-dream$/, '').replace(/-/g, ' ');
      const dreamMetaTitle = dreamInfo?.metaTitle || `${koreanKeyword} 꿈해몽 - 꿈의 의미와 해석`;
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
    } else {
      currentMeta = metaData['/'];
    }
  }

  // 내비게이션 링크 생성
  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/yearly-fortune', label: '신년운세' },
    { href: '/manselyeok', label: '만세력' },
    { href: '/lifelong-saju', label: '평생사주' },
    { href: '/compatibility', label: '궁합' },
    { href: '/tojeong', label: '토정비결' },
    { href: '/tarot', label: '타로' },
    { href: '/dream', label: '꿈해몽' },
    { href: '/guide', label: '칼럼' },
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
    '/astrology': '점성술, 별자리운세, 탄생차트, 서양점성술',
    '/family-saju': '가족사주, 가족궁합, 가족사주분석, 가족오행, 가족관계사주, 가족사주풀이',
    '/hybrid-compatibility': '하이브리드궁합, 사주MBTI궁합, 사주궁합, MBTI궁합',
    '/fortune-dictionary': '사주용어, 명리학용어, 사주사전, 천간지지, 오행, 십신',
    '/lucky-lunch': '행운점심, 오행음식, 오늘점심추천, 사주음식',
    '/guide': '사주칼럼, 운세칼럼, 사주지혜, 개운법, 명리학칼럼',
  };
  const keywords = keywordsMap[options.path] || '무료사주, 무료운세, 사주풀이, 무운';

  // Schema.org 구조화 데이터 생성
  const isDreamPage = /^\/dream\/[a-z0-9-]+$/.test(options.path);
  const isGuidePage = /^\/guide\/[a-z0-9-]+$/.test(options.path);

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
      { question: '토정비결이란 무엇인가요?', answer: '토정비결은 조선시대 이지함 선생이 만든 것으로 전해지는 한 해의 운세를 예측하는 방법입니다. 생년월일을 기반으로 그 해의 길흉화복을 64괘로 풀이합니다.' }
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
        `<meta property="og:type" content="${isGuidePage ? 'article' : 'website'}">`,
        `<meta property="og:site_name" content="무운 (MuUn)">`,
        `<meta property="og:locale" content="ko_KR">`,
        `<meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${currentMeta.title}">`,
        `<meta name="twitter:description" content="${currentMeta.description}">`,
        schemaScript,
        faqScript,
      ].filter(Boolean).join('\n    '),
      link: `<link rel="canonical" href="${canonicalUrl}">`,
    },
    dehydratedState: {},
  };
}
