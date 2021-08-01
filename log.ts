export const log = {
  debug(...args) {
    console.log("DEBUG:", ...args);
  },
  info(...args) {
    console.log("INFO:", ...args);
  },
  critical(...args) {
    console.log("CRITICAL:", ...args);
  },
};
