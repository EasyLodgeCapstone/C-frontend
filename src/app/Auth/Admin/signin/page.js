import AdminSigninPage from "./signin/signinPage";

export const metaData = {
  title: "Signin  | BB",
  description: "Welcome to the Signin page of our application.",
  openGraph: {
    title: "BB - Signin",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BB Signin",
      },
    ],
  },
};

export default function signup() {
  return (
    <div>
      <AdminSigninPage />
    </div>
  );
}
