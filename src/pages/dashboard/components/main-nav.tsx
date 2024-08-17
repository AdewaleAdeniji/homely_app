import { Link } from "react-router-dom";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/examples/dashboard"
        className="text-sm font-bold transition-colors text-primary"
      >
        Dashboard
      </Link>
      <Link
        to="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-gray-200"
      >
        Customers
      </Link>
    </nav>
  )
}
