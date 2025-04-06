/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { MdOutlineHelp } from "react-icons/md";
import { IoNotificationsCircleSharp } from "react-icons/io5";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Optionally you can add the search form back when needed
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const urlParams = new URLSearchParams(location.search);
  //   urlParams.set('searchTerm', searchTerm);
  //   const searchQuery = urlParams.toString();
  //   navigate(`/search?${searchQuery}`);
  // };

  return (
    <div className="py-7">
      <Navbar
        className={`border-b-2 h-16 fixed w-full z-20 top-0 start-0 
          ${
            theme === "light"
              ? "bg-gradient-to-r from-blue-200 via-blue-200 to-blue-100 text-blue-900"
              : "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white"
          }`}
      >
        <div className="container flex justify-between items-center w-full">
          {/* Left: Brand Image and Elevated "We~Go" Span */}
          <Link to="/" className="flex items-center">
            {theme === "light" ? (
              <img className="h-12 w-auto" src="/images/h1.png" alt="Logo" />
            ) : (
              <img className="h-12 w-auto" src="/images/h1.png" alt="Logo" />
            )}
            <span
              className={`px-3 mx-1 py-2 rounded-lg font-bold 
              
                   bg-gradient-to-r from-blue-500 via-blue-400 to-blue-400 text-white
                 
            
              shadow-2xl drop-shadow-lg`}
            >
              We~Go
            </span>
          </Link>

          {/* Right: Navigation links and user options */}
          <div className="flex items-center">
            <Navbar.Collapse className="mr-4">
              <Navbar.Link active={path === "/"} as={"div"}>
                <Link to="/">Home</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/request"} as={"div"}>
                <Link to="/request">All request</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/about"} as={"div"}>
                <Link to="/about">About</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/help"} as={"div"}>
                <Link to="/help" className="flex items-center">
                  <MdOutlineHelp className="text-2xl mr-1" /> Help
                </Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/notification"} as={"div"}>
                <Link to="/notification" className="flex items-center">
                  <IoNotificationsCircleSharp className="text-2xl mr-1" />{" "}
                  Notification
                </Link>
              </Navbar.Link>
            </Navbar.Collapse>

            <div className="flex items-center gap-2">
              <Button
                className="w-12 h-10"
                color="gray"
                pill
                onClick={() => dispatch(toggleTheme())}
              >
                {theme === "light" ? <FaSun /> : <FaMoon />}
              </Button>
              {currentUser ? (
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar
                      alt="user"
                      img={currentUser.profile_picture}
                      rounded
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">
                      @{currentUser.username}
                    </span>
                    <span className="block text-sm font-medium truncate">
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Link to={"/profile"}>
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignout}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              ) : (
                <Link to="/sign-in">
                  <Button gradientDuoTone="purpleToBlue" outline>
                    Sign In
                  </Button>
                </Link>
              )}
              <Navbar.Toggle />
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
