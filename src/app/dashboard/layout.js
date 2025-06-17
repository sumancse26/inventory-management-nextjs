import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import SideNav from "@/components/navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <Header />
      <MobileMenu />
      <SideNav />
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
