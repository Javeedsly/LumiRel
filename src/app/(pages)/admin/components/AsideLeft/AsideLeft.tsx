"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  MdCameraRoll,
  MdDashboard,
} from "react-icons/md";

import {
  RiAdminFill,
} from "react-icons/ri";

import "./asidel.css";

interface SubMenuItem {
  title: string;
  link: string;
}

interface MenuItem {
  title: string;
  icon: ReactNode;
  link: string;
  submenu?: SubMenuItem[];
}

type AdminType =
  | "superadmin"
  | "filmadmin"
  | "useradmin"
  | null;

const Aside = () => {
  const [
    openDropdowns,
    setOpenDropdowns,
  ] = useState<string[]>([]);

  const [
    adminType,
    setAdminType,
  ] = useState<AdminType>(null);

  const router = useRouter();

  useEffect(() => {
    const adminData =
      localStorage.getItem("admin");

    if (!adminData) {
      return;
    }

    try {
      const parsedData =
        JSON.parse(adminData);

      const role =
        parsedData?.role;

      if (
        role === "superadmin" ||
        role === "filmadmin" ||
        role === "useradmin"
      ) {
        setAdminType(role);
      }
    } catch (error) {
      console.error(
        "Admin məlumatını parse etmək mümkün olmadı:",
        error
      );
    }
  }, []);

  const toggleDropdown = (
    menu: string
  ) => {
    setOpenDropdowns(
      (prev) =>
        prev.includes(menu)
          ? prev.filter(
              (item) =>
                item !== menu
            )
          : [
              ...prev,
              menu,
            ]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "admin"
    );

    router.push(
      "/admin/login"
    );
  };

  const getAdminHomeLink =
    (): string => {
      if (
        adminType ===
        "superadmin"
      ) {
        return "/admin/superadmin";
      }

      if (
        adminType ===
        "filmadmin"
      ) {
        return "/admin/filmadmin";
      }

      if (
        adminType ===
        "useradmin"
      ) {
        return "/admin/useradmin";
      }

      return "/admin/login";
    };

  const menuItems: MenuItem[] =
    [
      {
        title: "Home",
        icon: (
          <FaHome className="icon" />
        ),
        link:
          getAdminHomeLink(),
      },

      {
        title: "Dashboard",
        icon: (
          <MdDashboard className="icon" />
        ),
        link:
          "/admin/dashboard",
      },
    ];

  if (
    adminType ===
      "superadmin" ||
    adminType ===
      "filmadmin"
  ) {
    menuItems.push({
      title: "Films",

      icon: (
        <MdCameraRoll className="icon" />
      ),

      link:
        "/admin/films",

      submenu: [
        {
          title:
            "All Films",

          link:
            "/admin/films",
        },

        {
          title:
            "Add Film",

          link:
            "/admin/add-film",
        },

        {
          title:
            "Film Cards",

          link:
            "/admin/film-cards",
        },
      ],
    });
  }

  if (
    adminType ===
      "superadmin" ||
    adminType ===
      "useradmin"
  ) {
    menuItems.push({
      title: "Users",

      icon: (
        <FaUsers className="icon" />
      ),

      link:
        "/admin/users",

      submenu: [
        {
          title:
            "User List",

          link:
            "/admin/users",
        },
      ],
    });
  }

  if (
    adminType ===
    "superadmin"
  ) {
    menuItems.push({
      title: "Admins",

      icon: (
        <RiAdminFill className="icon" />
      ),

      link:
        "/admin/admins",

      submenu: [
        {
          title:
            "All Admins",

          link:
            "/admin/admins",
        },

        {
          title:
            "Add Admin",

          link:
            "/admin/add-admin",
        },
      ],
    });
  }

  const handleMainMenuClick =
    (
      event: React.MouseEvent<
        HTMLAnchorElement
      >,
      item: MenuItem
    ) => {
      if (
        item.submenu &&
        item.submenu.length > 0
      ) {
        event.preventDefault();

        toggleDropdown(
          item.title
        );

        return;
      }

      event.preventDefault();

      router.push(
        item.link
      );
    };

  const handleSubMenuClick =
    (
      event: React.MouseEvent<
        HTMLAnchorElement
      >,
      link: string
    ) => {
      event.preventDefault();

      router.push(link);
    };

  return (
    <aside>
      <div className="aside-left">
        <div className="admin-aside-left">
          <nav>
            <ul className="mainmenu">
              {menuItems.map(
                (item) => {
                  const isOpen =
                    openDropdowns.includes(
                      item.title
                    );

                  return (
                    <li
                      key={
                        item.title
                      }
                      className="menu-item"
                    >
                      <a
                        href={
                          item.link
                        }
                        className="menu-link"
                        onClick={(
                          event
                        ) =>
                          handleMainMenuClick(
                            event,
                            item
                          )
                        }
                      >
                        <div className="menu-content">
                          {
                            item.icon
                          }

                          <span>
                            {
                              item.title
                            }
                          </span>

                          {item.submenu &&
                            item
                              .submenu
                              .length >
                              0 && (
                              <div className="down">
                                <FaChevronDown
                                  className={`chevron ${
                                    isOpen
                                      ? "open"
                                      : ""
                                  }`}
                                />
                              </div>
                            )}
                        </div>
                      </a>

                      {item.submenu &&
                        item
                          .submenu
                          .length >
                          0 && (
                          <ul
                            className={`submenu ${
                              isOpen
                                ? "open"
                                : ""
                            }`}
                          >
                            {item.submenu.map(
                              (
                                subItem
                              ) => (
                                <li
                                  key={
                                    subItem.link
                                  }
                                >
                                  <a
                                    href={
                                      subItem.link
                                    }
                                    onClick={(
                                      event
                                    ) =>
                                      handleSubMenuClick(
                                        event,
                                        subItem.link
                                      )
                                    }
                                  >
                                    {
                                      subItem.title
                                    }
                                  </a>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </li>
                  );
                }
              )}

              <li className="menu-item logout">
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="menu-link logout-btn"
                >
                  <div className="menu-content">
                    <FaSignOutAlt className="icon" />

                    <span>
                      Log Out
                    </span>
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