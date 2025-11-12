import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import {
  ProtectedRoute,
  PublicRoute,
} from "@/components/routes/ProtectedRoute";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import TokenInvalid from "@/pages/auth/TokenInvalid";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/errors/NotFound";
import RoleList from "@/pages/role/RoleList";
import RoleForm from "@/pages/role/RoleForm";
import RoleView from "@/pages/role/RoleView";
import { PermissionGuard } from "@/guards/AccessControl";
import Forbidden from "@/pages/errors/Forbidden";
import { PERMISSIONS } from "@/constants/permissions";
import TabsDemo from "@/pages/TabsDemo";
import UserList from "@/pages/user/UserList";
import UserForm from "@/pages/user/UserForm";
import UserView from "@/pages/user/UserView";
import ServiceList from "@/pages/Service/ServiceList";
import Request from "@/pages/Service/KycRequest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public (unauthenticated-only) Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/token-invalid"
                element={
                  <PublicRoute>
                    <TokenInvalid />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Dashboard route */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tabs" element={<TabsDemo />} />

                {/* Roles routes */}
                <Route path="roles">
                  <Route index element={<RoleList />} />
                  <Route
                    path="create"
                    element={
                      <PermissionGuard permission={PERMISSIONS.ROLE.CREATE}>
                        <RoleForm />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <PermissionGuard permission={PERMISSIONS.ROLE.UPDATE}>
                        <RoleForm />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="view/:id"
                    element={
                      <PermissionGuard permission={PERMISSIONS.ROLE.READ}>
                        <RoleView />
                      </PermissionGuard>
                    }
                  />
                </Route>

                {/* User routes */}
                <Route path="users">
                  <Route index element={<UserList />} />
                  <Route
                    path="create"
                    element={
                      <PermissionGuard permission={PERMISSIONS.USER.CREATE}>
                        <UserForm />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <PermissionGuard permission={PERMISSIONS.USER.UPDATE}>
                        <UserForm />
                      </PermissionGuard>
                    }
                  />
                  <Route
                    path="view/:id"
                    element={
                      <PermissionGuard permission={PERMISSIONS.USER.READ}>
                        <UserView />
                      </PermissionGuard>
                    }
                  />
                </Route>

                {/* Services routes */}
                <Route path="services">
                  <Route index element={<ServiceList />} />
                  <Route path="kyc" element={<Request />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
              <Route path="/forbidden" element={<Forbidden />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;