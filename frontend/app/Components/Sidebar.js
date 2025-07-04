"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, Container, Badge } from "@mui/material";
import {
  Home,
  People,
  Menu,
  Logout,
  Build,
  Person,
  AssignmentTurnedIn,
  ExpandMore,
  NotificationsActive,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useGetUserByIdQuery } from "@/features/userApiSlice";
import { useLogoutMutation } from "@/features/authApiSlice";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useGetNotificationsQuery } from "@/features/notificationSlice";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Layout({ children }) {
  const params = useParams();
  const id = params?.employee || params?.manager;
  const { data } = useGetUserByIdQuery(id);
  const user = data?.user;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { data: notifications } = useGetNotificationsQuery(name);
  const unreadCount = notifications?.filter((notif) => !notif.read).length || 0;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On larger screens, automatically open the sidebar
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems =
    user?.role === "manager"
      ? [
          {
            text: "Dashboard",
            path: `/manager/${id}/dashboard`,
            icon: <Home />,
          },
          {
            text: "Manage Employee",
            path: `/manager/${id}/manageUser`,
            icon: <People />,
          },
          {
            text: "Team Services",
            path: `/manager/${id}/team-services`,
            icon: <AssignmentIcon />,
          },
          {
            text: "Manage Services",
            path: `/manager/${id}/manageServices`,
            icon: <CreateNewFolderIcon />,
          },
          {
            text: "Employee's Skill Request",
            path: `/manager/${id}/EmployeeSkill`,
            icon: <ListAltIcon />,
          },
          {
            text: "Service Payments",
            path: `/manager/${id}/payments`,
            icon: <CreditScoreIcon />,
          },
        ]
      : [
          {
            text: "Dashboard",
            path: `/employee/${id}/dashboard`,
            icon: <Home />,
          },
          {
            text: "Edit Profile",
            path: `/employee/${id}/edit-profile`,
            icon: <Person />,
          },
          {
            text: "Assigned Tasks",
            path: `/employee/${id}/team-services`,
            icon: <AssignmentIcon />,
          },
          {
            text: "Scheduling",
            path: `/employee/${id}/scheduling`,
            icon: <CalendarMonthIcon />,
          },
        ];

  const departmentMap = {
    saloon: "Stylist",
    garage: "Mechanic",
    repairing: "Technician",
    servicing: "Service Agent",
    plumbing: "Plumber",
    electrical: "Electrician",
    carpentry: "Carpenter",
    cleaning: "Cleaner",
    painting: "Painter",
    technical: "Technician",
    inspection: "Inspectioner",
  };

  return (
    <Container maxWidth="xl" disableGutters className="!p-0">
      <div className="flex h-fit relative">
        {/* Mobile Sidebar Toggle (Hamburger) - Always visible on mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md ${
            isMobile ? "block" : "hidden"
          }`}
        >
          <Menu fontSize="medium" className="text-gray-600" />
        </button>

        {/* Sidebar */}
        <div
          className={`bg-gray-100 text-gray-900 transition-all duration-300 fixed top-0 left-0 h-screen shadow-lg border-r border-gray-300 z-40 overflow-hidden
            ${
              isSidebarOpen
                ? "w-64 translate-x-0"
                : isMobile
                ? "w-0 -translate-x-full"
                : "w-20"
            }`}
        >
          {/* Top Navbar */}
          <div className="flex items-center justify-between px-4 py-2 shadow bg-white sticky top-0 z-30">
            <div className="flex items-center">
              <img
                src="/icon1.png"
                alt="IntelliAgent Logo"
                className="w-13 h-10"
              />
              {isSidebarOpen && (
                <span className="text-xl font-semibold text-gray-800 ml-2">
                  IntelliAgent
                </span>
              )}
              {!isMobile && (
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <ChevronRightIcon
                    fontSize="large"
                    className={`text-gray-600 hover:text-gray-900 transition ${
                      !isSidebarOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col h-full p-4 relative">
            <div
              className={`flex items-center p-3 mb-6 border-b border-gray-300 bg-white rounded-lg shadow-md transition-all ${
                isSidebarOpen ? "space-x-3" : "justify-center"
              }`}
            >
              <Avatar
                src={user?.profilePicture || "/profile.jpg"}
                alt={user?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-400 shadow-lg"
              />
              {isSidebarOpen && (
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-700 truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email}
                  </p>
                  <span className="mt-1 inline-block p-1 text-xs font-medium bg-[#f5fcc7] text-black rounded-lg shadow">
                    {user?.role === "manager"
                      ? "manager"
                      : departmentMap[user?.department] || "Unknown"}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-2 flex-grow overflow-auto custom-scrollbar">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-200 transition ${
                    pathname === item.path ? "bg-gray-200" : "bg-white"
                  } ${isSidebarOpen ? "space-x-3" : "justify-center"}`}
                >
                  <span className="text-gray-600">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm">{item.text}</span>
                  )}
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`flex items-center w-full p-2 sm:p-3 rounded-lg hover:bg-gray-200 transition ${
                    pathname.includes("/services") ? "bg-gray-200" : "bg-white"
                  } ${isSidebarOpen ? "justify-between" : "justify-center"}`}
                >
                  <div className="flex items-center">
                    <Build className="text-gray-600" />
                    {isSidebarOpen && (
                      <span className="text-sm ml-3">Today's Services</span>
                    )}
                  </div>
                  {isSidebarOpen && (
                    <ExpandMore
                      className={`text-gray-600 transition-transform ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {isServicesOpen && isSidebarOpen && (
                  <div className="ml-8 mt-1 bg-white rounded-lg shadow-md overflow-hidden">
                    {user?.role === "manager"
                      ? ["all", "accepted", "missed", "Approval"].map(
                          (type) => (
                            <Link
                              key={type}
                              href={`/manager/${id}/services/${type}`}
                              className="block px-3 py-2 text-sm hover:bg-gray-100 capitalize"
                            >
                              {type === "Approval"
                                ? "Approval requests"
                                : `${type} Services`}
                            </Link>
                          )
                        )
                      : ["all", "accepted", "missed", "Approval"].map(
                          (type) => (
                            <Link
                              key={type}
                              href={`/employee/${id}/services/${type}`}
                              className="block px-3 py-2 text-sm hover:bg-gray-100 capitalize"
                            >
                              {type === "Approval"
                                ? "sent for approval"
                                : `${type} Services`}
                            </Link>
                          )
                        )}
                  </div>
                )}
              </div>

              {/* Additional Links */}
              {[
                {
                  text: "Services History",
                  path: "services-history",
                  icon: <AssignmentIcon />,
                },
                {
                  text: "Notification",
                  path: "notification-page",
                  icon: (
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsActive />
                    </Badge>
                  ),
                },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={
                    user?.role === "manager"
                      ? `/manager/${id}/${item.path}`
                      : `/employee/${id}/${item.path}`
                  }
                  className={`flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-200 transition ${
                    pathname.includes(item.path) ? "bg-gray-200" : "bg-white"
                  } ${isSidebarOpen ? "space-x-3" : "justify-center"}`}
                >
                  <span className="text-gray-600">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm">{item.text}</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex items-center p-3 mt-5 mb-10 bg-white rounded-lg shadow-md hover:bg-red-300 hover:text-white transition ${
                isSidebarOpen ? "space-x-3" : "justify-center"
              }`}
            >
              <Logout className="text-gray-600" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 ${
            isMobile ? "" : isSidebarOpen ? "md:ml-64" : "md:ml-20"
          }`}
        >
          {children}
        </div>
      </div>
    </Container>
  );
}
