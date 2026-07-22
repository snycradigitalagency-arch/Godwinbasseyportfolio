import { Cursor } from "@/components/motion/Cursor";
import { PageLoader } from "@/components/motion/PageLoader";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <Cursor />
      <AnalyticsBeacon />
      <GoogleAnalytics />
      <Nav />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
