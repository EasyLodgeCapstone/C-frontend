import { AuthGuard } from "../../../../../Commponets/AuthGuard/AuthGuard";
import EditProductPage from "./editPage/editPage";

export const metaData = {
  title: "Admin Product Edit | BB",
  description: "Welcome to the Admin Product Edit of our application.",
  openGraph: {
    title: "BB - Admin Product Edit",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg",
        width: 1200,
        height: 630,
        alt: "BB Admin Product Edit",
      },
    ],
  },
};

export default function edit() {
    return (
        <AuthGuard requiredRole="admin">
          <EditProductPage />
        </AuthGuard>
      );
}