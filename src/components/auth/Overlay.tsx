import { ReactNode } from "react";
import { ClickEvent } from "../../types/index";

interface OverlayProps {
  closeModal: ClickEvent;
  children: ReactNode;
}

export default function Overlay({ closeModal, children }: OverlayProps) {
  return (
    <div className="overlay" onClick={closeModal}>
      {children}
    </div>
  );
}
