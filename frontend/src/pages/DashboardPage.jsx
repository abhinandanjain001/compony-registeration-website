import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Bell, Search, Sun, Moon, Menu, LogOut, Edit2 } from "lucide-react";
import { fetchCompanyProfile } from "../store/slices/companySlice";
import { logout } from "../store/authSlice";
import authService from "../services/authService";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Redux selectors
  const user = useSelector((s) => s.auth.user);
  const { profile: company } = useSelector((s) => s.company);

  // Metrics data
  const [metrics] = useState([
    { id: 1, label: "Profile Completion", value: "85%", delta: "+5%" },
    { id: 2, label: "Company Views", value: "2.4k", delta: "+12%" },
    { id: 3, label: "Inquiries", value: "48", delta: "+3%" },
    { id: 4, label: "Avg Response Time", value: "2.1h", delta: "-0.3h" },
  ]);

  // Chart data
  const chartData = [
    { month: "Jan", views: 400, inquiries: 24 },
    { month: "Feb", views: 500, inquiries: 32 },
    { month: "Mar", views: 450, inquiries: 28 },
    { month: "Apr", views: 650, inquiries: 45 },
    { month: "May", views: 720, inquiries: 52 },
    { month: "Jun", views: 890, inquiries: 68 },
  ];

  const pieData = company
    ? [
        { name: "Complete", value: 85 },
        { name: "Incomplete", value: 15 },
      ]
    : [{ name: "No Data", value: 100 }];

  // ✔ FIXED duplicate declaration
  const COLORS = ["#10B981", "#EF4444", "#6366F1"];

  // Activities
  const activities = [
    { id: 1, avatar: "AB", text: "Updated company profile", time: "1 hour ago", type: "success" },
    { id: 2, avatar: "SY", text: "New inquiry from John Ltd", time: "3 hours ago", type: "info" },
    { id: 3, avatar: "MK", text: "Viewed company details", time: "5 hours ago", type: "neutral" },
  ];

  // Inquiries mock
  const inquiries = [
    { id: 1, name: "ABC Corp", email: "contact@abccorp.com", status: "Pending", date: "2025-12-08" },
    { id: 2, name: "XYZ Industries", email: "info@xyzind.com", status: "Responded", date: "2025-12-07" },
    { id: 3, name: "Tech Startup", email: "hey@techstartup.io", status: "Active", date: "2025-12-06" },
  ];

  // Fetch profile on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchCompanyProfile());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => navigate("/company-registration");

  // Pagination
  const pageSize = 3;
  const pages = Math.ceil(inquiries.length / pageSize);
  const paginatedInquiries = inquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Avatar initials
  const userInitials =
    user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const companyName = company?.company_name || "Company Profile";
  const industry = company?.industry || "Not specified";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          } overflow-y-auto`}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 py-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {userInitials[0]}
                </div>
                {sidebarOpen && (
                  <div>
                    <div className="font-semibold text-sm">{user?.fullName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{industry}</div>
                  </div>
                )}
              </div>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
              {[
                { key: "dashboard", label: "Dashboard", icon: "📊" },
                { key: "company", label: "Company Info", icon: "🏢" },
                { key: "inquiries", label: "Inquiries", icon: "📧" },
                { key: "analytics", label: "Analytics", icon: "📈" },
                { key: "settings", label: "Settings", icon: "⚙️" },
              ].map((item) => (
                <a
                  key={item.key}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition ${
                    !sidebarOpen && "justify-center"
                  } ${item.key === "dashboard" ? "bg-blue-50 dark:bg-slate-700 text-blue-600" : ""}`}
                  href="#"
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </a>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-slate-700 text-red-600 ${
                  !sidebarOpen && "justify-center"
                }`}
              >
                <LogOut size={18} />
                {sidebarOpen && "Logout"}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto flex flex-col">
          
          {/* Header */}
          <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={18} />
              </button>

              <div className="relative hidden sm:block">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search inquiries..."
                  className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-700 focus:ring-2 w-80"
                />
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setDark(!dark)}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-3 bg-blue-50 dark:bg-slate-700 px-3 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                  {userInitials}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{user?.fullName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="flex-1 p-6 space-y-6">
            
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome, {user?.fullName?.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-blue-100">
                    {company
                      ? `Manage your company "${companyName}" and grow your business`
                      : "Complete your company profile to get started"}
                  </p>
                </div>

                {!company && (
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50"
                  >
                    Complete Profile
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <div key={m.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border shadow-sm hover:shadow-md">
                  <div className="text-sm text-slate-500">{m.label}</div>
                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-2xl font-bold">{m.value}</div>
                    <div className={`text-sm font-semibold ${m.delta.startsWith("+") ? "text-green-600" : "text-blue-600"}`}>
                      {m.delta}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">vs last month</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Engagement Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"} />
                    <XAxis dataKey="month" stroke={dark ? "#cbd5e1" : "#475569"} />
                    <YAxis stroke={dark ? "#cbd5e1" : "#475569"} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="inquiries" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Profile Status</h3>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
                        {pieData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Activity + Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                  {activities.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          a.type === "success"
                            ? "bg-green-500"
                            : a.type === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {a.avatar[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{a.text}</div>
                        <div className="text-xs text-slate-400">{a.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inquiries Table */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border shadow-sm">

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Inquiries</h3>
                  {company && (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-600"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 uppercase border-b">
                        <th className="py-3 px-2">Company</th>
                        <th className="py-3 px-2">Email</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInquiries.map((inq) => (
                        <tr key={inq.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/40">
                          <td className="py-3 px-2 font-medium">{inq.name}</td>
                          <td className="py-3 px-2 text-slate-500">{inq.email}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                inq.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : inq.status === "Responded"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-500">{inq.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-500">
                    Page {currentPage} of {pages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                      disabled={currentPage === pages}
                      className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
