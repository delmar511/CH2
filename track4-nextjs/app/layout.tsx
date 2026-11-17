import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원 전용 Todo 리스트',
  description: 'Next.js + Supabase Todo App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 15px; color: #111; background: #f7f7f7; }
          a { color: #0070f3; text-decoration: none; }
          a:hover { text-decoration: underline; }
          input, button { font-size: 14px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
