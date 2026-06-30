import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageViewTracker from "@/components/client/analytics/PageViewTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="flex-grow px-4 pt-16 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </>
  );
}
