const ButtonProductStatus = ({
  isPaid = false,
  isDelivered = false,
  deliveredAt,
  paidAt,
  type,
}: {
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  type: "pay" | "ship";
  deliveredAt?: string;
}) => {
  switch (type) {
    case "pay":
      if (isPaid && paidAt) {
        return (
          <div className="btn btn-primary max-w-64">
            Paid on {paidAt.split("T")[0]} at{" "}
            {paidAt.split("T")[1].split(".")[0]}
          </div>
        );
      } else {
        return <div className="btn btn-warning max-w-64">Not Paid yet.</div>;
      }
    case "ship":
      deliveredAt;
      if (isPaid) {
        if (isDelivered && deliveredAt) {
          return (
            <div className="btn btn-primary max-w-64">
              Delivered on {deliveredAt.split("T")[0]} at{" "}
              {deliveredAt.split("T")[1].split(".")[0]}
            </div>
          );
        } else {
          return (
            <div className="btn btn-warning max-w-64">Not delivered yet.</div>
          );
        }
      } else {
        return (
          <button className="btn btn-neutral max-w-64">
            Payment required to shipping.
          </button>
        );
      }
  }
};

export default ButtonProductStatus;
