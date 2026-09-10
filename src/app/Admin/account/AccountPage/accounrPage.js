// app/Admin/bank-accounts/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Raleway, Caveat } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function BankAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    accNumber: "",
    bankName: "",
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch bank accounts (no pagination)
  const fetchAccounts = async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const response = await fetch(`/api/Account/bank-accounts`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();

        let accountsData = [];
        
        if (result.data && Array.isArray(result.data)) {
          accountsData = result.data;
        } else if (Array.isArray(result)) {
          accountsData = result;
        } else {
          accountsData = [];
        }

        setAccounts(accountsData);
        console.log(`📊 Loaded ${accountsData.length} bank accounts`);
      } else {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        showToast(errorData.message || "Failed to fetch bank accounts", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Error fetching bank accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAccounts();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle search (client-side filtering)
  const filteredAccounts = accounts.filter((account) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      account.name?.toLowerCase().includes(searchLower) ||
      account.accNumber?.includes(searchTerm) ||
      account.bankName?.toLowerCase().includes(searchLower)
    );
  });

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create account
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      if (!formData.name || !formData.accNumber || !formData.bankName) {
        setFormError("Please fill in all fields");
        setFormLoading(false);
        return;
      }

      const response = await fetch("/api/Account/bank-accounts-create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(" Bank account added successfully!", "success");
        setShowCreateModal(false);
        setFormData({ name: "", accNumber: "", bankName: "" });
        fetchAccounts();
      } else {
        const data = await response.json();
        setFormError(data.message || "Failed to add bank account");
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete account - FIXED
  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `/api/Account/bank-account-delete?id=${accountToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        showToast(`🗑️ ${accountToDelete.name}'s account deleted successfully`, "success");
        fetchAccounts();
        setShowDeleteModal(false);
        setAccountToDelete(null);
      } else {
        const data = await response.json();
        showToast(data.message || "Failed to delete account", "error");
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAccountToDelete(null);
    setDeleteLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/admin/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/Auth/Admin/signin");
        showToast("👋 Logged out successfully", "success");
      } else {
        showToast("❌ Logout failed", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("❌ Error logging out", "error");
    }
  };

  // Stats
  const totalAccounts = accounts.length;
  const uniqueBanks = new Set(accounts.map(a => a.bankName?.toLowerCase())).size;
  const activeAccounts = accounts.filter(a => a.isActive !== false).length;

  if (loading && accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`${raleway.className} text-gray-500 mt-4`}>
            Loading bank accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-[280px] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div>
              <h1 className={`${playfair.className} text-2xl font-light text-gray-800`}>
                Admin
              </h1>
              <p className={`${caveat.className} text-sm text-gray-500`}>
                Dashboard
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/Admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className={`${raleway.className} font-medium`}>Products</span>
            </Link>
            <Link
              href="/Admin/bank-accounts"
              className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M5 18h14M3 6l9-4 9 4v2H3V6z" />
              </svg>
              <span className={`${raleway.className} font-medium`}>Bank Accounts</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors mt-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`${raleway.className} font-medium`}>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-xl shadow-lg max-w-[calc(100%-2rem)] sm:max-w-sm animate-slide-in ${
              toastMessage.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            <p className={`${raleway.className} text-sm font-medium`}>
              {toastMessage.message}
            </p>
          </div>
        )}

        {/* ⭐ EXCEPTIONAL DELETE MODAL */}
        {showDeleteModal && accountToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={closeDeleteModal}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-slide-up">
              {/* Decorative icon */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className={`${playfair.className} text-2xl font-light text-gray-800 mb-2`}>
                  Delete Bank Account
                </h3>
                
                <div className="w-12 h-0.5 bg-rose-200 mx-auto mb-4" />
                
                <p className={`${raleway.className} text-gray-500 mb-6 leading-relaxed`}>
                  Are you sure you want to delete the bank account for
                </p>
                
                {/* Account info card */}
                <div className="bg-rose-50 rounded-xl p-4 mb-6 border border-rose-100">
                  <p className={`${raleway.className} font-semibold text-gray-800 text-lg`}>
                    {accountToDelete.name}
                  </p>
                  <p className={`${raleway.className} text-sm text-gray-500 mt-1`}>
                    {accountToDelete.bankName} • {accountToDelete.accNumber}
                  </p>
                </div>
                
                <p className={`${raleway.className} text-sm text-rose-600 font-medium mb-6`}>
                  ⚠️ This action cannot be undone
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-600 order-2 sm:order-1"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2 order-1 sm:order-2 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
                  >
                    {deleteLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <h1 className={`${playfair.className} text-xl sm:text-2xl font-light text-gray-800 truncate`}>
                    💳 Bank Accounts
                  </h1>
                  <p className={`${caveat.className} text-xs sm:text-sm text-gray-500 truncate`}>
                    Manage payout bank accounts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Account</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto" id="accounts-section">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <p className={`${raleway.className} text-xs sm:text-sm text-gray-500`}>Total Accounts</p>
              <p className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-indigo-600`}>
                {totalAccounts}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <p className={`${raleway.className} text-xs sm:text-sm text-gray-500`}>Banks</p>
              <p className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-emerald-600`}>
                {uniqueBanks}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <p className={`${raleway.className} text-xs sm:text-sm text-gray-500`}>Account Holders</p>
              <p className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-amber-600`}>
                {accounts.length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <p className={`${raleway.className} text-xs sm:text-sm text-gray-500`}>Active</p>
              <p className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-blue-600`}>
                {activeAccounts}
              </p>
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Search */}
            <div className="p-3 sm:p-4 border-b">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by name, account number, or bank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  onClick={() => setSearchTerm("")}
                  className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-sm whitespace-nowrap ${
                    searchTerm 
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!searchTerm}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Accounts Grid */}
            <div className="p-3 sm:p-4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏦</div>
                  <p className={`${raleway.className} text-gray-500`}>
                    {accounts.length === 0
                      ? "No bank accounts yet. Add your first account!"
                      : "No accounts match your search"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className={`${raleway.className} text-sm text-gray-500`}>
                      Showing {filteredAccounts.length} of {accounts.length} accounts
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account._id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 sm:p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group relative"
                      >
                        {/* Delete Button - Now more visible */}
                        <button
                          onClick={() => openDeleteModal(account)}
                          className="absolute top-30 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-200 group-hover:scale-110"
                          aria-label="Delete account"
                        >
                          <svg className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0">
                            {account.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`${raleway.className} font-semibold text-gray-800 truncate`}>
                              {account.name}
                            </h3>
                            <p className={`${raleway.className} text-sm text-gray-500 mt-0.5`}>
                              {account.bankName}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                                {account.accNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">
                            {account.bankName}
                          </span>
                          {/* Additional delete link at bottom for better visibility */}
                          <button
                            onClick={() => openDeleteModal(account)}
                            className=" text-xs text-rose-400 hover:text-rose-600 transition-colors font-medium opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Create Account Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h2 className={`${playfair.className} text-xl font-light text-gray-800`}>
                  Add Bank Account
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1.5`}>
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div>
                  <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1.5`}>
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accNumber"
                    value={formData.accNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g., 9063810310"
                  />
                </div>

                <div>
                  <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1.5`}>
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g., Opay, GTBank, Access Bank"
                  />
                </div>

                {formError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium">
                    {formError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-indigo-600/20 order-1 sm:order-2"
                  >
                    {formLoading ? "Adding..." : "Add Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}