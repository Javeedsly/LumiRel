"use client";

import "./asidel.css";
import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdCameraRoll, MdDashboard } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Aside: React.FC = () => {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [adminType, setAdminType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      try {
        const parsedData = JSON.parse(adminData);
        setAdminType(parsedData.role);
      } catch (error) {
        console.error("Admin məlumatını parse etmək mümkün olmadı:", error);
      }
    }
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("admin"); 
    router.push("/admin/login"); 
  };

  const getAdminHomeLink = () => {
    if (adminType === "superadmin") return "/admin/superadmin";
    if (adminType === "filmadmin") return "/admin/filmadmin";
    if (adminType === "useradmin") return "/admin/useradmin";
    return "/admin/login"; 
  };

  const menuItems = [
    {
      title: "Home",
      icon: <FaHome className="icon" />,
      link: getAdminHomeLink(), 
    },
    {
      title: "Dashboard",
      icon: <MdDashboard className="icon" />,
      link: "/admin/dashboard",
    },
  ];

  if (adminType === "superadmin" || adminType === "filmadmin") {
    menuItems.push({
      title: "Films",
      icon: <MdCameraRoll className="icon" />,
      link: "/admin/films",
      submenu: [
        { title: "All Films", link: "/admin/films" },
        { title: "Add Film", link: "/admin/add-film" },
        { title: "Film Cards", link: "/admin/film-cards" },
      ],
    });
  }

  if (adminType === "superadmin" || adminType === "useradmin") {
    menuItems.push({
      title: "Users",
      icon: <FaUsers className="icon" />,
      link: "/admin/users",
      submenu: [
        { title: "User List", link: "/admin/users" },
      ],
    });
  }

  if (adminType === "superadmin") {
    menuItems.push({
      title: "Admins",
      icon: <RiAdminFill className="icon" />,
      link: "/admin/admins",
      submenu: [
        { title: "All Admins", link: "/admin/admins" },
        { title: "Add Admin", link: "/admin/add-admin" },
      ],
    });
  }

  return (
    <aside>
      <div className="aside-left">
        <div className="admin-aside-left">
          <nav>
            <ul className="mainmenu">
              {menuItems.map((item, index) => (
                <li key={index} className="menu-item">
                  <a href={item.link} className="menu-link">
                    <div className="menu-content">
                      {item.icon}
                      <span>{item.title}</span>
                      {item.submenu && (
                        <div
                          className="down"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown(item.title);
                          }}
                        >
                          <FaChevronDown
                            className={`chevron ${
                              openDropdowns.includes(item.title) ? "open" : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </a>
                  {item.submenu && (
                    <ul
                      className={`submenu ${
                        openDropdowns.includes(item.title) ? "open" : ""
                      }`}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a href={subItem.link}>{subItem.title}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="menu-item logout">
                <button onClick={handleLogout} className="menu-link logout-btn">
                  <div className="menu-content">
                    <FaSignOutAlt className="icon" />
                    <span>Log Out</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
