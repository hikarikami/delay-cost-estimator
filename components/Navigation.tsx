"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Delay Estimate",
    href: "/delay-estimate",
  },
  {
    name: "Recurring Delay Estimator",
    href: "/recurring-delay-estimator",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold py-4">
            Cost of Delay Tools
          </Link>
          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href === "/delay-estimate" && (pathname === "/" || pathname === "/delay-estimate"));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-4 text-sm font-medium transition-colors border-b-2",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
