export interface City {
  name: string;
  en: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const MAJOR_CITIES: City[] = [
  // 광역시 및 특별시
  { name: "서울", en: "Seoul", lat: 37.5665, lng: 126.9780, timezone: "Asia/Seoul" },
  { name: "부산", en: "Busan", lat: 35.1796, lng: 129.0756, timezone: "Asia/Seoul" },
  { name: "인천", en: "Incheon", lat: 37.4563, lng: 126.7052, timezone: "Asia/Seoul" },
  { name: "대구", en: "Daegu", lat: 35.8714, lng: 128.6014, timezone: "Asia/Seoul" },
  { name: "대전", en: "Daejeon", lat: 36.3504, lng: 127.3845, timezone: "Asia/Seoul" },
  { name: "광주", en: "Gwangju", lat: 35.1595, lng: 126.8526, timezone: "Asia/Seoul" },
  { name: "울산", en: "Ulsan", lat: 35.5384, lng: 129.3114, timezone: "Asia/Seoul" },
  { name: "세종", en: "Sejong", lat: 36.4800, lng: 127.2890, timezone: "Asia/Seoul" },

  // 경기도
  { name: "수원", en: "Suwon", lat: 37.2636, lng: 127.0286, timezone: "Asia/Seoul" },
  { name: "고양", en: "Goyang", lat: 37.6584, lng: 126.8320, timezone: "Asia/Seoul" },
  { name: "용인", en: "Yongin", lat: 37.2411, lng: 127.1776, timezone: "Asia/Seoul" },
  { name: "성남", en: "Seongnam", lat: 37.4200, lng: 127.1265, timezone: "Asia/Seoul" },
  { name: "부천", en: "Bucheon", lat: 37.4893, lng: 126.7801, timezone: "Asia/Seoul" },
  { name: "안산", en: "Ansan", lat: 37.3219, lng: 126.8308, timezone: "Asia/Seoul" },
  { name: "남양주", en: "Namyangju", lat: 37.6360, lng: 127.2165, timezone: "Asia/Seoul" },
  { name: "안양", en: "Anyang", lat: 37.3943, lng: 126.9568, timezone: "Asia/Seoul" },
  { name: "화성", en: "Hwaseong", lat: 37.1995, lng: 126.8312, timezone: "Asia/Seoul" },
  { name: "평택", en: "Pyeongtaek", lat: 36.9921, lng: 127.1129, timezone: "Asia/Seoul" },
  { name: "의정부", en: "Uijeongbu", lat: 37.7381, lng: 127.0337, timezone: "Asia/Seoul" },
  { name: "파주", en: "Paju", lat: 37.7600, lng: 126.7800, timezone: "Asia/Seoul" },
  { name: "시흥", en: "Siheung", lat: 37.3800, lng: 126.8036, timezone: "Asia/Seoul" },
  { name: "김포", en: "Gimpo", lat: 37.6153, lng: 126.7156, timezone: "Asia/Seoul" },
  { name: "광명", en: "Gwangmyeong", lat: 37.4785, lng: 126.8646, timezone: "Asia/Seoul" },
  { name: "군포", en: "Gunpo", lat: 37.3617, lng: 126.9353, timezone: "Asia/Seoul" },
  { name: "이천", en: "Icheon", lat: 37.2723, lng: 127.4351, timezone: "Asia/Seoul" },
  { name: "구리", en: "Guri", lat: 37.5943, lng: 127.1296, timezone: "Asia/Seoul" },
  { name: "양주", en: "Yangju", lat: 37.7853, lng: 127.0457, timezone: "Asia/Seoul" },
  { name: "안성", en: "Anseong", lat: 37.0080, lng: 127.2797, timezone: "Asia/Seoul" },
  { name: "포천", en: "Pocheon", lat: 37.8949, lng: 127.2003, timezone: "Asia/Seoul" },
  { name: "의왕", en: "Uiwang", lat: 37.3447, lng: 126.9683, timezone: "Asia/Seoul" },
  { name: "하남", en: "Hanam", lat: 37.5392, lng: 127.2148, timezone: "Asia/Seoul" },
  { name: "여주", en: "Yeoju", lat: 37.2984, lng: 127.6371, timezone: "Asia/Seoul" },
  { name: "양평", en: "Yangpyeong", lat: 37.4917, lng: 127.4875, timezone: "Asia/Seoul" },
  { name: "동두천", en: "Dongducheon", lat: 37.9036, lng: 127.0607, timezone: "Asia/Seoul" },
  { name: "과천", en: "Gwacheon", lat: 37.4292, lng: 126.9874, timezone: "Asia/Seoul" },
  { name: "가평", en: "Gapyeong", lat: 37.8315, lng: 127.5095, timezone: "Asia/Seoul" },
  { name: "연천", en: "Yeoncheon", lat: 38.0964, lng: 127.0747, timezone: "Asia/Seoul" },

  // 강원도
  { name: "춘천", en: "Chuncheon", lat: 37.8813, lng: 127.7298, timezone: "Asia/Seoul" },
  { name: "원주", en: "Wonju", lat: 37.3422, lng: 127.9202, timezone: "Asia/Seoul" },
  { name: "강릉", en: "Gangneung", lat: 37.7519, lng: 128.8761, timezone: "Asia/Seoul" },
  { name: "동해", en: "Donghae", lat: 37.5247, lng: 129.1143, timezone: "Asia/Seoul" },
  { name: "속초", en: "Sokcho", lat: 38.2070, lng: 128.5918, timezone: "Asia/Seoul" },
  { name: "삼척", en: "Samcheok", lat: 37.4493, lng: 129.1658, timezone: "Asia/Seoul" },

  // 충청도
  { name: "청주", en: "Cheongju", lat: 36.6424, lng: 127.4890, timezone: "Asia/Seoul" },
  { name: "천안", en: "Cheonan", lat: 36.8151, lng: 127.1139, timezone: "Asia/Seoul" },
  { name: "충주", en: "Chungju", lat: 36.9910, lng: 127.9259, timezone: "Asia/Seoul" },
  { name: "아산", en: "Asan", lat: 36.7898, lng: 127.0049, timezone: "Asia/Seoul" },
  { name: "서산", en: "Seosan", lat: 36.7845, lng: 126.4503, timezone: "Asia/Seoul" },
  { name: "당진", en: "Dangjin", lat: 36.8898, lng: 126.6274, timezone: "Asia/Seoul" },
  { name: "공주", en: "Gongju", lat: 36.4465, lng: 127.1190, timezone: "Asia/Seoul" },
  { name: "논산", en: "Nonsan", lat: 36.1872, lng: 127.0986, timezone: "Asia/Seoul" },
  { name: "보령", en: "Boryeong", lat: 36.3333, lng: 126.6125, timezone: "Asia/Seoul" },

  // 전라도
  { name: "전주", en: "Jeonju", lat: 35.8242, lng: 127.1480, timezone: "Asia/Seoul" },
  { name: "익산", en: "Iksan", lat: 35.9483, lng: 126.9576, timezone: "Asia/Seoul" },
  { name: "군산", en: "Gunsan", lat: 35.9677, lng: 126.7366, timezone: "Asia/Seoul" },
  { name: "여수", en: "Yeosu", lat: 34.7604, lng: 127.6622, timezone: "Asia/Seoul" },
  { name: "순천", en: "Suncheon", lat: 34.9506, lng: 127.4872, timezone: "Asia/Seoul" },
  { name: "목포", en: "Mokpo", lat: 34.8118, lng: 126.3922, timezone: "Asia/Seoul" },
  { name: "광양", en: "Gwangyang", lat: 34.9407, lng: 127.6959, timezone: "Asia/Seoul" },
  { name: "나주", en: "Naju", lat: 35.0158, lng: 126.7108, timezone: "Asia/Seoul" },

  // 경상도
  { name: "창원", en: "Changwon", lat: 35.2279, lng: 128.6811, timezone: "Asia/Seoul" },
  { name: "김해", en: "Gimhae", lat: 35.2332, lng: 128.8811, timezone: "Asia/Seoul" },
  { name: "포항", en: "Pohang", lat: 36.0190, lng: 129.3435, timezone: "Asia/Seoul" },
  { name: "구미", en: "Gumi", lat: 36.1194, lng: 128.3445, timezone: "Asia/Seoul" },
  { name: "진주", en: "Jinju", lat: 35.1795, lng: 128.1076, timezone: "Asia/Seoul" },
  { name: "양산", en: "Yangsan", lat: 35.3349, lng: 129.0375, timezone: "Asia/Seoul" },
  { name: "거제", en: "Geoje", lat: 34.8806, lng: 128.6211, timezone: "Asia/Seoul" },
  { name: "안동", en: "Andong", lat: 36.5684, lng: 128.7294, timezone: "Asia/Seoul" },
  { name: "경주", en: "Gyeongju", lat: 35.8562, lng: 129.2247, timezone: "Asia/Seoul" },
  { name: "경산", en: "Gyeongsan", lat: 35.8250, lng: 128.7411, timezone: "Asia/Seoul" },
  { name: "통영", en: "Tongyeong", lat: 34.8544, lng: 128.4331, timezone: "Asia/Seoul" },
  { name: "사천", en: "Sacheon", lat: 35.0039, lng: 128.0642, timezone: "Asia/Seoul" },
  { name: "밀양", en: "Miryang", lat: 35.5039, lng: 128.7464, timezone: "Asia/Seoul" },
  { name: "영주", en: "Yeongju", lat: 36.8056, lng: 128.6240, timezone: "Asia/Seoul" },
  { name: "영천", en: "Yeongcheon", lat: 35.9733, lng: 128.9386, timezone: "Asia/Seoul" },
  { name: "상주", en: "Sangju", lat: 36.4109, lng: 128.1591, timezone: "Asia/Seoul" },
  { name: "문경", en: "Mungyeong", lat: 36.5861, lng: 128.1867, timezone: "Asia/Seoul" },

  // 제주도
  { name: "제주", en: "Jeju", lat: 33.4996, lng: 126.5312, timezone: "Asia/Seoul" },
  { name: "서귀포", en: "Seogwipo", lat: 33.2541, lng: 126.5601, timezone: "Asia/Seoul" },

  // 해외 주요 도시
  { name: "도쿄", en: "Tokyo", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  { name: "오사카", en: "Osaka", lat: 34.6937, lng: 135.5023, timezone: "Asia/Tokyo" },
  { name: "뉴욕", en: "New York", lat: 40.7128, lng: -74.0060, timezone: "America/New_York" },
  { name: "로스앤젤레스", en: "Los Angeles", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles" },
  { name: "런던", en: "London", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { name: "파리", en: "Paris", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { name: "베이징", en: "Beijing", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai" },
  { name: "상하이", en: "Shanghai", lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai" },
  { name: "시드니", en: "Sydney", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
  { name: "베를린", en: "Berlin", lat: 52.5200, lng: 13.4050, timezone: "Europe/Berlin" },
  { name: "방콕", en: "Bangkok", lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok" },
  { name: "싱가포르", en: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
];
