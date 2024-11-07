"use client";

import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import debounce from "lodash.debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { uuidv7 } from "uuidv7";
import { LuTrash } from "react-icons/lu";
import { LuX } from "react-icons/lu";
import { routeModule } from "next/dist/build/templates/app-page";

interface Suggestion {
  term: string;
}

interface searchHistory {
  id: string;
  search: string;
}
/*
TODO: IMPROVE CODE ORGANIZATION
*/

const HISTORY_KEY = "searchHistory"; // Key for localStorage

export default function SearchComponent() {
  /*
    Save the query in the url params and made it forwardable
  */
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState<string>(query || "");

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [searchHistory, setSearchHistory] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const saveSeachInHistory = useCallback((text: string) => {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const newHistory = {
      id: uuidv7(),
      search: text,
    };
    history = [newHistory, ...history].slice(0, 5); // Keep only the last 5 searches
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    setSearchHistory(history);
  }, []);

  const handleDeleteHistoryRecord = (id: string) => {
    // Load current history from localStorage
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

    // Filter out the record to delete
    history = history.filter((e: searchHistory) => e.id !== id);

    // Save the updated history to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    // Update the state
    setSearchHistory(history);
  };

  const fetchSuggestions = debounce(async (term: string) => {
    const res = await fetch(`/api/search?query=${term}`);
    const data: Suggestion[] = await res.json();
    setSuggestions(data);
  }, 300); // debounce API calls by 300ms

  const saveSearchTermOnDb = async (term: string) => {
    if (term) {
      await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term }),
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchSuggestions(term); // fetch suggestions as the user types
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("enter ", searchTerm);
      setSuggestions([]);
      saveSearchTermOnDb(searchTerm); // Save term when pressing Enter
      triggerFinalSearchRedirection(searchTerm);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.term);
    setSuggestions([]);
    saveSearchTermOnDb(suggestion.term); // Save term when a suggestion is clicked
    triggerFinalSearchRedirection(suggestion.term);
  };

  const triggerFinalSearchRedirection = (sug: string) => {
    if (sug && sug.trim()) {
      setShowModal(false);
      saveSeachInHistory(sug);
      const finalSearch = encodeURIComponent(sug); // Use URL encoding
      const finalURL = `/search?query=${finalSearch}&ascOrder=true&sortBy=name`;
      router.push(finalURL);
    }
  };

  const searchRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowModal(false); // Clear suggestions if click is outside of input and suggestions container
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className=" w-full md:w-60 relative" ref={searchRef}>
      <form className="z-20 relative">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-primary dark:focus:border-primary"
            placeholder="Search T-Shirts, Jackets..."
            required
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            autoComplete="off"
            onClick={() => setShowModal(true)}
          />
        </div>
      </form>

      {showModal && (
        <div className="absolute top-0 w-full p-2  bg-white  pt-16 rounded-xl shadow-xl overflow-hidden whitespace-nowrap overflow-ellipsis">
          {suggestions.length > 0 ? (
            <ul className="gap-1 flex flex-col">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="hover:bg-gray-50 cursor-pointer p-1 rounded-sm"
                >
                  {suggestion.term
                    .split(new RegExp(`(${searchTerm})`, "i"))
                    .map((part, i) => (
                      <span
                        key={i}
                        className={` ${
                          part.toLowerCase() === searchTerm.toLowerCase()
                            ? "text-primary font-bold"
                            : "normal"
                        }`}
                      >
                        {part}
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <div className="flex w-100 justify-between items-center mb-2">
                <h1>Search History</h1>
                {searchHistory.length > 0 && (
                  <div
                    className="hover:scale-105 text-primary cursor-pointer "
                    onClick={(event) => {
                      event.stopPropagation();
                      localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
                      setSearchHistory([]);
                    }}
                  >
                    <LuX />
                  </div>
                )}
              </div>
              {searchHistory.length > 0 ? (
                <ul className="gap-1 flex flex-col">
                  {searchHistory.map((e: searchHistory, i) => (
                    <li
                      key={i}
                      className="hover:bg-gray-50 cursor-pointer p-1 rounded-sm flex w-full justify-between items-center hover:underline decoration-primary"
                      onClick={() => {
                        handleSuggestionClick({ term: e.search });
                      }}
                    >
                      <div className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {e.search}
                      </div>
                      <div
                        className="hover:scale-105 text-primary "
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteHistoryRecord(e.id);
                        }}
                      >
                        <LuTrash />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No history.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
