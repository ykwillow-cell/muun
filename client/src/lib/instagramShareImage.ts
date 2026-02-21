import { ExtendedDailyFortuneResult } from "./dailyFortuneExtended";

/**
 * 인스타그램 스토리 규격(9:16)으로 오늘의 운세를 요약한 이미지를 생성합니다.
 * html2canvas를 사용하여 DOM 요소를 이미지로 변환합니다.
 */

export interface InstagramShareOptions {
  userName: string;
  fortune: ExtendedDailyFortuneResult;
  templateStyle?: "modern" | "classic";
}

/**
 * 인스타그램 스토리용 HTML 템플릿 생성
 */
export function generateInstagramTemplate(
  options: InstagramShareOptions
): HTMLDivElement {
  const { userName, fortune, templateStyle = "modern" } = options;

  // 컨테이너 생성
  const container = document.createElement("div");
  container.style.width = "1080px";
  container.style.height = "1920px";
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.fontFamily = "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif";
  container.style.backgroundColor = "#0f1729";
  container.style.color = "#ffffff";
  container.style.overflow = "hidden";

  if (templateStyle === "modern") {
    container.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 60px 40px;
        background: linear-gradient(135deg, #0f1729 0%, #1a2847 100%);
        position: relative;
      ">
        <!-- 배경 효과 -->
        <div style="
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        "></div>

        <!-- 상단: 점수 및 상태 -->
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          z-index: 1;
        ">
          <!-- 사용자명 -->
          <div style="
            font-size: 32px;
            font-weight: 600;
            color: #ffd700;
            text-align: center;
          ">
            ${userName}님의 오늘
          </div>

          <!-- 점수 원 -->
          <div style="
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background: conic-gradient(
              from 0deg,
              #fbbf24 0deg,
              #f97316 ${(fortune.score / 100) * 360}deg,
              rgba(255, 255, 255, 0.1) ${(fortune.score / 100) * 360}deg
            );
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 60px rgba(255, 215, 0, 0.3);
          ">
            <div style="
              width: 240px;
              height: 240px;
              border-radius: 50%;
              background: #0f1729;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 10px;
            ">
              <div style="
                font-size: 80px;
                font-weight: 900;
                color: #ffffff;
              ">
                ${fortune.score}
              </div>
              <div style="
                font-size: 20px;
                color: #ffd700;
                font-weight: 700;
              ">
                ${fortune.status}
              </div>
            </div>
          </div>

          <!-- 한 줄 평 -->
          <div style="
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            line-height: 1.4;
            color: #ffffff;
            max-width: 100%;
          ">
            ${fortune.oneLiner}
          </div>
        </div>

        <!-- 중단: 액션 정보 -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1;
        ">
          <!-- Lucky Action -->
          <div style="
            background: rgba(34, 197, 94, 0.15);
            border: 2px solid #22c55e;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            gap: 15px;
            align-items: flex-start;
          ">
            <div style="
              font-size: 32px;
              flex-shrink: 0;
            ">✓</div>
            <div>
              <div style="
                font-size: 16px;
                font-weight: 600;
                color: #22c55e;
                margin-bottom: 8px;
              ">하면 좋은 것</div>
              <div style="
                font-size: 18px;
                color: #ffffff;
                line-height: 1.3;
              ">
                ${fortune.luckyAction}
              </div>
            </div>
          </div>

          <!-- Warning Action -->
          <div style="
            background: rgba(239, 68, 68, 0.15);
            border: 2px solid #ef4444;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            gap: 15px;
            align-items: flex-start;
          ">
            <div style="
              font-size: 32px;
              flex-shrink: 0;
            ">✕</div>
            <div>
              <div style="
                font-size: 16px;
                font-weight: 600;
                color: #ef4444;
                margin-bottom: 8px;
              ">피해야 할 것</div>
              <div style="
                font-size: 18px;
                color: #ffffff;
                line-height: 1.3;
              ">
                ${fortune.warningAction}
              </div>
            </div>
          </div>
        </div>

        <!-- 하단: 키워드 및 로고 -->
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 1;
        ">
          <!-- 키워드 -->
          <div style="
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            ${fortune.keywords.map(kw => `
              <div style="
                background: rgba(255, 215, 0, 0.2);
                border: 1px solid #ffd700;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 600;
                color: #ffd700;
              ">
                #${kw}
              </div>
            `).join("")}
          </div>

          <!-- 로고 -->
          <div style="
            font-size: 28px;
            font-weight: 900;
            color: #ffd700;
            letter-spacing: 2px;
            margin-top: 10px;
          ">
            MUUN
          </div>
          <div style="
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          ">
            무운 - 30년 내공의 명리학 운세
          </div>
        </div>
      </div>
    `;
  } else {
    // Classic 템플릿 (기본)
    container.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 60px 40px;
        background: linear-gradient(180deg, #0f1729 0%, #1a2847 100%);
        text-align: center;
      ">
        <div style="font-size: 36px; font-weight: 700; color: #ffd700; margin-bottom: 20px;">
          ${userName}님의 오늘의 운세
        </div>
        <div style="font-size: 120px; font-weight: 900; color: #ffd700; margin: 30px 0;">
          ${fortune.score}
        </div>
        <div style="font-size: 48px; font-weight: 700; color: #ffffff; margin-bottom: 40px;">
          ${fortune.status}
        </div>
        <div style="font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.5; margin-bottom: 40px;">
          ${fortune.oneLiner}
        </div>
        <div style="font-size: 18px; color: rgba(255, 255, 255, 0.8);">
          MUUN - 무운 운세 서비스
        </div>
      </div>
    `;
  }

  return container;
}

/**
 * 인스타그램 스토리 이미지 생성 및 다운로드
 */
export async function generateAndDownloadInstagramImage(
  options: InstagramShareOptions
): Promise<void> {
  try {
    // html2canvas 동적 import
    const html2canvas = (await import("html2canvas")).default;

    // 템플릿 생성
    const template = generateInstagramTemplate(options);
    document.body.appendChild(template);

    // 이미지 생성
    const canvas = await html2canvas(template, {
      width: 1080,
      height: 1920,
      scale: 2,
      backgroundColor: "#0f1729",
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // 템플릿 제거
    document.body.removeChild(template);

    // 다운로드
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `muun_fortune_${options.userName}_${new Date().toISOString().split("T")[0]}.png`;
    link.click();
  } catch (error) {
    console.error("Failed to generate Instagram image:", error);
    throw new Error("인스타그램 이미지 생성에 실패했습니다.");
  }
}

/**
 * 인스타그램 스토리 이미지를 Base64 데이터 URL로 생성
 */
export async function generateInstagramImageAsDataURL(
  options: InstagramShareOptions
): Promise<string> {
  try {
    const html2canvas = (await import("html2canvas")).default;

    const template = generateInstagramTemplate(options);
    document.body.appendChild(template);

    const canvas = await html2canvas(template, {
      width: 1080,
      height: 1920,
      scale: 2,
      backgroundColor: "#0f1729",
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    document.body.removeChild(template);

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to generate Instagram image as data URL:", error);
    throw new Error("인스타그램 이미지 생성에 실패했습니다.");
  }
}
