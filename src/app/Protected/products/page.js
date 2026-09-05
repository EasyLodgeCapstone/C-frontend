import { Suspense } from "react";
import NavBar from "../../../../Commponets/Header/NavBar";
import Products from "./Products/product";
import Loading from "./product/[slug]/Comp/Loading";

export const metaData = {
  title: "Products  | BB",
  description: "Welcome to the product page of our application.",
  openGraph: {
    title: "BB - Products",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg",
        width: 1200,
        height: 630,
        alt: "BB products",
      },
    ],
  },
};

export default function products() {
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
        <Products />
      </Suspense>
    </div>
  );
}
