import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'RJ Industries';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: '#020202',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="https://rjindustries.vercel.app/logo.png"
          alt="RJ Industries Logo"
          style={{
            width: '600px',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
