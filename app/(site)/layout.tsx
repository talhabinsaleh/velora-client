import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const navUser = user ? { name: user.name, email: user.email, image: user.image, role: user.role } : null;
  return (
    <>
      <Navbar initialUser={navUser} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer signedIn={!!user} />
    </>
  );
}
