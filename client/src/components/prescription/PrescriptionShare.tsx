import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check } from "lucide-react";
import { PrescriptionFortune } from "@/lib/prescriptionFortune";

interface PrescriptionShareProps {
  fortune: PrescriptionFortune;
  userName: string;
}

export function PrescriptionShare({
  fortune,
  userName,
}: PrescriptionShareProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const generateImageHTML = () => {
    return `
      <div style="
        width: 1080px;
        height: 1920px;
        background: linear-gradient(135deg, #0f1729 0%, #1a2847 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 60px 40px;
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
        color: white;
        position: relative;
        overflow: hidden;
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

        <!-- 상단: 타이틀 -->
        <div style="
          text-align: center;
          z-index: 1;
          margin-bottom: 40px;
        ">
          <div style="
            font-size: 32px;
            font-weight: 600;
            color: #ffd700;
            margin-bottom: 10px;
          ">
            ${userName}님의 오늘 처방전
          </div>
          <div style="
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          ">
            ${new Date().toLocaleDateString("ko-KR")}
          </div>
        </div>

        <!-- 중앙: 점수 원 -->
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
          z-index: 1;
          margin-bottom: 40px;
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
              color: white;
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

        <!-- 중단: 액션 정보 -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1;
          width: 100%;
          max-width: 600px;
          margin-bottom: 40px;
        ">
          <!-- 하면 좋은 행동 -->
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
              ">하면 좋은 행동</div>
              <div style="
                font-size: 14px;
                color: white;
                line-height: 1.4;
              ">
                ${fortune.luckyAction}
              </div>
            </div>
          </div>

          <!-- 조심할 행동 -->
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
              ">조심할 행동</div>
              <div style="
                font-size: 14px;
                color: white;
                line-height: 1.4;
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
            ${fortune.keywords
              .map(
                (kw) => `
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
            `
              )
              .join("")}
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
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      const container = document.createElement("div");
      container.innerHTML = generateImageHTML();
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        width: 1080,
        height: 1920,
        scale: 2,
        backgroundColor: "#0f1729",
        logging: false,
      });

      document.body.removeChild(container);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `muun_prescription_${userName}_${new Date().toISOString().split("T")[0]}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("이미지 다운로드에 실패했습니다");
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      const container = document.createElement("div");
      container.innerHTML = generateImageHTML();
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        width: 1080,
        height: 1920,
        scale: 2,
        backgroundColor: "#0f1729",
        logging: false,
      });

      document.body.removeChild(container);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
      alert("이미지 복사에 실패했습니다");
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="relative"
    >
      <div className="flex gap-3">
        <Button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isLoading}
          className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          size="lg"
        >
          <Share2 className="w-4 h-4" />
          {isLoading ? "생성 중..." : "인스타에 자랑하기"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          저장
        </Button>
      </div>

      {/* 공유 메뉴 */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute bottom-full right-0 mb-2 w-48 bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-xl shadow-xl z-50"
        >
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">이미지 다운로드</span>
          </button>

          <div className="h-px bg-white/10" />

          <button
            onClick={handleCopy}
            disabled={isLoading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">클립보드 복사</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
