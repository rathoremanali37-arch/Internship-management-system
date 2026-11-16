// Toast: a small message that appears at the bottom and disappears by itself.
import { useEffect } from "react";

function Toast({ message, type, onClose }) {
  // Start a 3 second timer when the toast appears, then tell App to remove it.
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer); // stop the timer if the toast is replaced early
  }, [message, onClose]);

  return (
    <div className={type === "error" ? "toast toast-error" : "toast"} role="status">
      {message}
    </div>
  );
}

export default Toast;
