import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { IoMdClose } from "react-icons/io";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      defaultOpen={isOpen}
      onOpenChange={onChange}
    >
      <DialogContent>
        {/* <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0" /> */}
        {/* <Dialog.Content className="fixed drop-shadow-md border border-neutral-700 top-[50%] left-[50%] max-h-full h-full md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md dark:bg-neutral-800 p-[25px] focus:outline-none"> */}
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="mb-5 text-sm leading-normal text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
