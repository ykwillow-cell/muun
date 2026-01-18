import { toast } from "sonner";

interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

/**
 * 범용 공유 함수
 * 1. navigator.share 시도
 * 2. 실패 시 클립보드 복사 (Fallback)
 */
export async function shareContent(options: ShareOptions) {
  const shareUrl = options.url || window.location.href;
  const shareData = {
    title: options.title,
    text: options.text,
    url: shareUrl,
  };

  // 1. Native Share API 시도
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // 사용자가 취소한 경우는 무시
      if ((err as Error).name === 'AbortError') return;
      console.error('Native share failed:', err);
    }
  }

  // 2. 클립보드 복사 (Fallback)
  try {
    const fullText = `${options.title}\n\n${options.text}\n\n결과 확인하기: ${shareUrl}`;
    await navigator.clipboard.writeText(fullText);
    toast.success("결과가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣어 공유하세요!");
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    toast.error("공유하기에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
  }
}
