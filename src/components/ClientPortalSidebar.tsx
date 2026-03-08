
import React from 'react';
import { BookOpen, Calculator, Target, FileCheck, Crown, TrendingUp, CheckCircle, Building2, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { getWeekConfigurations } from '@/config/moduleConfig';

// Icon mapping for weeks
const weekIcons = {
  1: BookOpen,
  2: Calculator,
  3: TrendingUp,
  4: FileCheck
} as const;

export function ClientPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile } = useAuth();
  const { getWeekProgress, isModuleCompleted } = useProgress();
  
  const collapsed = state === 'collapsed';
  const weeks = getWeekConfigurations();
  
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
                <p className="mt-1 font-medium text-slate-50">4-Week Exit Readiness Program</p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Company Profile */}
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

        {/* Weekly Modules */}
        {weeks.map(week => {
          const weekProgress = getWeekProgress(week.number);
          const WeekIcon = weekIcons[week.number as keyof typeof weekIcons];
          
          return (
            <SidebarGroup key={week.number}>
              <SidebarGroupLabel className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WeekIcon className="h-4 w-4" />
                  {!collapsed && (
                    <span>Week {week.number}</span>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-1">
                    {weekProgress && (
                      <Badge variant="outline" className="text-xs">
                        {weekProgress.completedModules}/{weekProgress.totalModules}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                )}
              </SidebarGroupLabel>
              
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="text-xs text-foreground font-medium px-3 mb-2">
                    {week.title}
                  </div>
                  <SidebarMenu>
                    {week.modules.map(module => {
                      const moduleCompleted = isModuleCompleted(module.name, week.number);
                      return (
                        <SidebarMenuItem key={module.name}>
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
                                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
