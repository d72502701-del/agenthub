import { Bot } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="border-t border-border mt-auto"
      style={{ backgroundColor: "oklch(0.11 0.016 250)" }}
    >
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground">
                Orbit AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal AI agent that handles everything — food orders,
              tasks, and daily automation.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Food Ordering</li>
              <li>Task Management</li>
              <li>Job Automation</li>
              <li>AI Customization</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Getting Started</li>
              <li>Documentation</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
