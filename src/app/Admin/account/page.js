import { AuthGuard } from "../../../../Commponets/AuthGuard/AuthGuard";
import BankAccountsPage from "./AccountPage/accounrPage";

export const metaData = {
  title: "Admin Bank Account | BB",
  description: "Welcome to the Admin Bank Account of our application.",
  openGraph: {
    title: "BB - Admin Bank Account",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BB Admin Bank Account",
      },
    ],
  },
};

export default function account() {
    return (
        <AuthGuard requiredRole="admin">
          <BankAccountsPage />
        </AuthGuard>
    )
}