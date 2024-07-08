import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

import { LogOutIcon } from "lucide-react";

interface UserDropdownProps {
  children: React.ReactNode;
  handleLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  children,
  handleLogout,
}) => {
  const user = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex flex-col m-2">
            <p className="text-sm">{user?.userName}</p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
