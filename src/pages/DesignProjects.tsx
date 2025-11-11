import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function DesignProjects() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const [projectForm, setProjectForm] = useState({
    client_name: "",
    project_name: "",
    description: "",
    project_type: "branding",
    budget: "",
    start_date: "",
    deadline: ""
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    due_date: ""
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["design-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("design_projects")
        .select("*, design_milestones(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("design_projects").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-projects"] });
      setDialogOpen(false);
      toast.success("Project created successfully");
      setProjectForm({ client_name: "", project_name: "", description: "", project_type: "branding", budget: "", start_date: "", deadline: "" });
    },
    onError: () => toast.error("Failed to create project")
  });

  const createMilestoneMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("design_milestones").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-projects"] });
      setMilestoneDialogOpen(false);
      toast.success("Milestone added successfully");
      setMilestoneForm({ title: "", description: "", due_date: "" });
    },
    onError: () => toast.error("Failed to add milestone")
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("design_milestones")
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-projects"] });
    }
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      ...projectForm,
      budget: projectForm.budget ? parseFloat(projectForm.budget) : null
    });
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    createMilestoneMutation.mutate({
      project_id: selectedProject,
      ...milestoneForm
    });
  };

  const stats = {
    total: projects?.length || 0,
    active: projects?.filter(p => p.status === 'in_progress').length || 0,
    completed: projects?.filter(p => p.status === 'completed').length || 0
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Project Milestone Tracker</h1>
            <p className="text-muted-foreground">Manage design projects and milestones</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <Label>Client Name</Label>
                  <Input 
                    value={projectForm.client_name}
                    onChange={(e) => setProjectForm({ ...projectForm, client_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Project Name</Label>
                  <Input 
                    value={projectForm.project_name}
                    onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Project Type</Label>
                  <Select value={projectForm.project_type} onValueChange={(v) => setProjectForm({ ...projectForm, project_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo">Logo Design</SelectItem>
                      <SelectItem value="website">Website Design</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="ui_ux">UI/UX Design</SelectItem>
                      <SelectItem value="print">Print Design</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Budget</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input 
                      type="date"
                      value={projectForm.start_date}
                      onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input 
                      type="date"
                      value={projectForm.deadline}
                      onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <p>Loading...</p>
          ) : projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.project_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.client_name}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'review' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProject(project.id);
                          setMilestoneDialogOpen(true);
                        }}
                      >
                        Add Milestone
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.completion_percentage}%</span>
                      </div>
                      <Progress value={project.completion_percentage} />
                    </div>
                    {project.design_milestones && project.design_milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Milestones</h4>
                        {project.design_milestones.map((milestone: any) => (
                          <div key={milestone.id} className="flex items-center gap-2 p-2 border rounded">
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={(checked) => 
                                toggleMilestoneMutation.mutate({ id: milestone.id, completed: !!checked })
                              }
                            />
                            <div className="flex-1">
                              <p className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                                {milestone.title}
                              </p>
                              {milestone.due_date && (
                                <p className="text-xs text-muted-foreground">
                                  Due: {new Date(milestone.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No projects yet. Create your first project!</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div>
                <Label>Milestone Title</Label>
                <Input 
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input 
                  type="date"
                  value={milestoneForm.due_date}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Add Milestone</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}