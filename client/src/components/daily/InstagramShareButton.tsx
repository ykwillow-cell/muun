import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check } from "lucide-react";
import { ExtendedDailyFortuneResult } from "@/lib/dailyFortuneExtended";
import { generateAndDownloadInstagramImage, generateInstagramImageAsDataURL } from "@/lib/instagramShareImage";

interface InstagramShareButtonProps {
  fortune: ExtendedDailyFortuneResult;
  userName: string;
}

export function InstagramShareButton({ fortune, userName }: InstagramShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDownloadImage = async () => {
    setIsLoading(true);
    try {
      await generateAndDownloadInstagramImage({
        userName,
        fortune,
        templateStyle: "modern",
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("이미지 다운로드에 실패했습니다");
    } finally {
      setIsLoading(false);
      setShowMenu(false);
    }
  };

  const handleCopyImage = async () => {
    setIsLoading(true);
    try {
      const dataUrl = await generateInstagramImageAsDataURL({
        userName,
        fortune,
        templateStyle: "modern",
      });

      // 데이터 URL을 클립보드에 복사
      const blob = await (await fetch(dataUrl)).blob();
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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-2"
      >
        <Button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isLoading}
          className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          size="lg"
        >
          <Share2 className="w-4 h-4" />
          {isLoading ? "생성 중..." : "인스타 공유"}
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
      </motion.div>

      {/* 공유 메뉴 */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute bottom-full right-0 mb-2 w-48 bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-xl shadow-xl z-50"
        >
          <button
            onClick={handleDownloadImage}
            disabled={isLoading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">이미지 다운로드</span>
          </button>

          <div className="h-px bg-white/10" />

          <button
            onClick={handleCopyImage}
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
    </div>
  );
}
