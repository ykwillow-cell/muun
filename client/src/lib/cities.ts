export interface City {
  name: string;
  en: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const MAJOR_CITIES: City[] = [
  { name: "서울", en: "Seoul", lat: 37.5665, lng: 126.9780, timezone: "Asia/Seoul" },
  { name: "부산", en: "Busan", lat: 35.1796, lng: 129.0756, timezone: "Asia/Seoul" },
  { name: "인천", en: "Incheon", lat: 37.4563, lng: 126.7052, timezone: "Asia/Seoul" },
  { name: "대구", en: "Daegu", lat: 35.8714, lng: 128.6014, timezone: "Asia/Seoul" },
  { name: "대전", en: "Daejeon", lat: 36.3504, lng: 127.3845, timezone: "Asia/Seoul" },
  { name: "광주", en: "Gwangju", lat: 35.1595, lng: 126.8526, timezone: "Asia/Seoul" },
  { name: "울산", en: "Ulsan", lat: 35.5384, lng: 129.3114, timezone: "Asia/Seoul" },
  { name: "제주", en: "Jeju", lat: 33.4996, lng: 126.5312, timezone: "Asia/Seoul" },
  { name: "도쿄", en: "Tokyo", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  { name: "뉴욕", en: "New York", lat: 40.7128, lng: -74.0060, timezone: "America/New_York" },
  { name: "런던", en: "London", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { name: "파리", en: "Paris", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { name: "베이징", en: "Beijing", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai" },
  { name: "시드니", en: "Sydney", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
];
