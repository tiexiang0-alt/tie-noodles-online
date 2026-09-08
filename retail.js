/* Native details navigation still works when JavaScript is unavailable. */
const menu = document.querySelector('.mobile-menu');
if (menu) {
  const summary = menu.querySelector('summary');
  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    menu.open = false;
    // Move keyboard focus out of the collapsed menu for in-page navigation.
    if (link.hash && link.pathname === window.location.pathname) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
    if (event.matches) menu.open = false;
  });
}
