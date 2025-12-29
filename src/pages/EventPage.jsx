import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  X,
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

const EventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const categories = [
    "Music",
    "Sports",
    "Arts",
    "Technology",
    "Business",
    "Food",
    "Health",
    "Education",
    "Lifestyle",
    "Environment",
    "Entertainment",
    "Other",
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardStagger = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: i * 0.05 },
    }),
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;

      const response = await eventApi.getAllEvents(params);

      setEvents(response.data);
      setTotalPages(response.pages);
      setTotalEvents(response.total);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch events");
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedLocation]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Discover Events</h1>
          <p className="text-lg text-base-content/70">
            Browse through {totalEvents} amazing events happening around you
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="card bg-base-100 shadow-xl mb-8"
        >
          <div className="card-body">
            <h2 className="card-title mb-4">
              <Filter className="w-5 h-5" />
              Filter Events
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search Events</span>
                </label>
                <div className="join w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by event name..."
                    className="input input-bordered join-item flex-1"
                  />
                  <button type="submit" className="btn btn-primary join-item">
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>

              {/* Category and Location Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Filter by Category</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="select select-bordered w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Filter by Location</span>
                  </label>
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    placeholder="Enter city or location..."
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || selectedCategory || selectedLocation) && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn btn-ghost gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Active Filters Display */}
        {(selectedCategory || selectedLocation) && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-6 flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm font-medium">Active filters:</span>
            {selectedCategory && (
              <div className="badge badge-primary badge-lg gap-2">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedLocation && (
              <div className="badge badge-secondary badge-lg gap-2">
                {selectedLocation}
                <button onClick={() => setSelectedLocation("")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Error State */}
        {error && (
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
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-base-content/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No events found</h3>
                <p className="text-base-content/70">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  {events.map((event, index) => {
                    const CategoryIcon = categoryIcons[event.category] || Grid;
                    return (
                      <motion.div
                        key={event._id}
                        variants={cardStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        custom={index}
                      >
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full">
                          <div className="card-body">
                            {/* Category Badge */}
                            <div className="mb-3">
                              <div className="badge badge-primary gap-2">
                                <CategoryIcon className="w-3 h-3" />
                                {event.category}
                              </div>
                            </div>

                            {/* Event Name */}
                            <h3 className="card-title text-xl mb-2 line-clamp-2">
                              {event.name}
                            </h3>

                            {/* Description */}
                            <p className="text-amber-100 text-sm mb-4 line-clamp-3">
                              {event.description}
                            </p>

                            {/* Event Details */}
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

                            {/* View Details Button */}
                            <div className="card-actions">
                              <button
                                onClick={() => navigate(`/events/${event._id}`)}
                                className="btn btn-soft btn-success w-full"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="join">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="join-item btn"
                      >
                        «
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`join-item btn ${
                                currentPage === page ? "btn-active" : ""
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <button
                              key={page}
                              className="join-item btn btn-disabled"
                            >
                              ...
                            </button>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="join-item btn"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventPage;
