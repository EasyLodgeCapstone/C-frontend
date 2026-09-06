import { AuthGuard } from "../../../../Commponets/AuthGuard/AuthGuard";

export const metaData = {
  title: "Admin Dashboard | BB",
  description: "Welcome to the Admin Dashboard of our application.",
    openGraph: {
    title: "BB - Admin Dashboard",
    description: "Get Your Beauty look here.",
    images: [
        {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "BB Admin Dashboard",
        },
    ],
  },
};

export default function dashboard() {
    return (
         <AuthGuard requiredRole="admin">
            <h1>Admin Dashboard</h1>
        </AuthGuard>
    );
}