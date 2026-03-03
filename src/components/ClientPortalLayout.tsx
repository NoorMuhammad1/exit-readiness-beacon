
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientPortalSidebar } from '@/components/ClientPortalSidebar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIAssistantDialog } from '@/components/ai/AIAssistantDialog';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export const ClientPortalLayout = ({ children }: ClientPortalLayoutProps) => {
  const navigate = useNavigate();

  const handleExitPortal = () => {
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/20">
        <ClientPortalSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur-sm">
            <div className="flex items-center">
              <SidebarTrigger className="ml-4" />
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-foreground">Deal Room</h1>
                <p className="text-sm text-muted-foreground">PE Ready Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <AIAssistantDialog />
              <Button variant="outline" size="sm" onClick={handleExitPortal}>
                <ExternalLink className="h-4 w-4" />
                Exit Portal
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
