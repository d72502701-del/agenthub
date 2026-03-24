import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckSquare,
  Loader2,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAgentName, useDashboardStats } from "../hooks/useQueries";

type Page = "home" | "dashboard" | "food" | "tasks" | "jobs" | "customize";

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: agentName } = useAgentName();

  const statCards = [
    {
      label: "Active Tasks",
      value: stats ? Number(stats.activeTaskCount) : 0,
      icon: CheckSquare,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      page: "tasks" as Page,
    },
    {
      label: "Recent Orders",
      value: stats ? Number(stats.recentOrderCount) : 0,
      icon: ShoppingBag,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
      border: "border-chart-3/20",
      page: "food" as Page,
    },
    {
      label: "Active Jobs",
      value: stats ? Number(stats.activeJobCount) : 0,
      icon: Zap,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
      page: "jobs" as Page,
    },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 md:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">
            Welcome back, {agentName ?? "Aria"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your agent today.
          </p>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="dashboard.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`rounded-2xl border ${card.border} bg-card card-glow p-6 cursor-pointer hover:bg-secondary/50 transition-colors`}
                onClick={() => onNavigate(card.page)}
                data-ocid={`dashboard.${card.label.toLowerCase().replace(" ", "_")}.card`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}
                >
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div
                  className={`text-4xl font-display font-extrabold ${card.color} mb-1`}
                >
                  {card.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {card.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="font-semibold text-foreground text-lg mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              page: "food" as Page,
              label: "Order Food",
              desc: "Browse restaurants and place orders with COD",
              icon: ShoppingBag,
              color: "text-chart-3",
              bg: "bg-chart-3/10",
            },
            {
              page: "tasks" as Page,
              label: "Manage Tasks",
              desc: "View, add, and complete your tasks",
              icon: CheckSquare,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              page: "jobs" as Page,
              label: "Automation Jobs",
              desc: "Schedule daily routines and automations",
              icon: Zap,
              color: "text-accent",
              bg: "bg-accent/10",
            },
          ].map((action, i) => (
            <motion.div
              key={action.page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 cursor-pointer hover:bg-secondary/50 hover:border-primary/30 transition-all group"
              onClick={() => onNavigate(action.page)}
              data-ocid={`dashboard.${action.page}.button`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center mb-3`}
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {action.label}
              </h3>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
