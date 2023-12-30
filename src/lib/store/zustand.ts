
import create from 'zustand';

interface ModalState {
  isOpen: boolean;
  toggleModal: () => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
  closeModal: () => set({ isOpen: false }),
}));

export const useModal = () => {
  const { isOpen, toggleModal, closeModal } = useModalStore((state) => ({
    isOpen: state.isOpen,
    toggleModal: state.toggleModal,
    closeModal: state.closeModal,
  }));

  return { isOpen, toggleModal, closeModal };
};
