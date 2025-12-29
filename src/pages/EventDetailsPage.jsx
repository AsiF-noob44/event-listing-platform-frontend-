import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Bookmark,
  BookmarkCheck,
  Share2,
  Info,
  Music,
  Trophy,
  Palette,
  Laptop,
  Briefcase,
  Utensils,
  Heart,
  GraduationCap,
  Sparkles,
  Leaf,
  Film,
  Grid,
} from "lucide-react";
import { eventApi } from "../lib/api/eventApi";
import { savedEventApi } from "../lib/api/savedEventApi";
import useAuthStore from "../lib/store/authStore";
import toast from "react-hot-toast";

const categoryIcons = {
  Music: Music,
  Sports: Trophy,
  Arts: Palette,
  Technology: Laptop,
  Business: Briefcase,
  Food: Utensils,
  Health: Heart,
  Education: GraduationCap,
  Lifestyle: Sparkles,
  Environment: Leaf,
  Entertainment: Film,
  Other: Grid,
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventApi.getEventById(id);
        setEvent(response.data);

        // Check if event is saved (only if user is logged in)
        if (user) {
          try {
            const savedResponse = await savedEventApi.checkIfSaved(id);
            setIsSaved(savedResponse.isSaved);
          } catch (err) {
            // Silently fail if checking saved status fails
            console.error("Failed to check if event is saved:", err);
          }
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch event details"
        );
        setError(
          err.response?.data?.message || "Failed to fetch event details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleSaveEvent = async () => {
    if (!user) {
      toast.error("Please login to save events");
      navigate("/login");
      return;
    }

    try {
      setSavingEvent(true);
      if (isSaved) {
        await savedEventApi.unsaveEvent(id);
        setIsSaved(false);
        toast.success("Event removed from saved list");
      } else {
        await savedEventApi.saveEvent(id);
        setIsSaved(true);
        toast.success("Event saved successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setSavingEvent(false);
    }
  };

  const handleShareEvent = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: url,
        });
        toast.success("Event shared successfully!");
      } catch (error) {
        if (error.name !== "AbortError") {
          handleCopyLink(url);
        }
      }
    } else {
      handleCopyLink(url);
    }
  };

  const handleCopyLink = (url) => {
    try {
      navigator.clipboard.writeText(url);
      toast.success("Event link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link. Please copy manually.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body">
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => navigate("/events")}
                className="btn btn-primary"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <Calendar className="mx-auto h-16 w-16 text-base-content/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-base-content/70 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="btn btn-primary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[event.category] || Grid;

  return (
    <motion.div
      className="flex-1 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        {/* Event Card */}
        <div className="card bg-base-100 shadow-2xl overflow-hidden">
          {/* Header Section with Gradient and Better Contrast */}
          <div className="relative bg-linear-to-r from-primary to-secondary px-8 py-12">
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>

            <motion.div
              className="relative z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4">
                <div className="badge badge-lg gap-2 bg-black/50 border-white/50 text-white backdrop-blur-sm">
                  <CategoryIcon className="w-4 h-4" />
                  {event.category}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                {event.name}
              </h1>
              <div className="flex items-center gap-2 text-white drop-shadow-md">
                <User className="w-5 h-5" />
                <span className="text-lg">
                  Organized by {event.organizer?.name || "Unknown"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="card-body p-8">
            {/* Quick Info Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-8 h-8 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1 text-warning">
                    Date
                  </p>
                  <p className="font-semibold text-base">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1 text-warning">
                    Time
                  </p>
                  <p className="font-semibold text-base">{event.time}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1 text-warning">
                    Location
                  </p>
                  <p className="font-semibold text-base">{event.location}</p>
                </div>
              </div>
            </motion.div>

            <div className="divider"></div>

            {/* Description Section */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-4">About This Event</h2>
              <p className="text-lg leading-relaxed text-base-content/80 whitespace-pre-wrap">
                {event.description}
              </p>
            </motion.div>

            <div className="divider"></div>

            {/* Organizer Section */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Event Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-linear-to-br from-primary to-secondary text-neutral-content rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-3xl font-bold">
                      {event.organizer?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xl">
                    {event.organizer?.name || "Unknown Organizer"}
                  </p>
                  <p className="text-base-content/70">
                    {event.organizer?.email}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="divider"></div>

            {/* Additional Info */}
            <motion.div
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="alert">
                <Info className="w-6 h-6" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Event Information</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDateTime(event.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {formatDateTime(event.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={handleSaveEvent}
                disabled={savingEvent}
                className={`btn flex-1 gap-2 ${
                  isSaved ? "btn-success" : "btn-primary"
                }`}
              >
                {savingEvent ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isSaved ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
                {isSaved ? "Remove from Saved" : "Save Event"}
              </button>
              <button
                onClick={handleShareEvent}
                className="btn btn-secondary flex-1 gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Event
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailsPage;
