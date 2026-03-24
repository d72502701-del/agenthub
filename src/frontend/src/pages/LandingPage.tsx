import { Button } from "@/components/ui/button";
import {
  Bot,
  CheckSquare,
  Cpu,
  Settings,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAgentName } from "../hooks/useQueries";

type Page = "home" | "dashboard" | "food" | "tasks" | "jobs" | "customize";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Food Ordering",
    description:
      "Order from top restaurants with Cash on Delivery. Track every order in real-time.",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "Create, organize, and complete tasks. Your personal productivity hub.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: Zap,
    title: "Job Automation",
    description:
      "Schedule and automate daily routines. Let your agent handle the repetitive work.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: Settings,
    title: "Full Control",
    description:
      "Customize your AI agent's name and grant specific permissions for each capability.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: agentName } = useAgentName();
  const name = agentName ?? "Aria";

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-24 md:py-32 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Cpu className="w-3.5 h-3.5" />
            AI-Powered Personal Agent
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-foreground leading-tight mb-4">
            Meet <span className="text-gradient-blue">{name}</span>
            ,<br />
            Your Personal AI Agent
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Order food, manage tasks, automate daily jobs — all from one
            intelligent dashboard. Just say the word and {name} handles
            everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {identity ? (
              <Button
                size="lg"
                onClick={() => onNavigate("dashboard")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary-glow px-8"
                data-ocid="hero.dashboard.button"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary-glow px-8"
                  data-ocid="hero.login.button"
                >
                  {isLoggingIn ? "Connecting..." : "Get Started Free"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-foreground"
                  data-ocid="hero.learn.button"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Floating dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card card-glow p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Active Tasks", value: "12", color: "text-primary" },
                { label: "Recent Orders", value: "5", color: "text-chart-3" },
                { label: "Jobs Running", value: "8", color: "text-accent" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-secondary/50 rounded-xl p-4 border border-border"
                >
                  <div
                    className={`text-2xl font-display font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Morning Routine — 8:00 AM",
                "Lunch Order — Spice Garden",
                "Send Daily Report",
                "Evening Workout",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-secondary/30 rounded-lg p-3 border border-border"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground truncate">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Customize section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Customize Your AI Agent
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Make it truly yours — choose a name, grant permissions, and
              configure how {name} operates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Agent name card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-card card-glow p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Agent Name</h3>
                  <p className="text-xs text-muted-foreground">
                    Personalize your AI
                  </p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <div className="text-3xl font-display font-bold text-gradient-blue mb-1">
                  {name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Current agent name
                </div>
              </div>
              {identity && (
                <Button
                  size="sm"
                  className="mt-4 w-full bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                  onClick={() => onNavigate("customize")}
                  data-ocid="landing.customize.button"
                >
                  Rename Agent
                </Button>
              )}
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-card card-glow-purple p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                Agent Dashboard
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Tasks Active",
                    value: "—",
                    icon: CheckSquare,
                    color: "text-primary",
                  },
                  {
                    label: "Orders Placed",
                    value: "—",
                    icon: ShoppingBag,
                    color: "text-chart-3",
                  },
                  {
                    label: "Jobs Running",
                    value: "—",
                    icon: Zap,
                    color: "text-accent",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between bg-secondary/40 rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className={`font-bold font-display ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Feature cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.slice(0, 3).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}
                >
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  {f.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay in Control section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Stay in Control
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every permission is yours to grant or revoke.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mx-auto mb-3`}
                >
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {f.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
