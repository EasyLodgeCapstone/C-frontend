import NavBar from "../../../../Commponets/Header/NavBar";
import CheckoutPage from "./checkout";

export const metaData = {
  title: "Checkout  | BB",
  description: "Welcome to the Checkout page of our application.",
  openGraph: {
    title: "BB - Checkout",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg",
        width: 1200,
        height: 630,
        alt: "BB Checkout",
      },
    ],
  },
};

export default function checkout() {
  return (
    <div className="m-4">
      <NavBar />
      <CheckoutPage />
    </div>
  );
}
