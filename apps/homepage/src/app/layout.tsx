import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JSONBlog - A Simple, JSON-based Static Blog Generator',
  description: 'Create beautiful, fast blogs with just a JSON file. No complex setup, no database, just pure simplicity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
