import AdminSignupPage from "./signup/signupPage";

export const metaData = {
  title: "signup  | BB",
  description: "Welcome to the Signup page of our application.",
  openGraph: {
    title: "BB - Signup",
    description: "Get Your Beauty look here.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BB Signup",
      },
    ],
  },
};

export default function signup() {
  return (
    <div>
      <AdminSignupPage />
    </div>
  );
}