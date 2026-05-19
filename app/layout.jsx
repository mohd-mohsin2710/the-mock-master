import "./globals.css";

export const metadata = {
  title: "TheMockMaster",
  description: "SSC Exam Mock Test Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}