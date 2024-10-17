/**
 * This file will contain all the logic of product details. Once changed here,
 */

export const logicRules = {
  product: {
    name: {
      minName: 3,
      maxName: 40,
    },
    price: {
      minPrice: 1,
      maxPrice: 1000000,
    },
    description: {
      minDesc: 10,
      maxDesc: 90,
    },
    stock: {
      minStock: 0,
      maxStock: 1000000,
    },
    images: {
      minImg: 1,
      maxImg: 6,
    },
  },
  category: {
    name: {
      minName: 3,
      maxName: 40,
    },
    description: {
      minDesc: 10,
      maxDesc: 90,
    },
  },
  user: {
    name: {
      min: 3,
      max: 40,
    },
    email: {
      min: 3,
      max: 40,
    },
    password: {
      min: 6,
      max: 40,
    },
  },
};
