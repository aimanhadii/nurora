import type { Metadata } from "next";
import { RedirectIfSignedIn } from "@/components/auth/RedirectIfSignedIn";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";

export const metadata: Metadata = {
  title: { absolute: "Nurora · A little light for your day" },
};

/** Public welcome + sign-in. Signed-in users go straight to the app. */
export default function WelcomePage() {
  return (
    <>
      <RedirectIfSignedIn />
      <WelcomeScreen />
    </>
  );
}
