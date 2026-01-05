
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ExploreEvents } from './pages/ExploreEvents';
import { EventDetail } from './pages/EventDetail';
import { OrganizerProfile } from './pages/OrganizerProfile';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { HelpCenter } from './pages/HelpCenter';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { Contact } from './pages/Contact';
import { AffiliateProgram } from './pages/AffiliateProgram';
import { MobileApp } from './pages/mobile/MobileApp';
import { MyTickets } from './pages/buyer/MyTickets';
import { TicketDetail } from './pages/buyer/TicketDetail';
import { MyOrders } from './pages/buyer/MyOrders';
import { OrderDetail as BuyerOrderDetail } from './pages/buyer/OrderDetail';
import { MyProfile } from './pages/buyer/MyProfile';
import { Wishlist } from './pages/buyer/Wishlist';
import { AffiliateDashboard as BuyerAffiliateDashboard } from './pages/buyer/AffiliateDashboard';
import { OrganizerDashboard } from './pages/organizer/Dashboard';
import { CreateEventWizard } from './pages/organizer/CreateEventWizard';
import { OrganizerEventsList } from './pages/organizer/EventsList';
import { OrganizerEventDetails } from './pages/organizer/EventDetails';
import { EditEvent } from './pages/organizer/EditEvent';
import { CheckInSelection } from './pages/organizer/CheckInSelection';
import { GatePortal } from './pages/organizer/GatePortal';
import { SalesList } from './pages/organizer/SalesList';
import { OrderDetail } from './pages/organizer/OrderDetail';
import { FinancialDashboard } from './pages/organizer/FinancialDashboard';
import { PaymentSetup } from './pages/organizer/PaymentSetup';
import { Integrations } from './pages/organizer/Integrations';
import { Settings } from './pages/organizer/Settings';
import { Reports } from './pages/organizer/Reports';
import { CouponsList } from './pages/organizer/CouponsList';
import { AffiliateManagement } from './pages/organizer/AffiliateManagement';
import { EditAffiliate } from './pages/organizer/EditAffiliate';
import { AffiliateAnalytics } from './pages/organizer/AffiliateAnalytics';
import { TrackingPixels } from './pages/organizer/TrackingPixels';
import { Notifications as OrganizerNotifications } from './pages/organizer/Notifications';
import { OrganizerLayout } from './layouts/OrganizerLayout';
import { BuyerLayout } from './layouts/BuyerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEvents } from './pages/admin/AdminEvents';
import { OrganizerReputation } from './pages/admin/OrganizerReputation';
import { EventAudit } from './pages/admin/EventAudit';
import { UserManagement } from './pages/admin/UserManagement';
import { UserDetail } from './pages/admin/UserDetail';
import { FinancialGlobal } from './pages/admin/FinancialGlobal';
import { SystemSettings } from './pages/admin/SystemSettings';
import { SystemLogs } from './pages/admin/SystemLogs';
import { useAuthStore } from './stores/useAuthStore';
import { UserRole } from './types';

const PrivateRoute = ({ children, roles }: React.PropsWithChildren<{ roles?: UserRole[] }>) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  
  const isOrganizerAdminRoute = location.pathname.startsWith('/organizador/');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBuyerDashboardRoute = ['/meus-ingressos', '/meus-pedidos', '/meu-perfil', '/meus-favoritos', '/meus-afiliados'].includes(location.pathname) || location.pathname.startsWith('/ingresso/') || location.pathname.startsWith('/meu-pedido/');
  
  const hideLayout = ['/login', '/cadastro', '/compra-sucesso', '/mobile-app'].includes(location.pathname) || 
                     isOrganizerAdminRoute || 
                     isAdminRoute || 
                     isBuyerDashboardRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar only shown when not in simplified layout views */}
      {!hideLayout && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/eventos" element={<ExploreEvents />} />
          <Route path="/evento/:slug" element={<EventDetail />} />
          <Route path="/organizador-perfil/:id" element={<OrganizerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/ajuda" element={<HelpCenter />} />
          <Route path="/termos" element={<TermsOfUse />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/regras-de-estorno" element={<RefundPolicy />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/afiliados" element={<AffiliateProgram />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-sucesso" element={<Success />} />
          <Route path="/mobile-app" element={<MobileApp />} />

          {/* Buyer Dashboard Routes */}
          <Route path="/meus-ingressos" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><MyTickets /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/meus-favoritos" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><Wishlist /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/ingresso/:id" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><TicketDetail /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/meus-pedidos" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><MyOrders /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/meu-pedido/:id" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><BuyerOrderDetail /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/meus-afiliados" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><BuyerAffiliateDashboard /></BuyerLayout>
            </PrivateRoute>
          } />
          <Route path="/meu-perfil" element={
            <PrivateRoute roles={[UserRole.BUYER]}>
              <BuyerLayout><MyProfile /></BuyerLayout>
            </PrivateRoute>
          } />

          {/* Organizer Routes */}
          <Route path="/organizador/*" element={
            <PrivateRoute roles={[UserRole.ORGANIZER]}>
              <OrganizerLayout>
                <Routes>
                  <Route path="dashboard" element={<OrganizerDashboard />} />
                  <Route path="eventos" element={<OrganizerEventsList />} />
                  <Route path="eventos/novo" element={<CreateEventWizard />} />
                  <Route path="eventos/:id" element={<OrganizerEventDetails />} />
                  <Route path="eventos/:id/editar" element={<EditEvent />} />
                  <Route path="cupons" element={<CouponsList />} />
                  <Route path="afiliados" element={<AffiliateManagement />} />
                  <Route path="afiliados/:id/editar" element={<EditAffiliate />} />
                  <Route path="afiliados/:id/analise" element={<AffiliateAnalytics />} />
                  <Route path="pixels" element={<TrackingPixels />} />
                  <Route path="notificacoes" element={<OrganizerNotifications />} />
                  <Route path="checkin" element={<CheckInSelection />} />
                  <Route path="checkin/:id" element={<GatePortal />} />
                  <Route path="vendas" element={<SalesList />} />
                  <Route path="vendas/:id" element={<OrderDetail />} />
                  <Route path="relatorios" element={<Reports />} />
                  <Route path="financeiro" element={<FinancialDashboard />} />
                  <Route path="financeiro/setup" element={<PaymentSetup />} />
                  <Route path="integracoes" element={<Integrations />} />
                  <Route path="configuracoes" element={<Settings />} />
                </Routes>
              </OrganizerLayout>
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute roles={[UserRole.ADMIN]}>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="eventos" element={<AdminEvents />} />
                  <Route path="eventos/:id/auditoria" element={<EventAudit />} />
                  <Route path="usuarios" element={<UserManagement />} />
                  <Route path="usuarios/:id/detalhes" element={<UserDetail />} />
                  <Route path="organizador/:id/reputacao" element={<OrganizerReputation />} />
                  <Route path="financeiro" element={<FinancialGlobal />} />
                  <Route path="configuracoes" element={<SystemSettings />} />
                  <Route path="logs" element={<SystemLogs />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          } />
        </Routes>
      </main>
      
      {/* Footer only shown when not in simplified layout views */}
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
