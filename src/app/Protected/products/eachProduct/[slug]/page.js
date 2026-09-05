import NavBar from "../../../../../../Commponets/Header/NavBar";
import EachProductPage from "./productsPage/ProductPages";

export const metadata = {
  title: "Products",
  description: "This is the Products page",
};

export default function eachProduct() {
  return (
    <div>
      <NavBar />
      <EachProductPage />
    </div>
  );
}
