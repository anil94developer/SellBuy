import React, { useState } from 'react';
import { useAdminViewModel } from './viewmodels/useAdminViewModel';
import { AdminHeader, AdminSidebar } from './views/AdminNav';
import {
  DashboardSection,
  UsersSection,
  DealersSection,
  InventorySection,
  AddCarSection,
  CategoriesBrandsSection,
  BuyRequestsSection,
  SellRequestsSection,
  OrdersBookingsSection,
  WishlistEnquiriesSection,
  TestDriveBookingsSection,
  WebsitePagesSection,
  BannersSlidersSection,
  BlogContentSection,
  ReviewsRatingsSection,
  NotificationsSection,
  AdminUsersRolesSection,
  PermissionsSecuritySection,
  ReportsAnalyticsSection,
  PaymentsTransactionsSection,
  GeneralSettingsSection,
  SupportComplaintsSection,
  AuditLogsSection
} from './views/Sections';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    lang,
    toggleLang,
    t,
    stats,
    listings,
    users,
    usersPagination,
    fetchUsers,
    dealers,
    brands,
    categories,
    cities,
    logs,
    logFilter,
    setLogFilter,
    searchListings,
    setSearchListings,
    buyRequests,
    sellRequests,
    orders,
    wishlistEnquiries,
    testDrives,
    websitePages,
    banners,
    blogPosts,
    reviews,
    adminUsers,
    permissions,
    reports,
    transactions,
    settings,
    supportTickets,
    refreshAll,
    approveListing,
    rejectListing,
    toggleFeatured,
    deleteListing,
    toggleUserBlock,
    toggleDealerVerification,
    addDealer,
    addNewCar,
    updateBuyRequestStatus,
    updateSellRequestStatus,
    updateOrderStatus,
    downloadInvoice,
    updateEnquiryStatus,
    updateTestDriveStatus,
    toggleBannerActive,
    addBanner,
    addBlogPost,
    approveReview,
    flagReview,
    deleteReview,
    addAdminUser,
    togglePermission,
    saveSettings,
    resolveTicket,
    addBrand,
    updateBrand,
    toggleBrandStatus,
    deleteBrand,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    addCity,
    updateCity,
    toggleCityStatus,
    deleteCity,
    sendBroadcast
  } = useAdminViewModel();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-app-layout" style={{ background: '#0a0e17', minHeight: '100vh', color: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader
        lang={lang}
        toggleLang={toggleLang}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      <div className="admin-body-container" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)', position: 'relative' }}>
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="admin-main-content">
          {/* GROUP 1: MAIN MENU */}
          {activeTab === 'dashboard' && (
            <DashboardSection
              stats={stats}
              listings={listings}
              onApprove={approveListing}
              onReject={rejectListing}
              onToggleFeature={toggleFeatured}
              onRefresh={refreshAll}
              setActiveTab={setActiveTab}
              t={t}
            />
          )}

          {activeTab === 'users' && (
            <UsersSection
              users={users}
              pagination={usersPagination}
              onFetchUsers={fetchUsers}
              onToggleBlock={toggleUserBlock}
            />
          )}

          {activeTab === 'dealers' && (
            <DealersSection
              dealers={dealers}
              onToggleVerification={toggleDealerVerification}
              onAddDealer={addDealer}
            />
          )}

          {activeTab === 'inventory' && (
            <InventorySection
              listings={listings}
              search={searchListings}
              setSearch={setSearchListings}
              onApprove={approveListing}
              onReject={rejectListing}
              onToggleFeature={toggleFeatured}
              onDelete={deleteListing}
              setActiveTab={setActiveTab}
              t={t}
            />
          )}

          {activeTab === 'add-car' && (
            <AddCarSection
              brands={brands}
              cities={cities}
              onAddCar={addNewCar}
            />
          )}

          {['categories-brands', 'brands', 'categories', 'locations'].includes(activeTab) && (
            <CategoriesBrandsSection
              activeSubTab={activeTab === 'categories-brands' ? 'brands' : activeTab}
              onSubTabChange={(subTab) => setActiveTab(subTab)}
              brands={brands}
              categories={categories}
              cities={cities}
              onAddBrand={addBrand}
              onUpdateBrand={updateBrand}
              onToggleBrandStatus={toggleBrandStatus}
              onDeleteBrand={deleteBrand}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onToggleCategoryStatus={toggleCategoryStatus}
              onDeleteCategory={deleteCategory}
              onAddCity={addCity}
              onUpdateCity={updateCity}
              onToggleCityStatus={toggleCityStatus}
              onDeleteCity={deleteCity}
            />
          )}

          {/* GROUP 2: MARKETPLACE */}
          {activeTab === 'buy-requests' && (
            <BuyRequestsSection
              buyRequests={buyRequests}
              onUpdateStatus={updateBuyRequestStatus}
            />
          )}

          {activeTab === 'sell-requests' && (
            <SellRequestsSection
              sellRequests={sellRequests}
              onUpdateStatus={updateSellRequestStatus}
            />
          )}

          {activeTab === 'orders-bookings' && (
            <OrdersBookingsSection
              orders={orders}
              onUpdateStatus={updateOrderStatus}
              onDownloadInvoice={downloadInvoice}
            />
          )}

          {activeTab === 'wishlist-enquiries' && (
            <WishlistEnquiriesSection
              wishlistEnquiries={wishlistEnquiries}
              onUpdateStatus={updateEnquiryStatus}
            />
          )}

          {activeTab === 'test-drives' && (
            <TestDriveBookingsSection
              testDrives={testDrives}
              onUpdateStatus={updateTestDriveStatus}
            />
          )}

          {/* GROUP 3: WEBSITE MANAGEMENT */}
          {activeTab === 'website-pages' && (
            <WebsitePagesSection
              websitePages={websitePages}
            />
          )}

          {activeTab === 'banners-sliders' && (
            <BannersSlidersSection
              banners={banners}
              onToggleActive={toggleBannerActive}
              onAddBanner={addBanner}
            />
          )}

          {activeTab === 'blog-content' && (
            <BlogContentSection
              blogPosts={blogPosts}
              onAddBlogPost={addBlogPost}
            />
          )}

          {activeTab === 'reviews-ratings' && (
            <ReviewsRatingsSection
              reviews={reviews}
              onApprove={approveReview}
              onFlag={flagReview}
              onDelete={deleteReview}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSection
              onSendBroadcast={sendBroadcast}
            />
          )}

          {/* GROUP 4: ADMINISTRATION */}
          {activeTab === 'admin-users-roles' && (
            <AdminUsersRolesSection
              adminUsers={adminUsers}
              onAddAdminUser={addAdminUser}
            />
          )}

          {activeTab === 'permissions-security' && (
            <PermissionsSecuritySection
              permissions={permissions}
              onTogglePermission={togglePermission}
            />
          )}

          {activeTab === 'reports-analytics' && (
            <ReportsAnalyticsSection
              reports={reports}
            />
          )}

          {activeTab === 'payments-transactions' && (
            <PaymentsTransactionsSection
              transactions={transactions}
            />
          )}

          {activeTab === 'general-settings' && (
            <GeneralSettingsSection
              settings={settings}
              onSaveSettings={saveSettings}
            />
          )}

          {activeTab === 'support-complaints' && (
            <SupportComplaintsSection
              supportTickets={supportTickets}
              onResolveTicket={resolveTicket}
            />
          )}

          {activeTab === 'logs' && (
            <AuditLogsSection
              logs={logs}
              logFilter={logFilter}
              setLogFilter={setLogFilter}
              onRefresh={refreshAll}
            />
          )}
        </main>
      </div>
    </div>
  );
}
