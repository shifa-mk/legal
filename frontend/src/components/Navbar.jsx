import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell, LogOut, User2, LayoutDashboard, BookText } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant.js";
import { setUser } from "../redux/auth.slice.js";



const getCloudinaryUrl = (publicId) =>
  `https://res.cloudinary.com/dihk6mdzv/image/upload/${publicId}`;

export default function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ask", label: "Ask AI", icon: User2 },
    { to: "/sections", label: "Sections", icon: BookText },
  ];

  return (
    <div className="bg-blue-900 text-white shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-4">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          ⚖️ <span>LegalAI Assist</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex font-medium items-center gap-6">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />} {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side (auth / notifications / profile) */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline" className="text-white border-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-red-600 hover:bg-red-700">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Bell className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    No new notifications
                  </p>
                </PopoverContent>
              </Popover>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {user?.profile?.avatar ? (
                        <AvatarImage
                          src={
                            user.profile.avatar.startsWith("http")
                              ? user.profile.avatar
                              : getCloudinaryUrl(user.profile.avatar)
                          }
                          alt={user.fullname || "User"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                          {user?.fullname?.charAt(0) || "U"}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.fullname}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User2 className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={logoutHandler}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
