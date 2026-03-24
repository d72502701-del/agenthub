import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddRoutine,
  useDeleteRoutine,
  useRoutines,
  useToggleRoutine,
} from "../hooks/useQueries";

export default function JobsPage() {
  const { data: routines = [], isLoading } = useRoutines();
  const addRoutine = useAddRoutine();
  const deleteRoutine = useDeleteRoutine();
  const toggleRoutine = useToggleRoutine();

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Job name is required");
      return;
    }
    if (!time.trim()) {
      toast.error("Scheduled time is required");
      return;
    }
    try {
      await addRoutine.mutateAsync({ name: name.trim(), scheduledTime: time });
      setName("");
      setTime("");
      setAdding(false);
      toast.success("Job added!");
    } catch {
      toast.error("Failed to add job");
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deleteRoutine.mutateAsync(BigInt(idx));
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const handleToggle = async (idx: number, isActive: boolean) => {
    try {
      await toggleRoutine.mutateAsync({
        routineId: BigInt(idx),
        isActive: !isActive,
      });
    } catch {
      toast.error("Failed to update job");
    }
  };

  const activeCount = routines.filter((r) => r.isActive).length;

  return (
    <main className="flex-1 container mx-auto px-4 md:px-6 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Automation Jobs
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {activeCount} active of {routines.length} jobs
            </p>
          </div>
          <Button
            onClick={() => setAdding(!adding)}
            className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25"
            data-ocid="jobs.add.button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>

        <AnimatePresence>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-accent/30 bg-card p-5 mb-6 overflow-hidden"
              data-ocid="jobs.form.panel"
            >
              <h3 className="font-semibold text-foreground mb-3">
                New Automation Job
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Job Name
                  </Label>
                  <Input
                    placeholder="e.g. Morning Routine"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                    data-ocid="jobs.name.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Scheduled Time
                  </Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-input border-border"
                    data-ocid="jobs.time.input"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  disabled={addRoutine.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="jobs.create.submit_button"
                >
                  {addRoutine.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Job"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAdding(false)}
                  className="border-border text-muted-foreground"
                  data-ocid="jobs.create.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="jobs.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : routines.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="jobs.empty_state"
          >
            <Zap className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            No jobs yet. Add your first automation!
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {routines.map((routine, i) => (
                <motion.div
                  key={routine.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 group hover:border-accent/30 transition-colors"
                  data-ocid={`jobs.item.${i + 1}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      routine.isActive ? "bg-accent/15" : "bg-muted/50"
                    }`}
                  >
                    <Zap
                      className={`w-4 h-4 ${routine.isActive ? "text-accent" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">
                      {routine.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {routine.scheduledTime}
                    </div>
                  </div>
                  <Badge
                    className={
                      routine.isActive
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "bg-muted/50 text-muted-foreground border border-border"
                    }
                  >
                    {routine.isActive ? "Active" : "Paused"}
                  </Badge>
                  <Switch
                    checked={routine.isActive}
                    onCheckedChange={() => handleToggle(i, routine.isActive)}
                    data-ocid={`jobs.toggle.${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    data-ocid={`jobs.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </main>
  );
}
