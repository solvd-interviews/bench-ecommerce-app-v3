import { hashSync } from "bcrypt";

export const sampleData = {
  products: [
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc1",
      name: "Sauce Labs Backpack",
      description:
        "Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
      price: 29.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847902/bag_f8z6gw_wqtxic_igfvsk.png",
      ],
      isBlocked: false,
      stock: 10,
    },
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc2",
      name: "Sauce Labs Bike Light",
      description:
        "A red light isn't the desired state in testing but it sure helps",
      price: 9.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847903/bike-light_snzdnk_wlbrng_lmhz9o.png",
      ],
      isBlocked: false,
      stock: 5,
    },
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc3",
      name: "Sauce Labs Bolt T-Shirt",
      description:
        "Get your testing superhero on with the Sauce Labs bolt T-shirt.",
      price: 15.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847904/black-tshirt_mdghbp_w3l28m_op00ux.png",
      ],
      isBlocked: true,
      stock: 10,
    },
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc4",
      name: "Sauce Labs Fleece Jacket",
      description:
        "It's not every day that you come across a midweight quarter-zip fleece jacket.",
      price: 49.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847903/fleece-jacket_kznpkh_txr4pm_pwyjcn.png",
      ],
      isBlocked: false,
      stock: 10000,
    },
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc5",
      name: "Sauce Labs Onesie",
      description:
        "Rib snap infant onesie for the junior automation engineer in development.",
      price: 7.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847903/onesie_qva38p_zzev9t_lhjxgz.png",
      ],
      isBlocked: false,
      stock: 10,
    },
    {
      id: "bab48f2a-0c8d-40b8-92bd-49cd50026fc6",
      name: "T-Shirt (Red)",
      description:
        "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard.",
      price: 15.99,
      images: [
        "https://res.cloudinary.com/doxpkairh/image/upload/v1724847903/red-tshirt_ygrp5h_mkviue_lnn3iy.png",
      ],
      isBlocked: false,
      stock: 10,
    },
  ],
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: hashSync("123456", 5),
      isAdmin: true,
      isBlocked: true,
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: hashSync("123456", 5),
      isAdmin: false,
      isBlocked: false,
    },
    {
      name: "Bruno",
      email: "bruno@example.com",
      password: hashSync("123456", 5),
      isAdmin: false,
      isBlocked: true,
    },
  ],
};
