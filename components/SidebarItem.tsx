import Link from "@/node_modules/next/link";
import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `
      flex
      flex-row
      h-auto
      items-center
      w-full
      gap-x-2
      text-md
      font-medium
      cursor-pointer
      dark:hover:text-white
      dark:bg-neutral-900
      hover:bg-neutral-200
      transition
      dark:text-neutral-400
      py-1
      rounded-md
      p-2
      `,
        active && "dark:text-white dark:bg-neutral-900 bg-neutral-200"
      )}
    >
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default SidebarItem;
