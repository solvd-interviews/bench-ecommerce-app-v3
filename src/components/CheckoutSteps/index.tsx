export const CheckoutSteps = ({
  current = 0,
  list = ["User Login", "Shipping Address", "Payment Method", "Place Order"],
}) => {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4 font-bold text-gray-800 items-center">
      {list.map((step, index) => (
        <li
          key={step}
          id={`step-${index}`} // Unique ID for each step
          className={`step  
           ${index <= current ? "step-primary" : ""}
           `}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};
