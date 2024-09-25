import OrderTable from "@/components/OrderTable";

const Page = () => {
  return (
    <>
      <div
        id="src-app-admin-orders-page-menuContainer"
        className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center "
      >
        <h2
          className="md:text-3xl font-bold text-center flex-1"
          id="src-app-admin-orders-page-contentContainer-title"
        >
          Orders dashboard
        </h2>
      </div>
      <div
        id="src-app-admin-orders-page-contentContainer"
        className="flex-grow overflow-hidden flex flex-col "
      >
        <OrderTable />
      </div>
    </>
  );
};

export default Page;
