import UserTable from "@/components/UserTable";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div
        id="src-app-admin-users-page-menuContainer"
        className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center "
      >
        <h2
          className="md:text-3xl font-bold text-center flex-1"
          id="src-app-admin-users-page-contentContainer-title"
        >
          User dashboard
        </h2>
      </div>
      <div
        id="src-app-admin-users-page-contentContainer"
        className="flex-grow overflow-hidden flex flex-col "
      >
        <UserTable />
      </div>
    </>
  );
};

export default Page;
