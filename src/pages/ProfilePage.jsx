import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit,
  Bookmark,
  X,
  CalendarX2,
} from "lucide-react";
import { eventApi } from "../lib/api/eventApi";
import { savedEventApi } from "../lib/api/savedEventApi";
import useAuthStore from "../lib/store/authStore";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("created");
  const [myEvents, setMyEvents] = useState({ upcoming: [], past: [] });
  const [savedEvents, setSavedEvents] = useState({ upcoming: [], past: [] });
  const [stats, setStats] = useState({
    createdCount: 0,
    upcomingCount: 0,
    pastCount: 0,
    savedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showPastEvents, setShowPastEvents] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [myEventsRes, savedEventsRes, statsRes, categoriesRes] =
        await Promise.all([
          eventApi.getUserEvents(),
          savedEventApi.getSavedEvents(),
          eventApi.getUserStats(),
          eventApi.getCategories(),
        ]);

      setMyEvents(myEventsRes.data);
      setSavedEvents(savedEventsRes.data);
      setStats(statsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      await eventApi.createEvent({ ...formData, timezoneOffset });
      toast.success("Event created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      category: event.category,
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      await eventApi.updateEvent(editingEvent._id, {
        ...formData,
        timezoneOffset,
      });
      toast.success("Event updated successfully!");
      setShowEditModal(false);
      setEditingEvent(null);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await eventApi.deleteEvent(eventId);
        toast.success("Event deleted successfully!");
        fetchData();
      } catch {
        toast.error("Failed to delete event");
      }
    }
  };

  const handleUnsaveEvent = async (eventId) => {
    try {
      await savedEventApi.unsaveEvent(eventId);
      toast.success("Event removed from saved list");
      fetchData();
    } catch {
      toast.error("Failed to remove event");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardStagger = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut", delay: i * 0.05 },
    }),
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="card bg-base-100 shadow-xl mb-8"
        >
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="avatar placeholder">
                <div className="bg-linear-to-br from-primary to-secondary text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-base-content/70 mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="stat bg-primary/10 rounded-lg p-4">
                    <div className="stat-figure text-primary">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="stat-value text-primary">
                      {stats.upcomingCount || stats.createdCount}
                    </div>
                    <div className="stat-title">Upcoming Events</div>
                  </div>
                  {stats.pastCount > 0 && (
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-figure text-error">
                        <CalendarX2 className="w-8 h-8" />
                      </div>
                      <div className="stat-value text-base-content/70">
                        {stats.pastCount}
                      </div>
                      <div className="stat-title">Past Events</div>
                    </div>
                  )}
                  <div className="stat bg-secondary/20 rounded-lg p-4 border border-secondary/30">
                    <div className="stat-figure text-secondary-content">
                      <Bookmark className="w-8 h-8" />
                    </div>
                    <div className="stat-value text-secondary-content">
                      {stats.savedCount}
                    </div>
                    <div className="stat-title text-secondary-content/80">
                      Events Saved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 bg-base-100 p-1">
          <button
            className={`tab ${activeTab === "created" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("created")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            My Events
          </button>
          <button
            className={`tab ${activeTab === "saved" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Events
          </button>
        </div>

        {/* My Events Tab */}
        {activeTab === "created" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Events</h2>
                {myEvents.past.length > 0 && (
                  <div className="form-control mt-2">
                    <label className="label cursor-pointer gap-2 justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={showPastEvents}
                        onChange={(e) => setShowPastEvents(e.target.checked)}
                      />
                      <span className="label-text">
                        Show past events ({myEvents.past.length})
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-secondary gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            </div>

            {myEvents.upcoming.length === 0 && myEvents.past.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-base-content/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No events yet</h3>
                <p className="text-base-content/70 mb-4">
                  Create your first event to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create Event
                </button>
              </div>
            ) : (
              <>
                {/* Upcoming Events */}
                {myEvents.upcoming.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      Upcoming Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myEvents.upcoming.map((event, index) => (
                        <motion.div
                          key={event._id}
                          variants={cardStagger}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          custom={index}
                        >
                          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all h-full">
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-3">
                                <div className="badge badge-primary">
                                  {event.category}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditClick(event)}
                                    className="btn btn-ghost btn-sm btn-square"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="btn btn-ghost btn-sm btn-square text-error"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <h3 className="card-title text-lg line-clamp-2">
                                {event.name}
                              </h3>
                              <p className="text-amber-100 text-sm line-clamp-2 mb-4">
                                {event.description}
                              </p>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="line-clamp-1">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="card-actions">
                                <button
                                  onClick={() =>
                                    navigate(`/events/${event._id}`)
                                  }
                                  className="btn btn-sm btn-outline w-full"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Events */}
                {showPastEvents && myEvents.past.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-base-content/60">
                      Past Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                      {myEvents.past.map((event, index) => (
                        <motion.div
                          key={event._id}
                          variants={cardStagger}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          custom={index}
                        >
                          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all h-full">
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-3">
                                <div className="badge badge-ghost">
                                  {event.category}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="btn btn-ghost btn-sm btn-square text-error"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <h3 className="card-title text-lg line-clamp-2">
                                {event.name}
                              </h3>
                              <p className="text-amber-100 text-sm line-clamp-2 mb-4">
                                {event.description}
                              </p>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <CalendarX2 className="w-4 h-4 text-error" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="line-clamp-1">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="card-actions">
                                <button
                                  onClick={() =>
                                    navigate(`/events/${event._id}`)
                                  }
                                  className="btn btn-sm btn-outline w-full"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Saved Events Tab */}
        {activeTab === "saved" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Saved Events</h2>
                {savedEvents.past.length > 0 && (
                  <div className="form-control mt-2">
                    <label className="label cursor-pointer gap-2 justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={showPastEvents}
                        onChange={(e) => setShowPastEvents(e.target.checked)}
                      />
                      <span className="label-text">
                        Show past events ({savedEvents.past.length})
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {savedEvents.upcoming.length === 0 &&
            savedEvents.past.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="mx-auto h-16 w-16 text-base-content/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No saved events</h3>
                <p className="text-base-content/70 mb-4">
                  Browse events and save your favorites
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="btn btn-primary"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <>
                {/* Upcoming Saved Events */}
                {savedEvents.upcoming.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      Upcoming Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedEvents.upcoming.map((saved, index) => (
                        <motion.div
                          key={saved._id}
                          variants={cardStagger}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          custom={index}
                        >
                          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all h-full">
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-3">
                                <div className="badge badge-primary">
                                  {saved.event.category}
                                </div>
                                <button
                                  onClick={() =>
                                    handleUnsaveEvent(saved.event._id)
                                  }
                                  className="btn btn-ghost btn-sm btn-square text-error"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <h3 className="card-title text-lg line-clamp-2">
                                {saved.event.name}
                              </h3>
                              <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
                                {saved.event.description}
                              </p>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>{formatDate(saved.event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>{saved.event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="line-clamp-1">
                                    {saved.event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="card-actions">
                                <button
                                  onClick={() =>
                                    navigate(`/events/${saved.event._id}`)
                                  }
                                  className="btn btn-sm btn-outline w-full"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Saved Events */}
                {showPastEvents && savedEvents.past.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-base-content/60">
                      Past Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                      {savedEvents.past.map((saved, index) => (
                        <motion.div
                          key={saved._id}
                          variants={cardStagger}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          custom={index}
                        >
                          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all h-full">
                            <div className="card-body">
                              <div className="flex justify-between items-start mb-3">
                                <div className="badge badge-ghost">
                                  {saved.event.category}
                                </div>
                                <button
                                  onClick={() =>
                                    handleUnsaveEvent(saved.event._id)
                                  }
                                  className="btn btn-ghost btn-sm btn-square text-error"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <h3 className="card-title text-lg line-clamp-2">
                                {saved.event.name}
                              </h3>
                              <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
                                {saved.event.description}
                              </p>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <CalendarX2 className="w-4 h-4 text-error" />
                                  <span>{formatDate(saved.event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>{saved.event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="line-clamp-1">
                                    {saved.event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="card-actions">
                                <button
                                  onClick={() =>
                                    navigate(`/events/${saved.event._id}`)
                                  }
                                  className="btn btn-sm btn-outline w-full"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-2xl mb-4">Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-32"
                    required
                    maxLength={1000}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-2xl mb-4">Edit Event</h3>
              <form onSubmit={handleUpdateEvent} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-32"
                    required
                    maxLength={1000}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
