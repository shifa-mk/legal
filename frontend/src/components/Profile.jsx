import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Mail, Phone, Badge, MapPin } from "lucide-react";
import { Badge as BadgeUI } from "./ui/badge";
import UpdateProfileDialog from "./UpdateProfileDialog";

const getCloudinaryUrl = (publicId) =>
  `https://res.cloudinary.com/dihk6mdzv/image/upload/${publicId}`;

export default function Profile() {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);

  const avatarUrl = user?.profile?.avatar
    ? user.profile.avatar.startsWith("http")
      ? user.profile.avatar
      : getCloudinaryUrl(user.profile.avatar)
    : "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg";

  useEffect(() => {
    console.log("Police profile loaded:", user);
  }, [user]);

  return (
    <div>
     

      <div className="max-w-5xl mx-auto mt-6 p-6 bg-white shadow rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-28 w-28">
              <AvatarImage src={avatarUrl} alt={user?.fullname || "User"} />
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{user?.fullname}</h1>
              <p className="text-gray-500">{user?.profile?.rank || "Police Officer"}</p>
              <p className="text-gray-400 text-sm">{user?.profile?.badgeNumber}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Update Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-600" /> <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-gray-600" /> <span>{user?.phoneNumber || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="text-gray-600" /> <span>{user?.profile?.rank || "Officer"}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-600" /> <span>{user?.profile?.station || "N/A"}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <p>{user?.profile?.bio || "No bio available."}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Expertise / Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0
              ? user.profile.skills.map((skill, idx) => (
                  <BadgeUI key={idx}>{skill}</BadgeUI>
                ))
              : "N/A"}
          </div>
        </div>

        {/* Optional section: Cases handled */}
        {user?.profile?.casesHandled?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Cases Handled</h2>
            <ul className="list-disc ml-6">
              {user.profile.casesHandled.map((caseItem, idx) => (
                <li key={idx}>{caseItem}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
}

