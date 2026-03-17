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
        /* Trust Bar — 카드 아님, AppBar와 이어지는 흰 영역 */
        .mu-trust-bar {
          background: #FFFFFF;
          border-radius: 0;
          box-shadow: none;
          border: none;
          border-bottom: 1px solid #E5E8EB;
          margin: 0;
          padding: 14px 18px;
          display: flex;
          align-items: stretch;
        }
        .mu-trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 0;
          border-right: 1px solid #E5E8EB;
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
          color: #191F28;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 2px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-trust-lbl {
          font-size: 11px;
          font-weight: 500;
          color: #B0B8C1;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
      `}</style>
    </div>
  );
}
