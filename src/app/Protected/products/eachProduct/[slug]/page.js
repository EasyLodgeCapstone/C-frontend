import { AuthGuard } from "../../../../../../Commponets/AuthGuard/AuthGuard";
import NavBar from "../../../../../../Commponets/Header/NavBar";
import EachProductPage from "./productsPage/ProductPages";

export const metadata = {
  title: "Products",
  description: "This is the Products page",
};

export default function eachProduct() {
  return (
    <AuthGuard requiredRole="client">
      <div>
        <NavBar />
        <EachProductPage />
      </div>
    </AuthGuard>
  );
}
