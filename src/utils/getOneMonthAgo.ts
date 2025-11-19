export const getOneMonthAgo = () => {
  const monthAgo = new Date(); // Start with the current time
  const currentMonth = monthAgo.getMonth();

  // Set the month back by 1.
  // JS handles the year change (e.g., Jan -> Dec) automatically.
  monthAgo.setMonth(currentMonth - 1);

  // NOTE: If the original date was the 31st, and the new month has < 31 days,
  // this is the point where the rollover happens.

  return monthAgo.toISOString();
};
