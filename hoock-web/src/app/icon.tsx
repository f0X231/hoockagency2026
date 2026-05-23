import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#1C2329',
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#CBA68B',
            fontSize: 22,
            fontWeight: 900,
            fontFamily: 'sans-serif',
            letterSpacing: '-1px',
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          H
        </div>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
