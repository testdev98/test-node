import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, LogOut, Moon, Sun, Palette, LayoutDashboard, UserCog, Sparkles, Users, IdCard } from 'lucide-react';
import { logout } from '@/api/auth';
import { useUser } from '@/contexts/UserContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import idmeritLogo from '@/assets/company/idmerit-logo.svg';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser } = useUser();
  const { theme, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      isActive: location.pathname === '/dashboard',
      gradient: 'from-' + primaryColor + '-600 to-cyan-500',
      module:"Dashboard",
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users',
      isActive: location.pathname.startsWith('/users'),
      gradient: 'from-' + primaryColor + '-600 to-cyan-500',
      module:"User",
    },
    {
      title: 'Services',
      icon: IdCard,
      href: '/services',
      isActive: location.pathname.startsWith('/services'),
      gradient: 'from-' + primaryColor + '-600 to-cyan-500',
      module: "Services"
    },
    {
      title: 'Roles',
      icon: UserCog,
      href: '/roles',
      isActive: location.pathname.startsWith('/roles'),
      gradient: 'from-' + primaryColor + '-600 to-cyan-500',
      module: "Role"
    },
  ];

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const colors = [
    { name: 'Blue', value: 'blue', color: '221.2 83.2% 53.3%' },
    { name: 'Purple', value: 'purple', color: '262.1 83.3% 57.8%' },
    { name: 'Green', value: 'green', color: '142.1 76.2% 36.3%' },
    { name: 'Orange', value: 'orange', color: '24.6 95% 53.1%' },
    { name: 'Red', value: 'red', color: '346.8 77.2% 49.8%' },
    { name: 'Pink', value: 'pink', color: '322.2 84% 60.5%' },
    { name: 'Indigo', value: 'indigo', color: '231.7 48.6% 59%' },
    { name: 'Teal', value: 'teal', color: '173.4 80.4% 40%' },
    { name: 'Emerald', value: 'emerald', color: '160.1 84.1% 39.4%' },
    { name: 'Amber', value: 'amber', color: '37.7 92.1% 50.2%' },
    { name: 'Violet', value: 'violet', color: '263.4 70% 50.4%' },
    { name: 'Fuchsia', value: 'fuchsia', color: '291.1 92.7% 65.3%' },
    { name: 'Lime', value: 'lime', color: '84.1 76.5% 44.3%' },
    { name: 'Rose', value: 'rose', color: '330.3 81.2% 60.4%' },
    { name: 'Sky', value: 'sky', color: '199.1 79.2% 54.1%' },
  ];

  const getColorHsl = (colorValue: string) => {
    const colorMap = {
      blue: '221.2 83.2% 53.3%',
      purple: '262.1 83.3% 57.8%',
      green: '142.1 76.2% 36.3%',
      orange: '24.6 95% 53.1%',
      red: '346.8 77.2% 49.8%',
      pink: '322.2 84% 60.5%',
      indigo: '231.7 48.6% 59%',
      teal: '173.4 80.4% 40%',
      emerald: '160.1 84.1% 39.4%',
      amber: '37.7 92.1% 50.2%',
      violet: '263.4 70% 50.4%',
      fuchsia: '291.1 92.7% 65.3%',
      lime: '84.1 76.5% 44.3%',
      rose: '330.3 81.2% 60.4%',
      sky: '199.1 79.2% 54.1%',
    };
    return colorMap[colorValue as keyof typeof colorMap] || colorMap.blue;
  };

  const gradientPresets = [
    { name: 'Rainbow', class: 'gradient-rainbow', gradient: 'from-red-500 via-yellow-500 to-blue-500' },
    { name: 'Sunset', class: 'gradient-sunset', gradient: 'from-orange-500 via-pink-500 to-purple-500' },
    { name: 'Ocean', class: 'gradient-ocean', gradient: 'from-teal-500 via-cyan-500 to-blue-500' },
    { name: 'Forest', class: 'gradient-forest', gradient: 'from-emerald-500 via-green-500 to-teal-500' },
    { name: 'Candy', class: 'gradient-candy', gradient: 'from-pink-500 via-rose-500 to-fuchsia-500' },
    { name: 'Twilight', class: 'gradient-twilight', gradient: 'from-indigo-500 via-purple-500 to-violet-500' },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : ''} bg-gradient-to-b from-card via-card/95 to-card/80 backdrop-blur-xl scrollbar-visible relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header with enhanced logo section */}
      <div className="relative flex items-center justify-center px-6 py-3 border-b border-border/50">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 hover:scale-110">
            <Sparkles className="text-white h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {user.company_profile.name}
            </span>
            <p className="text-xs text-muted-foreground font-medium">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-visible relative z-10">
        {menuItems.map((item, index) => {
          const isActive = item.isActive;
          return (
            <Link
              key={item.title}
              to={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden ${isActive
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                : 'hover:bg-gradient-to-r hover:from-muted hover:to-muted/50 hover:shadow-md'
                }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated background for active state */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-90 rounded-xl`} />
              )}

              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`} />

              <div className="relative z-10 flex items-center gap-3">
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20' : 'group-hover:bg-primary/10'} transition-all duration-300`}>
                  <item.icon className={`h-5 w-5 transition-all duration-300 ${isActive
                    ? 'scale-110 text-white'
                    : 'group-hover:scale-105 group-hover:text-primary'
                    }`} />
                </div>
                <span className={`font-medium transition-all duration-300 ${isActive ? 'text-white' : ''}`}>
                  {item.title}
                </span>
              </div>

              {isActive && (
                <div className="ml-auto relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with product info */}
      <div className="relative z-10 p-4 border-t border-border/50">
        <div className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-lg font-bold">
            <span className="text-gray-600">IDM</span>
            <span className="text-primary">Kyx</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
        <style>
          {`
            .scrollbar-visible::-webkit-scrollbar {
              width: 8px;
            }
            .scrollbar-visible::-webkit-scrollbar-track {
              background: hsl(var(--background) / 0.1);
              border-radius: 4px;
            }
            .scrollbar-visible::-webkit-scrollbar-thumb {
              background: hsl(var(--primary) / 0.5);
              border-radius: 4px;
            }
            .scrollbar-visible::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--primary));
            }
            /* Firefox */
            .scrollbar-visible {
              scrollbar-width: thin;
              scrollbar-color: hsl(var(--primary) / 0.5) hsl(var(--background) / 0.1);
            }

            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fade-in {
              animation: fade-in 0.5s ease-out;
            }

            .gradient-rainbow {
              background: linear-gradient(90deg, hsl(0 100% 50%), hsl(60 100% 50%), hsl(240 100% 50%));
            }
            .gradient-sunset {
              background: linear-gradient(90deg, hsl(24.6 95% 53.1%), hsl(322.2 84% 60.5%), hsl(262.1 83.3% 57.8%));
            }
            .gradient-ocean {
              background: linear-gradient(90deg, hsl(173.4 80.4% 40%), hsl(199.1 79.2% 54.1%), hsl(221.2 83.2% 53.3%));
            }
            .gradient-forest {
              background: linear-gradient(90deg, hsl(160.1 84.1% 39.4%), hsl(142.1 76.2% 36.3%), hsl(173.4 80.4% 40%));
            }
            .gradient-candy {
              background: linear-gradient(90deg, hsl(322.2 84% 60.5%), hsl(330.3 81.2% 60.4%), hsl(291.1 92.7% 65.3%));
            }
            .gradient-twilight {
              background: linear-gradient(90deg, hsl(231.7 48.6% 59%), hsl(262.1 83.3% 57.8%), hsl(263.4 70% 50.4%));
            }
          `}
        </style>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-xl">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-card/95 backdrop-blur-xl scrollbar-visible">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/30">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden hover:scale-105 transition-transform">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64 bg-card/95 backdrop-blur-xl scrollbar-visible">
                    <Sidebar mobile />
                  </SheetContent>
                </Sheet>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {menuItems.find((item) => item.href === location.pathname)?.title || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:scale-105 transition-all duration-300 hover:bg-primary/10"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-600" />
                  )}
                </Button>

                {/* Color Picker */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:scale-105 transition-all duration-300 hover:bg-primary/10"
                    >
                      <Palette className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                    <div className="p-4">
                      <p className="text-sm font-medium mb-4 text-center">Choose Theme Color</p>
                      <div className="grid grid-cols-5 gap-3 mb-4">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setPrimaryColor(color.value as typeof primaryColor)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden ${primaryColor === color.value
                              ? 'border-foreground shadow-lg scale-110 ring-2 ring-offset-2 ring-primary'
                              : 'border-transparent hover:border-muted-foreground'
                              }`}
                            style={{
                              backgroundColor: `hsl(${color.color})`,
                              boxShadow:
                                primaryColor === color.value
                                  ? `0 0 20px hsl(${color.color} / 0.5)`
                                  : undefined,
                            }}
                            title={color.name}
                          >
                            {primaryColor === color.value && (
                              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mb-2">Gradient Presets</p>
                      <div className="grid grid-cols-3 gap-2">
                        {gradientPresets.map((gradient) => (
                          <button
                            key={gradient.name}
                            onClick={() => setPrimaryColor(gradient.class as typeof primaryColor)}
                            className={`w-8 h-8 rounded-lg ${gradient.class} cursor-pointer hover:scale-110 transition-transform relative overflow-hidden ${primaryColor === gradient.class
                              ? 'ring-2 ring-offset-2 ring-primary'
                              : ''
                              }`}
                            title={gradient.name}
                          >
                            {primaryColor === gradient.class && (
                              <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:scale-105 transition-all duration-300"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                        <AvatarImage src={user.profile_pic} alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                          {user.first_name.charAt(0) + user.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-card/95 backdrop-blur-xl border-border/50"
                    align="end"
                  >
                    <div className="flex items-center justify-start gap-2 p-3 border-b border-border/50">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.first_name + ' ' + user.last_name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto scrollbar-visible">
            <div className="p-6 animate-fade-in">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="flex-shrink-0 border-t border-border/50 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/30 px-6 py-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">Powered by IDMerit</p>
              <img
                src={idmeritLogo}
                alt="IDMerit Logo"
                className="h-6 w-auto max-w-[100px] object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
              />
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;