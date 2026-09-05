import { Suspense } from "react";
import Footer from "../../../../Commponets/Footer/Footer";
import NavBar from "../../../../Commponets/Header/NavBar";
import Home from "./Dashboard/home";
import Loading from "../checkout/Comp/Loading";

export const metaData = {
  title: "Home  | BB",
  description: "Welcome to the Home page of our application.",
  openGraph: {
    title: "BB - Home",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg",
        width: 1200,
        height: 630,
        alt: "BB Home",
      },
    ],
  },
  keywords: ["home", "dashboard", "main"],
};

export default function dashboard() {
  return (
    <div className="m-4">
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <Loading />
          </div>
        }
      >
        <NavBar />
        <Home />
        <Footer />
      </Suspense>
    </div>
  );
}
