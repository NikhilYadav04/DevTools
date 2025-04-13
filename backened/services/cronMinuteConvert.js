export function minutesToCron(minutes) {
  if (minutes <= 0 || minutes > 59) {
    throw new Error("Minutes should be between 1 and 59");
  }
  return `*/${minutes} * * * *`;
}
