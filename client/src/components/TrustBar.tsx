export function TrustBar() {
  return (
    <div className="mu-trust-bar">
      <div className="mu-trust-item">
        <span className="mu-trust-num">1만+</span>
        <span className="mu-trust-lbl">누적 이용자</span>
      </div>
      <div className="mu-trust-item">
        <span className="mu-trust-num">13가지</span>
        <span className="mu-trust-lbl">무료 서비스</span>
      </div>
      <div className="mu-trust-item mu-trust-item--last">
        <span className="mu-trust-num">정통 명리학</span>
        <span className="mu-trust-lbl">사주 이론 기반</span>
      </div>
      <style>{`
        /* Trust Bar — 히어로 딥 퍼플 배경과 연결 */
        .mu-trust-bar {
          background: linear-gradient(155deg, #12082e 0%, #1e0f4a 100%);
          border-radius: 0;
          box-shadow: none;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin: 0;
          padding: 12px 18px;
          display: flex;
          align-items: stretch;
        }
        .mu-trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 0;
          border-right: 1px solid rgba(255,255,255,0.10);
          border-radius: 0;
          box-shadow: none;
          text-align: center;
        }
        .mu-trust-item--last {
          border-right: none;
        }
        .mu-trust-num {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 2px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-trust-lbl {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.40);
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </div>
  );
}
