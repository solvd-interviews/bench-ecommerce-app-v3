import { render, screen, fireEvent, act } from "@testing-library/react";
import Page from "./page";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Product Creation Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const setup = () => render(<Page />);

  it("should render the product creation form without crashing", () => {
    fetchMock.mockResponseOnce(JSON.stringify({ categories: [] })); // Mock the API call

    setup();
    expect(screen.getByText(/Create a Product/i)).toBeInTheDocument();
  });

  it("should allow entering a name", () => {
    fetchMock.mockResponseOnce(JSON.stringify({ categories: [] })); // Mock the API call

    setup();
    const inputElement = screen.getByPlaceholderText(
      "Playstation 4"
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "New Product" } });
    expect(inputElement.value).toBe("New Product");
  });

  it("should handle form submission with empty inputs", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ categories: [] })); // Mock the API call

    setup();
    const NextButton = screen.getByText(/Next/i);
    await act(async () => {
      fireEvent.click(NextButton);
    });
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
  });
});
