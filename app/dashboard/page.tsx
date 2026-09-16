"use client";

import { useState } from "react";
import DashboardNav from "../dashboard/DashboardNav";

interface Attraction {
  id: number;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  price: number | null;
  duration: string;
  maxCapacity: number;
  img: string;
  badge: string;
  type: "paid" | "free";
  highlights: string[];
}

const attractions: Attraction[] = [
  // PAID ATTRACTIONS
  {
    id: 1,
    name: "Mirage Walk",
    tagline: "An Illusion of Infinite Space",
    description:
      "The Mirage Walk is a captivating optical experience where reflective panels and carefully positioned mirrors create a dazzling illusion of endless pathways stretching into infinity.",
    fullDescription:
      "The Mirage Walk is a captivating optical experience where reflective panels and carefully positioned mirrors create a dazzling illusion of endless pathways stretching into infinity. As you walk through, the boundaries between the physical world and the horizon blur, creating an ethereal, almost dreamlike passage. A truly unique attraction that merges art, science, and the spiritual wonder of Monte Maria. This interactive installation was designed by renowned artists and features state-of-the-art mirror technology that creates breathtaking visual effects. Perfect for photography enthusiasts and families alike.",
    price: 150,
    duration: "30-45 minutes",
    maxCapacity: 20,
    img: "p1.jpg",
    badge: "New Experience",
    type: "paid",
    highlights: [
      "Stunning visual illusions",
      "Perfect for photography",
      "Suitable for all ages",
      "Unique art installation",
    ],
  },
  {
    id: 2,
    name: "View Deck",
    tagline: "The World Beneath Your Feet",
    description:
      "Standing on the View Deck feels like being suspended between heaven and earth. At the highest accessible point of Monte Maria, this open-air platform rewards visitors with a 180-degree panoramic view.",
    fullDescription:
      "Standing on the View Deck feels like being suspended between heaven and earth. At the highest accessible point of Monte Maria, this open-air platform rewards visitors with a 180-degree panoramic view of the West Philippine Sea and the lush Batangas landscape. Whether at sunrise, golden hour, or dusk, the view is always breathtaking — a powerful reminder of God's magnificent creation. On clear days, you can see neighboring islands and coastal towns stretching to the horizon. The deck features safety railings, seating areas, and designated photo spots for the perfect souvenir shot.",
    price: 100,
    duration: "45-60 minutes",
    maxCapacity: 50,
    img: "p5.jpg",
    badge: "Most Popular",
    type: "paid",
    highlights: [
      "360° panoramic view",
      "Best at sunrise & sunset",
      "Accessible platform",
      "Photo opportunity spot",
    ],
  },
  {
    id: 3,
    name: "Glass Walk",
    tagline: "Walk on Air, Feel the Thrill",
    description:
      "For those seeking both adventure and awe, the Glass Walk delivers an unforgettable experience. This transparent walkway extends over the mountain's edge with a clear glass floor.",
    fullDescription:
      "For those seeking both adventure and awe, the Glass Walk delivers an unforgettable experience. This transparent walkway extends over the mountain's edge, with a clear glass floor that lets you see hundreds of feet straight down to the forest and rocky cliffs below. It's both thrilling and humbling — a reminder of how small we are in God's vast creation, and how faith allows us to walk boldly forward. The glass panels are made of reinforced safety glass designed to support significant weight while providing crystal-clear views. Not recommended for those with fear of heights!",
    price: 200,
    duration: "20-30 minutes",
    maxCapacity: 15,
    img: "p11.jpg",
    badge: "Adventure Pick",
    type: "paid",
    highlights: [
      "Crystal-clear glass floor",
      "200+ feet elevation",
      "Heart-pounding thrills",
      "Breathtaking cliff views",
    ],
  },
  {
    id: 4,
    name: "Mirror Walk",
    tagline: "Reflections of Faith",
    description:
      "An immersive corridor lined with mirrors that reflect natural light and create stunning visual patterns, encouraging self-reflection and meditation.",
    fullDescription:
      "An immersive corridor lined with mirrors that reflect natural light and create stunning visual patterns, encouraging self-reflection and meditation. The Mirror Walk combines modern design with spiritual symbolism, offering visitors a unique space for contemplation. As sunlight filters through carefully positioned openings, it creates ever-changing patterns of light and shadow that dance across the mirrored surfaces. This attraction symbolizes the journey of self-discovery and spiritual awakening. Visitors often describe feeling a profound sense of peace and clarity while walking through this mesmerizing space.",
    price: 120,
    duration: "25-35 minutes",
    maxCapacity: 25,
    img: "p2.jpg",
    badge: "Peaceful",
    type: "paid",
    highlights: [
      "Meditative atmosphere",
      "Natural light effects",
      "Photo-friendly design",
      "Spiritual symbolism",
    ],
  },

  // FREE ATTRACTIONS
  {
    id: 5,
    name: "Gate of the Archangels",
    tagline: "Heavenly Guardians",
    description:
      "A magnificent entrance arch adorned with sculptures of the Archangels Michael, Gabriel, and Raphael, marking the sacred threshold into Monte Maria.",
    fullDescription:
      "A magnificent entrance arch adorned with sculptures of the Archangels Michael, Gabriel, and Raphael, the Gate of the Archangels marks the sacred threshold into the heart of Monte Maria. It serves as a powerful reminder of heavenly protection and the divine guardianship that accompanies every pilgrim on their journey. The gate was blessed by local church leaders and stands as a symbol of faith and protection. Each archangel is depicted in intricate detail, holding their traditional symbols - Michael with his sword, Gabriel with a lily, and Raphael with a staff. The archway features beautiful carvings of biblical scenes and inspirational quotes.",
    price: null,
    duration: "15-20 minutes",
    maxCapacity: 60,
    img: "gate.jpg",
    badge: "Sacred Entrance",
    type: "free",
    highlights: [
      "Stunning architecture",
      "Religious significance",
      "Perfect photo spot",
      "Blessed by clergy",
    ],
  },
  {
    id: 6,
    name: "Sto. Niño Chapel",
    tagline: "Chapel of the Holy Child",
    description:
      "A beautifully ornate chapel dedicated to the Holy Child Jesus, beloved by families and children seeking blessings and intercession.",
    fullDescription:
      "The Sto. Niño Chapel is a small but beautifully ornate chapel dedicated to the Holy Child Jesus. Nestled within the mountain grounds, it is a place of quiet prayer and intimate devotion, beloved by families and children who come to seek the intercession of the Child Jesus for their daily needs and blessings. The chapel features a stunning altar with a centuries-old statue of Sto. Niño brought from Spain, colorful stained glass windows depicting the life of Jesus, and pews hand-carved by local artisans. Daily masses are held at 6 AM and 5 PM.",
    price: null,
    duration: "30-45 minutes",
    maxCapacity: 40,
    img: "sto.nino.jpg",
    badge: "Family Favorite",
    type: "free",
    highlights: [
      "Daily mass schedule",
      "Historic Sto. Niño statue",
      "Stained glass windows",
      "Peaceful prayer space",
    ],
  },
  {
    id: 7,
    name: "Retreat Facility",
    tagline: "Sanctuary for Renewal",
    description:
      "A peaceful and well-equipped space for recollection, seminars, and renewal programs, perfect for spiritual groups and communities.",
    fullDescription:
      "Ideal for spiritual groups, schools, and religious communities, the Retreat Facility at Monte Maria provides a peaceful and well-equipped space for recollection, seminars, and renewal programs. Surrounded by nature and sacred imagery, it creates the perfect environment for deep prayer, community building, and spiritual growth. The facility includes air-conditioned conference rooms, dormitory-style accommodations, a dining hall serving wholesome meals, and outdoor meditation gardens. Group bookings are available for retreats, team-building activities, and educational programs.",
    price: null,
    duration: "Flexible (by booking)",
    maxCapacity: 80,
    img: "p2.jpg",
    badge: "Group Friendly",
    type: "free",
    highlights: [
      "Conference rooms",
      "Accommodation available",
      "Dining facilities",
      "Meditation gardens",
    ],
  },
  {
    id: 8,
    name: "St. John Paul II Chapel",
    tagline: "Honoring a Beloved Pope",
    description:
      "Dedicated to Pope Saint John Paul II, this chapel honors his historic visit to the Philippines and his enduring legacy of faith, hope, and love.",
    fullDescription:
      "Dedicated to the beloved Pope Saint John Paul II, this chapel honors his historic visit to the Philippines and his enduring legacy of faith. Visitors come here to pray before his image, reflect on his teachings, and draw inspiration from his message of hope, love, and the dignity of every human person. The chapel features a life-size statue of the late pope, quotes from his most famous homilies displayed on the walls, and a small museum showcasing photographs from his Philippine visits. A gift shop nearby sells rosaries, medals, and books about his life and teachings.",
    price: null,
    duration: "30-40 minutes",
    maxCapacity: 70,
    img: "p10.jpg",
    badge: "Inspirational",
    type: "free",
    highlights: [
      "Life-size Pope statue",
      "Museum exhibit",
      "Gift shop",
      "Historic significance",
    ],
  },
];

export default function DashboardPage() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all");

  const generateAccessCode = () => {
    const code = `MM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    return code;
  };

  const handleViewDetails = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setGeneratedCode(null);
  };

  const handleGenerateCode = () => {
    const code = generateAccessCode();
    setGeneratedCode(code);
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", {
      attraction: selectedAttraction?.name,
      date: bookingDate,
      time: bookingTime,
      people: numPeople,
      total: selectedAttraction?.price ? selectedAttraction.price * numPeople : 0,
    });
    // Simulate payment success
    alert("Payment successful! Your booking is confirmed.");
    const code = generateAccessCode();
    setGeneratedCode(code);
    setShowBookingModal(false);
    setBookingDate("");
    setBookingTime("");
    setNumPeople(1);
  };

  const filteredAttractions = attractions.filter((attraction) => {
    if (filter === "all") return true;
    return attraction.type === filter;
  });

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Monte Maria <span className="text-brand-red italic">Attractions</span>
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Explore our sacred sites and unforgettable experiences
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-brand-red text-white bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-brand-red"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              All Attractions
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "paid"
                  ? "bg-brand-red text-white bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-brand-red"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Paid Attractions
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === "free"
                  ? "bg-brand-red text-white bg-gray-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-brand-red"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Free Attractions
            </button>
          </div>

          {/* Attractions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleViewDetails(attraction)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={attraction.img}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-brand-red text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {attraction.badge}
                  </div>
                  {/* Type Badge */}
                  <div
                    className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-medium ${
                      attraction.type === "paid" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  >
                    {attraction.type === "paid" ? `₱${attraction.price}` : "FREE"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="text-lg font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {attraction.name}
                  </h3>
                  <p
                    className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {attraction.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⏱ {attraction.duration}</span>
                    <span>👥 {attraction.maxCapacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attraction Details Modal */}
      {selectedAttraction && !showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedAttraction(null);
                setGeneratedCode(null);
              }}
              className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 text-3xl z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            >
              ×
            </button>

            {/* Image */}
            <div className="relative h-72 overflow-hidden rounded-t-2xl">
              <img
                src={selectedAttraction.img}
                alt={selectedAttraction.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-brand-red text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {selectedAttraction.badge}
                  </span>
                  <span
                    className={`text-white text-xs px-3 py-1.5 rounded-full font-medium ${
                      selectedAttraction.type === "paid" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  >
                    {selectedAttraction.type === "paid" ? `₱${selectedAttraction.price}` : "FREE"}
                  </span>
                </div>
                <h2
                  className="text-4xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedAttraction.name}
                </h2>
                <p
                  className="text-white/80 text-sm mt-2"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {selectedAttraction.tagline}
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* Full Description */}
              <div className="mb-6">
                <h3
                  className="text-xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About This Attraction
                </h3>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {selectedAttraction.fullDescription}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3
                  className="text-xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedAttraction.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-gray-700 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAttraction.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Max Capacity</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAttraction.maxCapacity} people</p>
                </div>
              </div>

              {/* Access Code Display */}
              {generatedCode && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6">
                  <h3
                    className="text-lg font-bold text-green-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    ✓ Your Access Code
                  </h3>
                  <p
                    className="text-green-700 text-sm mb-3"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Use this code for entrance and exit:
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p
                      className="text-3xl font-bold text-center text-gray-700 tracking-wider"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {generatedCode}
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-3 text-center">
                    Screenshot or write down this code. Valid for today's visit.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!generatedCode && (
                <div className="flex gap-3">
                  {selectedAttraction.type === "free" ? (
                    <button
                      onClick={handleGenerateCode}
                      className="flex-1 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Generate Access Code
                    </button>
                  ) : (
                    <button
                      onClick={handleBookNow}
                      className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium  transition-all"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Book Now - ₱{selectedAttraction.price}
                    </button>
                  )}
                  
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedAttraction && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Book {selectedAttraction.name}
            </h2>
            <p
              className="text-gray-500 text-sm mb-6"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Select your preferred date and time
            </p>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                >
                  <option value="">Select time</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                <input
                  type="number"
                  value={numPeople}
                  onChange={(e) => setNumPeople(parseInt(e.target.value))}
                  required
                  min="1"
                  max={selectedAttraction.maxCapacity}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">Price per person</span>
                  <span className="text-gray-600 font-medium">₱{selectedAttraction.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-gray-900 text-xl font-bold">
                    ₱{selectedAttraction.price ? selectedAttraction.price * numPeople : 0}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all mt-6"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}