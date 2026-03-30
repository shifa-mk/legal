import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

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
  // Destructure token as well to ensure we check both
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(setUser(null));
      localStorage.removeItem("token"); // Essential to prevent auto-login with dead token
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      dispatch(setUser(null));
      localStorage.clear();
      toast.error(error?.response?.data?.message || "Logout failed");
      navigate("/");
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ask", label: "Ask AI", icon: User2 },
    { to: "/sections", label: "Sections", icon: BookText },
  ];

  return (
    <div className="bg-blue-900 text-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-4">

        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          ⚖️ <span>LegalMind</span>
        </Link>

        {/* Links only show if we actually have a user object */}
        {user && user.fullname && (
          <ul className="hidden md:flex font-medium items-center gap-6">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                  {Icon && <Icon className="w-4 h-4" />} {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4">
          {/* CRITICAL FIX: If user is null OR we don't have a name, show Login/Signup.
             This solves the issue in image_a50a9e.png where the buttons were hidden.
          */}
          {!token || !user || !user.fullname ? (
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-red-600 hover:bg-red-700 text-white border-none">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Bell className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground py-2 text-center">No new activity</p>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-amber-400/30">
                    <Avatar className="h-10 w-10">
                      {user?.profile?.avatar ? (
                        <AvatarImage
                          src={
                            // Check if it's already a full URL first
                            user?.profile?.avatar?.startsWith("http")
                              ? user.profile.avatar
                              : getCloudinaryUrl(user?.profile?.avatar)
                          }
                          alt={user?.fullname || "User"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-amber-500 text-white font-bold">
                          {user.fullname?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex w-full items-center">
                      <User2 className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={logoutHandler}>
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