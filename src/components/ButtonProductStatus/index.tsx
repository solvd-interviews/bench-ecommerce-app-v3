const ButtonProductStatus = ({
  isPaid = false,
  isDelivered = false,
  deliveredAt,
  paidAt,
  type,
  id,
}: {
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  type: "pay" | "ship";
  deliveredAt?: string;
  id?: string;
}) => {
  const baseClass = "btn max-w-64 text-sm sm:text-base py-2 sm:py-3 h-auto min-h-12 sm:h-10 flex items-center justify-center";
  const buttonClass = `${baseClass} btn-primary`;
  const warningButtonClass = `${baseClass} btn-warning`;
  const neutralButtonClass = `${baseClass} btn-neutral`;

  switch (type) {
    case "pay":
      if (isPaid && paidAt) {
        return (
          <div
            className={buttonClass}
            id={id || "payment-status-paid"}
          >
            <span className="text-center">
              Paid on {paidAt.split("T")[0]} at{" "}
              {paidAt.split("T")[1].split(".")[0]}
            </span>
          </div>
        );
      } else {
        return (
          <div
            className={warningButtonClass}
            id={id || "payment-status-not-paid"}
          >
            Not Paid yet.
          </div>
        );
      }
    case "ship":
      if (isPaid) {
        if (isDelivered && deliveredAt) {
          return (
            <div
              className={buttonClass}
              id={id || "shipping-status-delivered"}
            >
              <span className="text-center">
                Delivered on {deliveredAt.split("T")[0]} at{" "}
                {deliveredAt.split("T")[1].split(".")[0]}
              </span>
            </div>
          );
        } else {
          return (
            <div
              className={warningButtonClass}
              id={id || "shipping-status-not-delivered"}
            >
              Not delivered yet.
            </div>
          );
        }
      } else {
        return (
          <button
            className={neutralButtonClass}
            id={id || "shipping-status-payment-required"}
          >
            Payment required for shipping.
          </button>
        );
      }
  }
};

export default ButtonProductStatus;
