import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#1C2329',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#CBA68B',
            fontSize: 120,
            fontWeight: 900,
            fontFamily: 'sans-serif',
            letterSpacing: '-4px',
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          H
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
