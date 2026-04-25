import json
from openai import OpenAI

client = OpenAI()

zodiac_signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

zodiac_data = {}

def get_zodiac_interpretation(sign):
    prompt = f"""
    서양 점성술에서 '{sign}'(별자리)에 대한 현대적인 해석을 작성해줘.
    다음 세 가지 항목을 포함해야 해:
    1. 기본 성향 및 특징 (3문장)
    2. 현대 사회에서의 강점과 직업 조언 (2문장)
    3. 행운을 부르는 조언 (2문장)
    
    한국어로 작성하고, 공손하고 전문적인 말투를 사용해줘.
    """
    
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

print("Generating Zodiac data...")
for sign in zodiac_signs:
    print(f"Processing {sign}...")
    zodiac_data[sign] = get_zodiac_interpretation(sign)

with open('/home/ubuntu/muun/client/src/lib/zodiac-data.json', 'w', encoding='utf-8') as f:
    json.dump(zodiac_data, f, ensure_ascii=False, indent=2)

print("Zodiac data generation complete.")
