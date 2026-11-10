export const scrollToElement = (ref: React.RefObject<HTMLElement>) => {
  if (ref.current) {
    const elementY = ref.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementY - 80, behavior: 'smooth' });
  }
};
