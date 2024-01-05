import { useEffect, useState } from "react";

import { SettingsModal } from "../modals/settings-modal";
import { AddVisitModal } from "../modals/add-visit-modal";
import { EditPetDetails } from "../modals/edit-pet-details-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddVisitModal />
      <EditPetDetails />
      <SettingsModal />
    </>
  );
};
