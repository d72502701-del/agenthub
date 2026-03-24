import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bot,
  CheckSquare,
  Loader2,
  Save,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAgentName, useUpdateAgentName } from "../hooks/useQueries";

const PERMISSIONS = [
  {
    id: "food",
    label: "Food Ordering",
    description:
      "Allow agent to browse restaurants and place food orders on your behalf",
    icon: ShoppingBag,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    id: "tasks",
    label: "Task Management",
    description: "Allow agent to create, update, and delete tasks in your list",
    icon: CheckSquare,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "jobs",
    label: "Job Automation",
    description:
      "Allow agent to schedule, run, and manage daily automation routines",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default function CustomizePage() {
  const { data: agentName } = useAgentName();
  const updateName = useUpdateAgentName();

  const [nameInput, setNameInput] = useState("");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    food: true,
    tasks: true,
    jobs: true,
  });

  useEffect(() => {
    if (agentName) setNameInput(agentName);
  }, [agentName]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      toast.error("Agent name cannot be empty");
      return;
    }
    try {
      await updateName.mutateAsync(nameInput.trim());
      toast.success("Agent name updated!");
    } catch {
      toast.error("Failed to update agent name");
    }
  };

  const togglePermission = (id: string) => {
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(
      `${id} permission ${permissions[id] ? "disabled" : "enabled"}`,
    );
  };

  return (
    <main className="flex-1 container mx-auto px-4 md:px-6 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Customize Agent
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personalize your AI agent and manage permissions
          </p>
        </div>

        {/* Agent Name Card */}
        <div className="rounded-2xl border border-border bg-card card-glow p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Agent Identity</h2>
              <p className="text-xs text-muted-foreground">
                Change how your AI agent is called
              </p>
            </div>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4 border border-border mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Current name</div>
              <div className="font-display font-bold text-xl text-gradient-blue">
                {agentName ?? "Aria"}
              </div>
            </div>
          </div>

          <Label className="text-sm text-muted-foreground mb-2 block">
            New agent name
          </Label>
          <div className="flex gap-2">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter agent name"
              className="bg-input border-border flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              data-ocid="customize.name.input"
            />
            <Button
              onClick={handleSaveName}
              disabled={updateName.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="customize.name.save_button"
            >
              {updateName.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Name
                </>
              )}
            </Button>
          </div>
          {updateName.isSuccess && (
            <p
              className="text-xs text-green-400 mt-2"
              data-ocid="customize.name.success_state"
            >
              ✓ Name saved successfully
            </p>
          )}
        </div>

        {/* Permissions Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-1">Permissions</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Control what your agent is allowed to do
          </p>

          <div className="space-y-4">
            {PERMISSIONS.map((perm, i) => (
              <motion.div
                key={perm.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 bg-secondary/40 rounded-xl p-4 border border-border"
                data-ocid={`customize.${perm.id}.toggle`}
              >
                <div
                  className={`w-9 h-9 rounded-lg ${perm.bg} flex items-center justify-center shrink-0`}
                >
                  <perm.icon className={`w-5 h-5 ${perm.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">
                    {perm.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {perm.description}
                  </div>
                </div>
                <Switch
                  checked={permissions[perm.id]}
                  onCheckedChange={() => togglePermission(perm.id)}
                  data-ocid={`customize.${perm.id}.switch`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
