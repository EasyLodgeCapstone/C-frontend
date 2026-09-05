import NavBar from "../../../../Commponets/Header/NavBar";
import ContactPage from "./Contact/contact";

export const metaData = {
  title: "Contact  | BB",
  description: "Welcome to the Contact page of our application.",
  openGraph: {
    title: "BB - Contact",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BB Contact",
      },
    ],
  },
};

export default function checkout() {
  return (
    <div className="m-4">
      <NavBar />
      <ContactPage />
    </div>
  );
}
