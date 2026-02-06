import { toast } from "sonner";
import { trackCustomEvent } from "@/lib/ga4";

interface ShareOptions {
  title: string;
  text: string;
  url?: string;
  /** GA4 추적용: 어떤 페이지에서 공유했는지 (예: 'yearly_fortune', 'compatibility') */
  page?: string;
  /** GA4 추적용: 버튼 유형 (예: 'icon', 'text_button') */
  buttonType?: string;
}

/**
 * 범용 공유 함수
 * 1. GA4 이벤트 전송 (공유 버튼 클릭 추적)
 * 2. navigator.share 시도
 * 3. 실패 시 클립보드 복사 (Fallback)
 */
export async function shareContent(options: ShareOptions) {
  const shareUrl = options.url || window.location.href;
  const shareData = {
    title: options.title,
    text: options.text,
    url: shareUrl,
  };

  // GA4 이벤트 추적: 공유 버튼 클릭
  try {
    trackCustomEvent("share_click", {
      page: options.page || "unknown",
      button_type: options.buttonType || "unknown",
      share_title: options.title,
      share_url: shareUrl,
    });
  } catch (e) {
    console.error("GA4 share tracking failed:", e);
  }

  // 1. Native Share API 시도
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      // 공유 성공 이벤트
      try {
        trackCustomEvent("share_success", {
          page: options.page || "unknown",
          method: "native_share",
        });
      } catch {}
      return;
    } catch (err) {
      // 사용자가 취소한 경우
      if ((err as Error).name === 'AbortError') {
        try {
          trackCustomEvent("share_cancel", {
            page: options.page || "unknown",
          });
        } catch {}
        return;
      }
      console.error('Native share failed:', err);
    }
  }

  // 2. 클립보드 복사 (Fallback)
  try {
    const fullText = `${options.title}\n\n${options.text}\n\n결과 확인하기: ${shareUrl}`;
    await navigator.clipboard.writeText(fullText);
    toast.success("결과가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣어 공유하세요!");
    // 클립보드 복사 성공 이벤트
    try {
      trackCustomEvent("share_success", {
        page: options.page || "unknown",
        method: "clipboard_copy",
      });
    } catch {}
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    toast.error("공유하기에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
    try {
      trackCustomEvent("share_fail", {
        page: options.page || "unknown",
      });
    } catch {}
  }
}
