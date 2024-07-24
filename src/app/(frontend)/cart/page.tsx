import CartDetails from "./cartDetails";

export const metadata = {
  title: "Cart | Solvd",
};

const Cart = () => {
  return (
    <div className="bg-secondary w-full h-full p-2">
      <CartDetails />
    </div>
  );
};

export default Cart;
