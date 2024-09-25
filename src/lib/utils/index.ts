export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const getStartDate30DAgo = () =>
  new Date(new Date().setDate(new Date().getDate() - 30));

export const normalizeDate = (d: any) => {
  const normalized = new Date(d);
  normalized.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
  return normalized.getTime();
};

export const starter30DAgo = function () {
  const startDate = getStartDate30DAgo();
  const endDate = new Date();
  const allDates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { allDates };
};
