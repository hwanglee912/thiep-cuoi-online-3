import { useEffect } from 'react';

export default function useDialog(ref, open, onClose) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
      .filter((element) => !element.disabled && element.getClientRects().length);
    (focusable()[0] || dialog).focus({ preventScroll: true });
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && onClose) { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const controls = focusable();
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    dialog.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener('keydown', onKeyDown);
      // Let other modal cleanups remove inert before restoring focus.
      queueMicrotask(() => {
        if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
      });
    };
  }, [ref, open, onClose]);
}
