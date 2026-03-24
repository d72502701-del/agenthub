import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAgentName } from "../hooks/useQueries";

type Page = "home" | "dashboard" | "food" | "tasks" | "jobs" | "customize";

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "food", label: "Food" },
  { id: "tasks", label: "Tasks" },
  { id: "jobs", label: "Jobs" },
  { id: "customize", label: "Customize" },
];

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: agentName } = useAgentName();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "";

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{ backgroundColor: "oklch(0.11 0.016 250)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <button
          type="button"
          className="flex items-center gap-2 group"
          onClick={() => handleNav("home")}
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            {agentName ?? "Aria"}
          </span>
        </button>

        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => handleNav(link.id)}
                data-ocid={`nav.${link.id}.link`}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary-glow"
              data-ocid="nav.login.button"
            >
              {isLoggingIn ? "Connecting..." : "Get Started"}
            </Button>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-3 py-1">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                    {shortPrincipal.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {shortPrincipal}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="hidden md:flex border-border text-muted-foreground hover:text-foreground"
                data-ocid="nav.logout.button"
              >
                Logout
              </Button>
            </>
          )}

          {isLoggedIn && (
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.menu.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && isLoggedIn && (
        <div
          className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1"
          style={{ backgroundColor: "oklch(0.11 0.016 250)" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={clear}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
