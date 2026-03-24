import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, Loader2, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskStatus } from "../backend.d";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from "../hooks/useQueries";

type Filter = "all" | "active" | "completed";

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const updateStatus = useUpdateTaskStatus();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [adding, setAdding] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      setAdding(false);
      toast.success("Task created!");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleToggle = async (idx: number, isCompleted: boolean) => {
    try {
      await updateStatus.mutateAsync({
        taskId: BigInt(idx),
        taskStatus: isCompleted ? TaskStatus.pending : TaskStatus.completed,
      });
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deleteTask.mutateAsync(BigInt(idx));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

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
              Tasks
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {completedCount}/{tasks.length} completed
            </p>
          </div>
          <Button
            onClick={() => setAdding(!adding)}
            className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
            data-ocid="tasks.add.button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <AnimatePresence>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-primary/30 bg-card p-5 mb-6 overflow-hidden"
              data-ocid="tasks.form.panel"
            >
              <h3 className="font-semibold text-foreground mb-3">New Task</h3>
              <Input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border mb-3"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                data-ocid="tasks.title.input"
              />
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border mb-3 min-h-[80px]"
                data-ocid="tasks.description.textarea"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreate}
                  disabled={createTask.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="tasks.create.submit_button"
                >
                  {createTask.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Task"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAdding(false)}
                  className="border-border text-muted-foreground"
                  data-ocid="tasks.create.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-5">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              data-ocid={`tasks.${f}.tab`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="tasks.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="tasks.empty_state"
          >
            {filter === "all"
              ? "No tasks yet. Create your first task!"
              : `No ${filter} tasks.`}
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-3 rounded-xl border bg-card px-4 py-3 group transition-colors ${
                    task.isCompleted
                      ? "border-border opacity-60"
                      : "border-border hover:border-primary/30"
                  }`}
                  data-ocid={`tasks.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(i, task.isCompleted)}
                    className="shrink-0"
                    data-ocid={`tasks.checkbox.${i + 1}`}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        task.isCompleted
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </div>
                  {task.isCompleted && (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs">
                      Done
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(i)}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    data-ocid={`tasks.delete_button.${i + 1}`}
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
