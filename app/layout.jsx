import AuthProvider from "../components/AuthProvider";
import { ToastContainer } from "react-toastify"; // 1. Import Container
import "react-toastify/dist/ReactToastify.css"; // 2. Import CSS mandatory hai colored themes ke liye
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          {/* 3. Global Toast Container with Colored Theme */}
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" // <- Isse Success Green aur Error Red ekdum solid aur bright aayega
          />
        </AuthProvider>
      </body>
    </html>
  );
}