import UserTable from "@/components/UserTable";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div
        id="src-app-admin-users-page-menuContainer"
        className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center "
      >
        <div className="flex-1"></div>
        <h2
          className="md:text-3xl font-bold text-center flex-1"
          id="src-app-admin-users-page-contentContainer-title"
        >
          User dashboard
        </h2>
        <div
          className="flex-1 flex items-center justify-end"
          id="src-app-admin-users-page-contentContainer-subContainer"
        >
          <button
            className="btn btn-primary "
            id="src-app-admin-users-page-contentContainer-subContainer-button"
          >
            <Link
              href={"/admin/products/create"}
              className="flex items-center gap-2"
              id="src-app-admin-users-page-contentContainer-subContainer-button-Link"
            >
              <p
                className="hidden lg:flex"
                id="src-app-admin-users-page-contentContainer-subContainer-button-Link-p1"
              >
                Create a new user
              </p>
              <p
                className=" lg:hidden"
                id="src-app-admin-users-page-contentContainer-subContainer-button-Link-p2"
              >
                Create
              </p>
            </Link>
          </button>
        </div>
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
