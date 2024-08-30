"use client";

import { toast } from "sonner";

const DeleteButton = ({
  id,
  text,
  deleteType,
}: {
  id: string;
  text: string;
  deleteType: string;
}) => {
  async function deleteLogic() {
    try {
      const resUsr = await fetch(`/api/generateData/${deleteType}`, {
        method: "DELETE",
      });
      await resUsr.json();
      toast.success(`Data was successfully generated.`);
    } catch (error) {
      toast.error("The data was NOT successfully generated. Try again later.");
    }
  }
  async function onClickFunction() {
    toast.custom((t) => (
      <div className=" flex flex-col gap-5 items-center bg-white p-5 rounded-xl shadow-xl border-2 ">
        <p className="text-2xl font-bold text-center">
          Are you sure to delete {deleteType}?
        </p>
        <div className="flex  gap-2">
          <button
            className="btn btn-neutral min-w-20"
            onClick={async () => {
              toast.dismiss(t);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-error min-w-20"
            onClick={() => {
              deleteLogic();
              toast.dismiss(t);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  }

  return (
    <button
      id={id}
      onClick={onClickFunction}
      className="min-w-40 border-2 border-red-800 rounded-lg px-4 py-2 bg-red-400 text-white "
    >
      {text}
    </button>
  );
};

export default DeleteButton;
