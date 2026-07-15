/**
 * FAQ / プランNote 共通：details の中身を height トランジションで開閉する
 */
export function initHeightAccordion(
  itemSelector: string,
  panelSelector: string,
  innerSelector: string,
): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLDetailsElement>(itemSelector).forEach((details) => {
    if (details.dataset.accordionInit === 'true') return;
    details.dataset.accordionInit = 'true';

    const summary = details.querySelector('summary');
    const panel = details.querySelector<HTMLElement>(panelSelector);
    const inner = details.querySelector<HTMLElement>(innerSelector);
    if (!summary || !panel || !inner) return;

    const measureHeight = () => inner.scrollHeight;

    const finishOpen = () => {
      if (details.open) panel.style.height = 'auto';
    };

    const finishClose = () => {
      details.open = false;
      panel.style.height = '0px';
    };

    const openPanel = () => {
      details.open = true;

      if (reducedMotion) {
        panel.style.height = 'auto';
        return;
      }

      panel.style.height = '0px';
      requestAnimationFrame(() => {
        panel.style.height = `${measureHeight()}px`;
      });

      panel.addEventListener('transitionend', function onEnd(event) {
        if (event.propertyName !== 'height') return;
        panel.removeEventListener('transitionend', onEnd);
        finishOpen();
      });
    };

    const closePanel = () => {
      if (reducedMotion) {
        finishClose();
        return;
      }

      panel.style.height = `${measureHeight()}px`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.style.height = '0px';
        });
      });

      panel.addEventListener('transitionend', function onEnd(event) {
        if (event.propertyName !== 'height') return;
        panel.removeEventListener('transitionend', onEnd);
        finishClose();
      });
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.open) {
        closePanel();
      } else {
        openPanel();
      }
    });

    if (!details.open) {
      panel.style.height = '0px';
    }
  });
}
