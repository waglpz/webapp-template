export const detach = (fn) => {
  setTimeout(() => {
    fn();
  }, 0);
};
