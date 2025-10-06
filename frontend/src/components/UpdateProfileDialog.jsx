import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/auth.slice.js";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../utils/constant.js";

export default function UpdateProfileDialog({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    rank: "",
    badgeNumber: "",
    station: "",
    bio: "",
    skills: "",
    casesHandled: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullname || "",
        phoneNumber: user.phoneNumber || "",
        rank: user.profile?.rank || "",
        badgeNumber: user.profile?.badgeNumber || "",
        station: user.profile?.station || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        casesHandled: user.profile?.casesHandled?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        fullname: formData.fullName,
        phoneNumber: formData.phoneNumber,
        profile: {
          rank: formData.rank,
          badgeNumber: formData.badgeNumber,
          station: formData.station,
          bio: formData.bio,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          casesHandled: formData.casesHandled.split(",").map((c) => c.trim()).filter(Boolean),
        },
      };

      const res = await axios.put(`${USER_API_END_POINT}/update-profile`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-3">
          <Input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <Input
            name="rank"
            placeholder="Rank"
            value={formData.rank}
            onChange={handleChange}
          />
          <Input
            name="badgeNumber"
            placeholder="Badge Number"
            value={formData.badgeNumber}
            onChange={handleChange}
          />
          <Input
            name="station"
            placeholder="Station / Department"
            value={formData.station}
            onChange={handleChange}
          />
          <Input
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <Input
            name="skills"
            placeholder="Skills (comma-separated)"
            value={formData.skills}
            onChange={handleChange}
          />
          <Input
            name="casesHandled"
            placeholder="Cases Handled (comma-separated)"
            value={formData.casesHandled}
            onChange={handleChange}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
