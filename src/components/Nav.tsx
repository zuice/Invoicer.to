import { Link, useNavigate } from "@tanstack/react-router";
import { User } from "@/lib/db/schema";
import { signOutFn } from "@/features/auth/server/signOutFn";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, PlusCircle, FileText, Users } from "lucide-react";

interface Props {
  user?: Partial<User>;
}

export function Nav({ user }: Props) {
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  const handleSignOut = () => {
    signOutFn();
    navigate({ to: "/auth/sign-in" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-80 transition"
          >
            Invoicer
          </Link>

          {isAuthenticated && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="px-3 py-2 hover:text-primary transition"
                    asChild
                  >
                    <Link
                      to="/invoices"
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "font-bold" }}
                    >
                      <FileText className="h-4 w-4 inline mr-1" />
                      Invoices
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="px-3 py-2 hover:text-primary transition"
                    asChild
                  >
                    <Link
                      to="/invoices/new"
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "font-bold" }}
                    >
                      <PlusCircle className="h-4 w-4 inline mr-1" />
                      New Invoice
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="px-3 py-2 hover:text-primary transition"
                    asChild
                  >
                    <Link
                      to="/clients"
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "font-bold" }}
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      Clients
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {/* Right: Auth / User Menu */}
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link to="/auth/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </>
          )}

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .reduce(
                        (acc, value) => `${acc}${value[0].toUpperCase()}`,
                        "",
                      )}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user?.name ?? "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
