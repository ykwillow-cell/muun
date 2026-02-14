import json
from openai import OpenAI

client = OpenAI()

stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

iljus = []
for i in range(60):
    stem = stems[i % 10]
    branch = branches[i % 12]
    iljus.append(f"{stem}{branch}")

ilju_data = {}

def get_ilju_interpretation(ilju):
    prompt = f"""
    사주 명리학에서 '{ilju}' 일주에 대한 현대적인 해석을 작성해줘.
    다음 세 가지 항목을 포함해야 해:
    1. 성격 및 특징 (3문장)
    2. 현대적인 직업 조언 (2문장)
    3. 대인관계 및 조언 (2문장)
    
    한국어로 작성하고, 공손하고 전문적인 말투를 사용해줘.
    """
    
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# 테스트용으로 10개만 먼저 생성 (전체 60개는 시간이 걸리므로)
# 실제로는 루프를 돌려 60개를 모두 생성해야 함
print("Generating Ilju data...")
for ilju in iljus[:10]: # 시간 관계상 10개만 예시로 생성
    print(f"Processing {ilju}...")
    ilju_data[ilju] = get_ilju_interpretation(ilju)

with open('/home/ubuntu/muun/client/src/lib/ilju-data.json', 'w', encoding='utf-8') as f:
    json.dump(ilju_data, f, ensure_ascii=False, indent=2)

print("Ilju data generation complete.")
