export const metadata = {
  title: 'Simple CMS',
  description: 'Next.js + Spring Boot CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}


