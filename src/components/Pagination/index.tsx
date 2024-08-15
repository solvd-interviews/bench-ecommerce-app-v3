import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import type { ProductTableState } from "@/components/ProductTable/types";
import { UserTableState } from "../UserTable/types";

interface PaginationProps {
  pages: number;
  limit: number;
  setState:
    | Dispatch<SetStateAction<ProductTableState>>
    | Dispatch<SetStateAction<UserTableState>>;
  loading: boolean;
}

function Pagination({
  pages,
  limit,
  setState,
  loading = true,
}: PaginationProps) {
  //Set number of pages
  const numberOfPages = useMemo(() => {
    const pagesArray = [];
    for (let i = 1; i <= pages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }, [pages]);

  // Current active button number
  const [currentButton, setCurrentButton] = useState(1);

  // Array of buttons what we see on the page
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState<any[]>([]);

  useEffect(() => {
    let tempNumberOfPages: any[] = [...arrOfCurrButtons];

    let dotsInitial = "...";
    let dotsLeft = "... ";
    let dotsRight = " ...";

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currentButton >= 1 && currentButton <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentButton === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numberOfPages.slice(currentButton - 2, currentButton); // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numberOfPages.slice(currentButton, currentButton + 1); // sliced1 (5, 5+1) -> [6]
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numberOfPages.length,
      ]; // [1, '...', 4, 5, 6, '...', 10]
    } else if (currentButton > numberOfPages.length - 3) {
      // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 4); // slice(10-4)
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (String(currentButton) === dotsInitial) {
      // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 4 + 1 = 5
      // or
      // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
      // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
      setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
    } else if (String(currentButton) === dotsRight) {
      setCurrentButton(arrOfCurrButtons[3] + 2);
    } else if (String(currentButton) === dotsLeft) {
      setCurrentButton(arrOfCurrButtons[3] - 2);
    }

    setArrOfCurrButtons(tempNumberOfPages);
    setState((prevState: any) => ({ ...prevState, page: currentButton }));
  }, [currentButton, arrOfCurrButtons, numberOfPages, setState]);
  if (loading) {
    return (
      <div
        id="src-components-pagination-index-mainContainerLoading"
        className="flex justify-center items-center w-full py-1 relative gap-1"
      >
        <label
          id="src-components-pagination-index-mainContainer-label"
          className="flex items-center gap-2 md:absolute md:left-2"
        >
          <p
            id="src-components-pagination-index-mainContainer-label-p"
            className="text-stone-500 hidden md:flex"
          >
            Rows per page
          </p>
          <select
            id="src-components-pagination-index-mainContainer-label-select"
            className="select select-bordered w-full max-w-24"
            value={limit}
            onChange={(e) => {
              setState((prevState: any) => ({
                ...prevState,
                limit: parseInt(e.target.value, 10), // Ensure the value is an integer
              }));
            }}
          >
            <option
              id="src-components-pagination-index-mainContainer-label-select-option-1"
              value="1"
            >
              1
            </option>
            <option
              value="3"
              id="src-components-pagination-index-mainContainer-label-select-option-3"
            >
              3
            </option>
            <option
              value="5"
              id="src-components-pagination-index-mainContainer-label-select-option-5"
            >
              5
            </option>
            <option
              value="10"
              id="src-components-pagination-index-mainContainer-label-select-option-10"
            >
              10
            </option>
            <option
              value="20"
              id="src-components-pagination-index-mainContainer-label-select-option-20"
            >
              20
            </option>
            <option
              value="50"
              id="src-components-pagination-index-mainContainer-label-select-option-50"
            >
              50
            </option>
            <option
              value="100"
              id="src-components-pagination-index-mainContainer-label-select-option-100"
            >
              100
            </option>
          </select>
        </label>

        <button
          id="src-components-pagination-index-mainContainer-btnPrev"
          className="btn btn-primary shadow-xl btn-disabled"
          disabled
        >
          Prev
        </button>
        <button
          id="src-components-pagination-index-mainContainer-btn1"
          className=" flex justify-center items-center rounded-md font-bold btn btn-primary  shadow-xl text-white"
        >
          1
        </button>
        <button
          id="src-components-pagination-index-mainContainer-btn2"
          className=" flex justify-center items-center rounded-md font-bold btn btn-primary  shadow-xl btn-disabled text-white"
          disabled
        >
          2
        </button>
        <button
          id="src-components-pagination-index-mainContainer-btnNext"
          className=" btn btn-primary shadow-xl btn-disabled"
          disabled
        >
          Next
        </button>
      </div>
    );
  }
  return (
    <div
      id="src-components-pagination-index-mainContainer"
      className=" flex justify-center items-center w-full py-1 relative gap-1"
    >
      <label
        className="flex items-center gap-2 md:absolute md:left-2 "
        id="src-components-pagination-index-mainContainer-label"
      >
        <p
          className="text-stone-500 hidden md:flex"
          id="src-components-pagination-index-mainContainer-label-p"
        >
          Rows per page
        </p>
        <select
          className="select select-bordered  w-full max-w-20  md:max-w-24"
          id="src-components-pagination-index-mainContainer-label-select"
          value={limit}
          onChange={(e) =>
            setState((prevState: any) => ({
              ...prevState,
              limit: parseFloat(e.target.value),
            }))
          }
        >
          <option
            disabled
            id="src-components-pagination-index-mainContainer-label-select-option-title"
          >
            Pick your product limit
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-1">
            1
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-3">
            3
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-5">
            5
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-10">
            10
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-20">
            20
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-50">
            50
          </option>
          <option id="src-components-pagination-index-mainContainer-label-select-option-100">
            100
          </option>
        </select>
      </label>
      <button
        id="src-components-pagination-index-mainContainer-btnPrev"
        className={`  btn btn-primary shadow-xl hidden md:flex  ${
          currentButton === 1 ? "btn-disabled" : ""
        }`}
        disabled={currentButton === 1 ? true : false}
        onClick={() =>
          setCurrentButton((prev) => (prev <= 1 ? prev : prev - 1))
        }
      >
        Prev
      </button>

      {arrOfCurrButtons.map((item, index) => {
        return (
          <button
            id={"src-components-pagination-index-mainContainer-btn" + index + 1}
            key={index}
            className={` flex justify-center items-center rounded-md font-bold btn btn-primary shadow-xl  ${
              currentButton === item ? "" : "bg-opacity-40"
            }`}
            onClick={() => setCurrentButton(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        id="src-components-pagination-index-mainContainer-btnNext"
        className={`btn btn-primary shadow-xl hidden md:flex  ${
          currentButton === numberOfPages.length ? "btn-disabled" : ""
        }`}
        disabled={currentButton === numberOfPages.length ? true : false}
        onClick={() =>
          setCurrentButton((prev) =>
            prev >= numberOfPages.length ? prev : prev + 1
          )
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
