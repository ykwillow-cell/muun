export function TrustBar() {
  return (
    <div className="mu-trust-bar">
      <div className="mu-trust-item">
        <span className="mu-trust-num">1만+</span>
        <span className="mu-trust-lbl">누적 이용자</span>
      </div>
      <div className="mu-trust-divider" aria-hidden="true" />
      <div className="mu-trust-item">
        <span className="mu-trust-num">13가지</span>
        <span className="mu-trust-lbl">무료 서비스</span>
      </div>
      <div className="mu-trust-divider" aria-hidden="true" />
      <div className="mu-trust-item">
        <span className="mu-trust-num">정통 명리학</span>
        <span className="mu-trust-lbl">사주 이론 기반</span>
      </div>
      <style>{`
        .mu-trust-bar {
          background: #ffffff;
          display: flex;
          align-items: center;
          padding: 0 18px 14px;
        }
        .mu-trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 0;
        }
        .mu-trust-divider {
          width: 1px;
          height: 20px;
          background: #E5E8EB;
          flex-shrink: 0;
        }
        .mu-trust-num {
          font-size: 13px;
          font-weight: 800;
          color: #191F28;
          letter-spacing: -0.03em;
          line-height: 1.2;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-trust-lbl {
          font-size: 9px;
          font-weight: 500;
          color: #B0B8C1;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </div>
  );
}
