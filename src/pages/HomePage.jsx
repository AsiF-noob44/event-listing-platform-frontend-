import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
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

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, categoriesRes] = await Promise.all([
        eventApi.getAllEvents({ limit: 6 }),
        eventApi.getCategories(),
      ]);

      if (eventsRes.success) {
        setUpcomingEvents(eventsRes.data);
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1">
      {/* Banner Section */}
      <section className="relative h-96 md:h-screen overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Events Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Find and join the best events happening around you
              </p>
              <Link to="/events" className="btn btn-primary btn-lg gap-2">
                Explore Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Event Categories</h2>
            <p className="text-lg text-base-content/70">
              We offer a wide variety of event categories
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.map((category, index) => {
                const Icon = categoryIcons[category] || Grid;
                const row = Math.floor(index / 6);
                const isEvenRow = row % 2 === 0;

                return (
                  <motion.div
                    key={category}
                    initial={{ x: isEvenRow ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: (index % 6) * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 2,
                    }}
                    className="card bg-base-200"
                  >
                    <div className="card-body items-center text-center p-6">
                      <Icon className="w-10 h-10 text-primary mb-2" />
                      <h3 className="font-semibold text-sm">{category}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2">
                A Few of Our Upcoming Events
              </h2>
              <p className="text-lg text-base-content/70">
                Don't miss out on these exciting events
              </p>
            </div>
            <Link to="/events" className="btn btn-outline gap-2">
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-base-content/70">
                No upcoming events at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => {
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
                    <Link
                      to={`/events/${event._id}`}
                      className="card bg-base-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="card-body">
                        <div className="flex items-start justify-between mb-3">
                          <div className="badge badge-primary gap-2">
                            <CategoryIcon className="w-3 h-3" />
                            {event.category}
                          </div>
                        </div>

                        <h3 className="card-title text-xl mb-3 line-clamp-2">
                          {event.name}
                        </h3>

                        <p className="text-amber-100 line-clamp-2 mb-4">
                          {event.description}
                        </p>

                        <div className="space-y-2">
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
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
