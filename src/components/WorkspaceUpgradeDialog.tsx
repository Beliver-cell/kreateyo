import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Check, Users, User, AlertTriangle } from 'lucide-react';

interface WorkspaceUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentType: 'solo' | 'team';
  onConfirm: () => void;
}

export function WorkspaceUpgradeDialog({ 
  open, 
  onOpenChange, 
  currentType, 
  onConfirm 
}: WorkspaceUpgradeDialogProps) {
  const isUpgrading = currentType === 'solo';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isUpgrading ? 'bg-gradient-primary' : 'bg-warning/10'
            }`}>
              {isUpgrading ? (
                <Users className="w-8 h-8 text-white" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-warning" />
              )}
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            {isUpgrading ? 'Upgrade to Team Workspace?' : 'Switch to Solo Workspace?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {isUpgrading 
              ? 'Add team features to your account and start collaborating.'
              : 'Team features will be hidden. Are you sure you want to continue?'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4">
          {isUpgrading ? (
            <>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Team member invitations</p>
                  <p className="text-xs text-muted-foreground">Invite colleagues to collaborate</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Role-based permissions</p>
                  <p className="text-xs text-muted-foreground">Control team member access levels</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Team activity tracking</p>
                  <p className="text-xs text-muted-foreground">Monitor team actions and changes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Developer tools access</p>
                  <p className="text-xs text-muted-foreground">Advanced development features</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Team features will be hidden</p>
                  <p className="text-xs text-muted-foreground">No longer visible in your dashboard</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Member access will be removed</p>
                  <p className="text-xs text-muted-foreground">Team members won't be able to access</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Developer tools will be hidden</p>
                  <p className="text-xs text-muted-foreground">Advanced features removed from sidebar</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">All business data preserved</p>
                  <p className="text-xs text-muted-foreground">Your content and settings remain safe</p>
                </div>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={isUpgrading ? 'bg-gradient-primary hover:opacity-90' : ''}
          >
            {isUpgrading ? 'Upgrade to Team' : 'Switch to Solo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}