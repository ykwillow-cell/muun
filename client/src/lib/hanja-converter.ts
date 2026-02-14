/**
 * 천간(天干) 한글 → 한자 변환
 */
export const stemToHanja: Record<string, string> = {
  '갑': '甲',
  '을': '乙',
  '병': '丙',
  '정': '丁',
  '무': '戊',
  '기': '己',
  '경': '庚',
  '신': '辛',
  '임': '壬',
  '계': '癸',
};

/**
 * 지지(地支) 한글 → 한자 변환
 */
export const branchToHanja: Record<string, string> = {
  '자': '子',
  '축': '丑',
  '인': '寅',
  '묘': '卯',
  '진': '辰',
  '사': '巳',
  '오': '午',
  '미': '未',
  '신': '申',
  '유': '酉',
  '술': '戌',
  '해': '亥',
};

/**
 * 천간/지지를 한자로 변환
 */
export const convertToHanja = (stem: string, branch: string): string => {
  const hanjaStems = stemToHanja[stem] || stem;
  const hanjaBranch = branchToHanja[branch] || branch;
  return `${hanjaStems}${hanjaBranch}`;
};
