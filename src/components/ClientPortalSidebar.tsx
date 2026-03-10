
import React from 'react';
import { CheckCircle, Building2, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { moduleConfigurations } from '@/config/moduleConfig';

export function ClientPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile } = useAuth();
  const { isModuleCompleted } = useProgress();

  const collapsed = state === 'collapsed';

  // Flat list of all modules in order
  const allModules = [...moduleConfigurations].sort((a, b) => {
    if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber;
    return a.order - b.order;
  });

  const isActive = (path: string) => location.pathname === path;

  const getNavClasses = (path: string) => {
    return isActive(path)
      ? "bg-accent/10 text-accent font-medium border-r-2 border-accent"
      : "hover:bg-muted/50 text-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-background">
        {/* Welcome Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-white">
            {!collapsed && "Your Journey"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                <p>Welcome to your exclusive Deal Room</p>
                <p className="mt-1 font-medium text-slate-50">Exit Readiness Program</p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Company Profile & Settings */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/portal/company-profile"
                      className={getNavClasses('/portal/company-profile')}
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Company Profile</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/portal/settings"
                      className={getNavClasses('/portal/settings')}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* All Modules — flat list */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold text-white">
              Modules
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {allModules.map(module => {
                  const moduleCompleted = isModuleCompleted(module.name, module.weekNumber);
                  return (
                    <SidebarMenuItem key={module.path}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={module.path}
                          className={getNavClasses(module.path)}
                        >
                          <span className="text-sm">{module.name}</span>
                          {module.enhancement && (
                            <Badge
                              variant={module.enhancement === 'NEW' ? 'default' : 'secondary'}
                              className={`text-[10px] px-1.5 py-0 h-4 ml-1 ${
                                module.enhancement === 'ENHANCED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-white/10 text-white border-white/15'
                              }`}
                            >
                              {module.enhancement}
                            </Badge>
                          )}
                          {moduleCompleted ? (
                            <CheckCircle className="h-4 w-4 ml-auto text-primary" />
                          ) : isActive(module.path) ? (
                            <div className="h-2 w-2 rounded-full bg-primary ml-auto" />
                          ) : null}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
