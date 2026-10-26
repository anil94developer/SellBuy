import React from 'react';
import { useLanguageViewModel } from './viewmodels/useLanguageViewModel';
import { useMarketplaceViewModel } from './viewmodels/useMarketplaceViewModel';

// Views
import { Navbar } from './views/Navbar';
import { MenuDrawer } from './views/MenuDrawer';
import { BottomNav } from './views/BottomNav';
import { HeroBanner } from './views/HeroBanner';
import { MarketplaceLayout } from './views/MarketplaceLayout';
import { TrustSection } from './views/TrustSection';
import { Footer } from './views/Footer';

// Modals matching 26 Android Mobile Screens
import { CarDetailModal } from './views/CarDetailModal';
import { ImageGalleryModal } from './views/ImageGalleryModal';
import { SellerProfileModal } from './views/SellerProfileModal';
import { SellCarWizardModal } from './views/SellCarWizardModal';
import { MyListingsModal } from './views/MyListingsModal';
import { EditListingModal } from './views/EditListingModal';
import { SavedCarsModal } from './views/SavedCarsModal';
import { ChatModal } from './views/ChatModal';
import { NotificationsModal } from './views/NotificationsModal';
import { ProfileModal } from './views/ProfileModal';
import { CitySelectorModal } from './views/CitySelectorModal';
import { AdvancedFilterModal } from './views/AdvancedFilterModal';
import { AuthModal } from './views/AuthModal';
import { AndroidDeviceFrame } from './views/AndroidDeviceFrame';

export default function App() {
  const { lang, toggleLang, t } = useLanguageViewModel();
  const vm = useMarketplaceViewModel();

  const isFavorited = vm.selectedCar && vm.savedCarIds.includes(String(vm.selectedCar.id));

  // Render the marketplace content
  const renderContent = () => (
    <>
      <HeroBanner
        onOpenSellWizard={vm.startSellWizard}
        onExploreCars={() => {
          const el = document.getElementById('explore-cars');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        selectedCity={vm.selectedCity}
      />

      <MarketplaceLayout
        cars={vm.cars}
        loading={vm.loading}
        brands={vm.brands}
        selectedBrand={vm.selectedBrand}
        onSelectBrand={vm.setSelectedBrand}
        selectedCity={vm.selectedCity}
        onSelectCity={vm.selectCity}
        cities={vm.cities}
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        minPrice={vm.minPrice}
        setMinPrice={vm.setMinPrice}
        maxBudget={vm.maxBudget}
        setMaxBudget={vm.setMaxBudget}
        selectedFuel={vm.selectedFuel}
        setSelectedFuel={vm.setSelectedFuel}
        selectedTransmission={vm.selectedTransmission}
        setSelectedTransmission={vm.setSelectedTransmission}
        yearFrom={vm.yearFrom}
        setYearFrom={vm.setYearFrom}
        yearTo={vm.yearTo}
        setYearTo={vm.setYearTo}
        activeTab={vm.activeTab}
        onTabChange={vm.setActiveTab}
        sortBy={vm.sortBy}
        setSortBy={vm.setSortBy}
        savedCarIds={vm.savedCarIds}
        onToggleFavorite={vm.toggleFavorite}
        onCarClick={vm.openCarDetails}
        onStartChat={vm.startChatWithCar}
        onResetFilters={vm.resetFilters}
        onOpenSellWizard={vm.startSellWizard}
        pagination={vm.pagination}
        onPageChange={vm.setPage}
        t={t}
      />

      <TrustSection onOpenSellWizard={vm.startSellWizard} />

      <Footer
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        onSelectBrand={(brand) => {
          vm.setSelectedBrand(brand);
          const el = document.getElementById('explore-cars');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </>
  );

  return (
    <div className={`website-root ${vm.viewMode === 'mobile' ? 'mobile-simulator-active' : ''}`}>
      {/* Top Global Navigation Bar (OLX / Cars24 Style) */}
      <Navbar
        t={t}
        lang={lang}
        toggleLang={toggleLang}
        selectedCity={vm.selectedCity}
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        keyword={vm.keyword}
        setKeyword={vm.setKeyword}
        onSearch={vm.loadCars}
        brands={vm.brands}
        selectedBrand={vm.selectedBrand}
        onSelectBrand={vm.setSelectedBrand}
        activeTab={vm.activeTab}
        onTabChange={vm.setActiveTab}
        onOpenFilterModal={() => vm.setIsFilterModalOpen(true)}
        savedCount={vm.savedCarIds.length}
        onOpenSavedCars={() => vm.setIsSavedCarsOpen(true)}
        unreadChatsCount={vm.unreadChatsCount}
        onOpenChat={() => vm.setIsChatOpen(true)}
        unreadNotificationsCount={vm.unreadNotificationsCount}
        onOpenNotifications={() => vm.setIsNotificationsOpen(true)}
        onOpenSellWizard={vm.startSellWizard}
        currentUser={vm.currentUser}
        onOpenProfile={() => vm.setIsProfileOpen(true)}
        onOpenAuth={() => {
          vm.setAuthStep('login');
          vm.setIsAuthModalOpen(true);
        }}
        onOpenDrawer={() => vm.setIsDrawerOpen(true)}
        viewMode={vm.viewMode}
        toggleViewMode={() => vm.setViewMode(m => m === 'desktop' ? 'mobile' : 'desktop')}
      />

      {/* Main Viewport: Desktop vs Android Mobile Preview */}
      {vm.viewMode === 'desktop' ? (
        <main className="desktop-main-wrapper">
          {renderContent()}
        </main>
      ) : (
        <AndroidDeviceFrame
          selectedCity={vm.selectedCity}
          onExitMobileMode={() => vm.setViewMode('desktop')}
          onOpenCityModal={() => vm.setIsCityModalOpen(true)}
          onOpenNotifications={() => vm.setIsNotificationsOpen(true)}
          unreadNotificationsCount={vm.unreadNotificationsCount}
          onOpenDrawer={() => vm.setIsDrawerOpen(true)}
          onOpenSearch={() => {
            const el = document.getElementById('explore-cars');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {renderContent()}
        </AndroidDeviceFrame>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        savedCount={vm.savedCarIds.length}
        unreadChatsCount={vm.unreadChatsCount}
        onOpenSavedCars={() => vm.setIsSavedCarsOpen(true)}
        onOpenChat={() => vm.setIsChatOpen(true)}
        onOpenSellWizard={vm.startSellWizard}
        onOpenProfile={() => {
          if (vm.currentUser) vm.setIsProfileOpen(true);
          else {
            vm.setAuthStep('login');
            vm.setIsAuthModalOpen(true);
          }
        }}
        onOpenSearch={() => {
          const el = document.getElementById('explore-cars');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Side Menu Drawer (Screen 09) */}
      <MenuDrawer
        isOpen={vm.isDrawerOpen}
        onClose={() => vm.setIsDrawerOpen(false)}
        currentUser={vm.currentUser}
        selectedCity={vm.selectedCity}
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        onOpenMyListings={() => vm.setIsMyListingsOpen(true)}
        onOpenSavedCars={() => vm.setIsSavedCarsOpen(true)}
        onOpenChat={() => vm.setIsChatOpen(true)}
        onOpenNotifications={() => vm.setIsNotificationsOpen(true)}
        onOpenSellWizard={vm.startSellWizard}
        onOpenProfile={() => vm.setIsProfileOpen(true)}
        onOpenAuth={() => {
          vm.setAuthStep('login');
          vm.setIsAuthModalOpen(true);
        }}
        onLogout={vm.logout}
        unreadChatsCount={vm.unreadChatsCount}
        unreadNotificationsCount={vm.unreadNotificationsCount}
        savedCount={vm.savedCarIds.length}
        listingsCount={vm.userListings.length}
        toggleLang={toggleLang}
        lang={lang}
        t={t}
      />

      {/* Car Detail Modal (Screen 13) */}
      <CarDetailModal
        car={vm.selectedCar}
        onClose={vm.closeCarDetails}
        onOpenGallery={vm.openGallery}
        onOpenSellerProfile={vm.openSellerProfile}
        onStartChat={vm.startChatWithCar}
        onToggleFavorite={vm.toggleFavorite}
        isFavorited={isFavorited}
        currentUser={vm.currentUser}
        onEditListing={vm.setEditListingCar}
        onOpenMyListings={() => vm.setIsMyListingsOpen(true)}
      />

      {/* Fullscreen Image Gallery (Screen 14) */}
      <ImageGalleryModal
        car={vm.galleryCar}
        onClose={vm.closeGallery}
      />

      {/* Seller Profile Modal (Screen 15) */}
      <SellerProfileModal
        sellerData={vm.sellerModalData}
        onClose={() => vm.setSellerModalData(null)}
        onSelectCar={vm.openCarDetails}
        onStartChat={vm.startChatWithCar}
      />

      {/* Sell Car Multi-Step Wizard (Screens 16-20) */}
      <SellCarWizardModal
        isOpen={vm.isSellWizardOpen}
        onClose={() => vm.setIsSellWizardOpen(false)}
        brands={vm.brands}
        cities={vm.cities}
        step={vm.sellStep}
        setStep={vm.setSellStep}
        onSubmit={vm.submitSellCar}
        onUploadImage={vm.uploadAvatar}
      />

      {/* My Listings Modal (Screen 21) */}
      <MyListingsModal
        isOpen={vm.isMyListingsOpen}
        onClose={() => vm.setIsMyListingsOpen(false)}
        listings={vm.userListings}
        counts={vm.userListingsCounts}
        activeTab={vm.myListingsTab}
        onTabChange={vm.setMyListingsTab}
        onEditListing={(car) => vm.setEditListingCar(car)}
        onDeleteListing={vm.deleteListing}
        onAddNewListing={vm.startSellWizard}
        onSelectCar={vm.openCarDetails}
      />

      {/* Edit Listing Modal (Screen 22) */}
      <EditListingModal
        car={vm.editListingCar}
        onClose={() => vm.setEditListingCar(null)}
        onUpdate={vm.updateListing}
      />

      {/* Saved Cars Modal (Screen 23) */}
      <SavedCarsModal
        isOpen={vm.isSavedCarsOpen}
        onClose={() => vm.setIsSavedCarsOpen(false)}
        savedCars={vm.savedCars}
        onSelectCar={vm.openCarDetails}
        onToggleFavorite={vm.toggleFavorite}
        onExploreCars={() => {
          const el = document.getElementById('explore-cars');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Real-Time Chat Modal (Screen 24) */}
      <ChatModal
        isOpen={vm.isChatOpen}
        onClose={() => vm.setIsChatOpen(false)}
        conversations={vm.conversations}
        activeConversation={vm.activeConversation}
        setActiveConversation={vm.setActiveConversation}
        onSendMessage={vm.sendMessage}
        onSelectCar={vm.openCarDetails}
        currentUser={vm.currentUser}
        userListings={vm.userListings}
        onTyping={vm.sendTyping}
        isSocketConnected={vm.isSocketConnected}
        typingStatus={vm.typingStatus}
      />

      {/* Notifications Modal (Screen 25) */}
      <NotificationsModal
        isOpen={vm.isNotificationsOpen}
        onClose={() => vm.setIsNotificationsOpen(false)}
        notifications={vm.notifications}
        onMarkRead={vm.markNotificationRead}
        onMarkAllRead={vm.markAllNotificationsRead}
        onOpenChat={() => vm.setIsChatOpen(true)}
        onOpenMyListings={() => vm.setIsMyListingsOpen(true)}
        onSelectCar={vm.openCarDetails}
      />

      {/* Profile & Settings Modal (Screen 26) */}
      <ProfileModal
        isOpen={vm.isProfileOpen}
        onClose={() => vm.setIsProfileOpen(false)}
        currentUser={vm.currentUser}
        savedCount={vm.savedCarIds.length}
        listingsCount={vm.userListings.length}
        chatsCount={vm.conversations.length}
        selectedCity={vm.selectedCity}
        onOpenCityModal={() => vm.setIsCityModalOpen(true)}
        onOpenMyListings={() => vm.setIsMyListingsOpen(true)}
        onOpenSavedCars={() => vm.setIsSavedCarsOpen(true)}
        onOpenChat={() => vm.setIsChatOpen(true)}
        onOpenNotifications={() => vm.setIsNotificationsOpen(true)}
        onOpenSellWizard={vm.startSellWizard}
        onSaveProfile={vm.saveProfile}
        onUploadAvatar={vm.uploadAvatar}
        onLogout={vm.logout}
        toggleLang={toggleLang}
        lang={lang}
      />

      {/* City Selector Modal (Screens 06 & 07) */}
      <CitySelectorModal
        isOpen={vm.isCityModalOpen}
        onClose={() => vm.setIsCityModalOpen(false)}
        cities={vm.cities}
        selectedCity={vm.selectedCity}
        onSelectCity={vm.selectCity}
      />

      {/* Advanced Filter Modal (Screen 11) */}
      <AdvancedFilterModal
        isOpen={vm.isFilterModalOpen}
        onClose={() => vm.setIsFilterModalOpen(false)}
        brands={vm.brands}
        currentBrand={vm.selectedBrand}
        currentMaxBudget={vm.maxBudget}
        currentMinPrice={vm.minPrice}
        currentFuel={vm.selectedFuel}
        currentTransmission={vm.selectedTransmission}
        currentYearFrom={vm.yearFrom}
        currentYearTo={vm.yearTo}
        onApplyFilters={vm.applyAdvancedFilters}
        onResetFilters={vm.resetFilters}
      />

      {/* Authentication Modal (Screens 03, 04, 05) */}
      <AuthModal
        isOpen={vm.isAuthModalOpen}
        onClose={() => vm.setIsAuthModalOpen(false)}
        step={vm.authStep}
        setStep={vm.setAuthStep}
        phone={vm.authPhone}
        onRequestOtp={vm.requestOtp}
        onVerifyOtp={vm.verifyOtp}
        onSaveProfile={vm.saveProfile}
        onUploadAvatar={vm.uploadAvatar}
      />

      {/* Feedback Toast Notification Banner */}
      {vm.toastMessage && (
        <div className="feedback-toast-banner">
          <i className="fa-solid fa-circle-check"></i>
          <span>{vm.toastMessage}</span>
        </div>
      )}
    </div>
  );
}
