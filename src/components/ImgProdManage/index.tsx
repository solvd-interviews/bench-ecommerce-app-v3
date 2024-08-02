import { logicRules } from "@/lib/logic";
import Image from "next/image";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { UseFormSetValue } from "react-hook-form";
import { LuHand, LuX } from "react-icons/lu";
import { EditPage } from "../edit/[id]/page";
import { toast } from "sonner";

const ImgManagment = ({
  setValue,
  files,
  filesDeleted,
}: {
  setValue: UseFormSetValue<EditPage>;
  files: (string | File)[];
  filesDeleted?: string[];
}) => {
  const handleOnDrag = (result: DropResult) => {
    const originIndex = result.source?.index;
    const destinationIndex = result.destination?.index;
    console.log("originIndex destinationIndex", originIndex, destinationIndex);
    if (originIndex !== undefined && destinationIndex !== undefined) {
      console.log("true");
      const arrCopy = [...files];
      const destinAux = arrCopy[destinationIndex];
      arrCopy[destinationIndex] = arrCopy[originIndex];
      arrCopy[originIndex] = destinAux;
      setValue("files", arrCopy);
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        className="file-input file-input-bordered w-full "
        accept="image/png, image/jpg, image/jpeg"
        onChange={(e) => {
          if (e.target.files && e.target.files?.length > 0) {
            const fileArray = Array.from(e.target.files);
            const max = logicRules.product.images.max;
            if (files.length + fileArray.length > max) {
              toast.error(`You can only upload up to ${max} files.`);
              return;
            }

            setValue("files", [...files, ...fileArray]);
          }
        }}
      />
      <div className="overflow-y-auto p-2 h-full  max-h-72">
        <table className="table-auto w-full relative">
          <thead className="relative w-full">
            <tr className="text-left relative w-full">
              <th className="px-4 py-2">Index</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <DragDropContext onDragEnd={(e) => handleOnDrag(e)}>
            <Droppable droppableId="editFiles">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="editFiles relative w-full"
                >
                  {files.length < 1 && (
                    <tr className="mt-10">
                      <td colSpan={5} className="text-center">
                        <div className="w-full">
                          <p className="text-gray-700 text-xl">No images.</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {files.map((e, index: number) => (
                    <Draggable
                      key={JSON.stringify(
                        typeof e === "string" ? e : e.name + e.size
                      )}
                      draggableId={JSON.stringify(
                        typeof e === "string" ? e : e.name + e.size
                      )}
                      index={index}
                    >
                      {(provided2) => (
                        <tr
                          className="border-b relative p-0 m-0 "
                          {...provided2.draggableProps}
                          {...provided2.dragHandleProps}
                          ref={provided2.innerRef}
                        >
                          {typeof e === "string" ? (
                            <>
                              <td className="px-4 py-2  w-28">
                                <div>{index + 1}</div>
                              </td>
                              <td className="px-4 py-2   w-28">
                                <div>-</div>
                              </td>
                              <td className="px-4 py-2   w-28">
                                <div>Old</div>
                              </td>
                              <td className="px-4 py-2   w-28">
                                <div>
                                  <Image
                                    src={e}
                                    width={60}
                                    height={60}
                                    alt={`Image ${index + 1}`}
                                    className="overflow-hidden shadow-xl max-w-14 max-h-14"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2   w-28">
                                <div className="flex gap-2">
                                  <LuX
                                    size={20}
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                      setValue(
                                        "files",
                                        files.filter(
                                          (_, i: number) => index !== i
                                        )
                                      );

                                      if (filesDeleted) {
                                        setValue("filesDeleted", [
                                          ...filesDeleted,
                                          e,
                                        ]);
                                      }
                                    }}
                                  />
                                  <LuHand size={20} />
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-2 w-28">{index + 1}</td>
                              <td className="px-4 py-2 w-28">
                                {e.name.slice(0, 20)}
                              </td>
                              <td className="px-4 py-2 w-28">New</td>

                              <td className="px-4 py-2 w-28">
                                <div className="max-w-10 max-h-10 overflow-hidden">
                                  <Image
                                    src={URL.createObjectURL(e)}
                                    width={60}
                                    height={50}
                                    alt={e.name}
                                    className="overflow-hidden shadow-xl "
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2 w-28">
                                <button
                                  className="flex gap-2"
                                  onClick={() => {
                                    setValue(
                                      "files",
                                      files.filter(
                                        (_, i: number) => index !== i
                                      )
                                    );
                                  }}
                                >
                                  <LuX size={20} /> <LuHand size={20} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
    </>
  );
};

export default ImgManagment;
