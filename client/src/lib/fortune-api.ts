import { OpenAI } from "openai";
import { SajuResult } from "./saju";

// OpenAI 클라이언트 초기화
// Vercel 배포 환경에서는 클라이언트 측에서 호출 시 dangerouslyAllowBrowser 옵션이 필요합니다.
// 주의: 실제 상용 서비스에서는 API 키 노출 방지를 위해 백엔드 프록시를 사용하는 것이 권장됩니다.
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true
});

export interface FortuneSection {
  title: string;
  content: string;
}

const stemNames: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

const branchNames: Record<string, string> = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

function getSajuString(saju: SajuResult) {
  return `
    생년월일: ${saju.birthDate.toLocaleDateString()}
    성별: ${saju.gender === 'male' ? '남성' : '여성'}
    사주팔자:
    - 연주: ${saju.yearPillar.stem}${saju.yearPillar.branch} (${stemNames[saju.yearPillar.stem]}${branchNames[saju.yearPillar.branch]}년)
    - 월주: ${saju.monthPillar.stem}${saju.monthPillar.branch} (${stemNames[saju.monthPillar.stem]}${branchNames[saju.monthPillar.branch]}월)
    - 일주: ${saju.dayPillar.stem}${saju.dayPillar.branch} (${stemNames[saju.dayPillar.stem]}${branchNames[saju.dayPillar.branch]}일)
    - 시주: ${saju.hourPillar.stem}${saju.hourPillar.branch} (${stemNames[saju.hourPillar.stem]}${branchNames[saju.hourPillar.branch]}시)
  `;
}

async function fetchFortune(saju: SajuResult, type: string, prompt: string): Promise<FortuneSection> {
  const sajuInfo = getSajuString(saju);
  
  if (!client.apiKey) {
    return { title: `${type} 분석`, content: "API 키가 설정되지 않았습니다. 관리자에게 문의해주세요." };
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Vercel 환경에서 안정적인 모델로 변경
      messages: [
        {
          role: "system",
          content: "당신은 20년 경력의 전문 사주 명리학자입니다. 사용자의 사주 정보를 바탕으로 깊이 있고 상세한 운세 풀이를 제공합니다. 답변은 반드시 한국어로 작성하며, 문학적인 비유를 섞어 풍부하고 길게 서술해주세요."
        },
        {
          role: "user",
          content: `다음 사주 정보를 바탕으로 ${type}에 대해 상세히 풀이해주세요.\n\n${sajuInfo}\n\n지시사항: ${prompt}`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || "운세를 불러오는 데 실패했습니다.";
    
    const lines = content.split('\n').filter(l => l.trim() !== '');
    let title = `${type} 분석`;
    let finalContent = content;

    if (lines.length > 0 && lines[0].length < 50 && (lines[0].includes('운') || lines[0].includes(':') || lines[0].startsWith('#'))) {
      title = lines[0].replace(/^[#\s*]+|[#\s*]+$/g, '');
      finalContent = lines.slice(1).join('\n\n');
    }

    return { title, content: finalContent };
  } catch (error: any) {
    console.error(`Error fetching ${type}:`, error);
    return { title: `${type} 분석`, content: `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}` };
  }
}

export const fortuneApi = {
  fetchEarlyLife: (saju: SajuResult) => 
    fetchFortune(saju, "초년운 (1세~27세)", "당신의 어린 시절과 청년기의 운명을 상세하고 길게, 비유를 섞어서 서술해줘. 성장 과정에서의 특징과 배움의 기운을 중심으로 작성해줘."),
  
  fetchMidLife: (saju: SajuResult) => 
    fetchFortune(saju, "중년운 (28세~57세)", "당신의 인생 황금기인 중년의 운명을 상세하고 길게, 비유를 섞어서 서술해줘. 사회적 성취, 가정의 안정, 인생의 전환점을 중심으로 작성해줘."),
  
  fetchLateLife: (saju: SajuResult) => 
    fetchFortune(saju, "말년운 (58세 이후)", "당신의 노후와 말년의 운명을 상세하고 길게, 비유를 섞어서 서술해줘. 평온함, 건강, 후손과의 관계, 정신적 풍요를 중심으로 작성해줘."),
  
  fetchWealth: (saju: SajuResult) => 
    fetchFortune(saju, "재물운", "당신의 평생 재물 흐름을 상세하고 길게, 비유를 섞어서 서술해줘. 돈이 들어오는 통로, 자산 관리의 지혜, 주의해야 할 시기를 중심으로 작성해줘."),
  
  fetchCareer: (saju: SajuResult) => 
    fetchFortune(saju, "직업운", "당신의 천직과 사회적 활동의 운명을 상세하고 길게, 비유를 섞어서 서술해줘. 어울리는 직업군, 조직 내에서의 역할, 성공을 위한 조언을 중심으로 작성해줘."),

  fetchYearlyGeneral: (saju: SajuResult) => 
    fetchFortune(saju, "2026년 병오년 총운", "2026년 병오년(붉은 말의 해)의 전체적인 흐름을 상세하고 길게, 비유를 섞어서 서술해줘. 하늘의 기운과 땅의 기운이 당신에게 미치는 영향을 중심으로 작성해줘."),
};
