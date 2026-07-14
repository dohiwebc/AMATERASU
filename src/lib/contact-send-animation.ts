const SEND_OVERLAY_HTML = `
  <div class="send-overlay__inner">
    <div class="send-overlay__scene">
      <svg class="send-trail" viewBox="0 0 260 150" aria-hidden="true">
        <path class="send-trail__path" d="M 48 108 Q 128 24 228 44" />
        <circle class="send-trail__dot" cx="76" cy="90" r="2.5" />
        <circle class="send-trail__dot" cx="124" cy="54" r="2.5" />
        <circle class="send-trail__dot" cx="178" cy="42" r="2.5" />
      </svg>
      <div class="send-flyer">
        <div class="send-state send-state--letter">
          <svg class="send-svg send-svg--letter" viewBox="0 0 96 72" aria-hidden="true">
            <rect class="send-letter__body" x="8" y="22" width="80" height="44" rx="2" fill="#faf9f7" stroke="currentColor" stroke-width="1.5" />
            <path class="send-letter__fold-l" d="M8 66 L48 40" stroke="currentColor" stroke-width="1" opacity="0.2" />
            <path class="send-letter__fold-r" d="M88 66 L48 40" stroke="currentColor" stroke-width="1" opacity="0.2" />
            <path class="send-letter__flap" d="M8 22 L48 44 L88 22 Z" fill="#f0ebe3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <g class="send-letter__lines">
              <line x1="24" y1="48" x2="72" y2="48" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="24" y1="54" x2="60" y2="54" stroke="currentColor" stroke-width="1" opacity="0.35" />
              <line x1="24" y1="60" x2="52" y2="60" stroke="currentColor" stroke-width="1" opacity="0.35" />
            </g>
          </svg>
        </div>
        <div class="send-state send-state--plane">
          <svg class="send-svg send-svg--plane" viewBox="0 0 120 52" aria-hidden="true">
            <path class="send-plane__wind" d="M0 18 H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.35" />
            <path class="send-plane__wind" d="M0 26 H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
            <path class="send-plane__wind" d="M0 34 H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.35" />
            <path class="send-plane__bottom" d="M16 28 L104 24 L16 42 Z" fill="#ebe5dc" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path class="send-plane__top" d="M16 28 L104 24 L16 14 Z" fill="#faf9f7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <line class="send-plane__crease" x1="16" y1="28" x2="104" y2="24" stroke="currentColor" stroke-width="1" opacity="0.32" />
            <line class="send-plane__fold" x1="16" y1="14" x2="16" y2="42" stroke="currentColor" stroke-width="1" opacity="0.2" />
            <path class="send-plane__nose" d="M88 24 L104 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
          </svg>
        </div>
      </div>
    </div>
    <p class="send-overlay__text"></p>
  </div>
`;

export function playContactSendAnimation(message = '送信中...'): Promise<void> {
  return new Promise((resolve) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      window.setTimeout(resolve, 350);
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'send-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = SEND_OVERLAY_HTML;

    const text = overlay.querySelector('.send-overlay__text');
    if (text) text.textContent = message;

    document.body.appendChild(overlay);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      overlay.remove();
      document.body.style.overflow = previousOverflow;
      resolve();
    };

    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });

    window.setTimeout(() => overlay.classList.add('is-seal'), 550);
    window.setTimeout(() => overlay.classList.add('is-fold'), 1200);
    window.setTimeout(() => overlay.classList.add('is-fly'), 1750);
    window.setTimeout(() => {
      overlay.classList.add('is-exit');
      window.setTimeout(finish, 450);
    }, 3500);
  });
}
