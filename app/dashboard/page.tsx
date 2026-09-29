"use client";



import { useState } from "react";

import DashboardNav from "../dashboard/DashboardNav";



interface TimeSlot {

  time: string;

  label: string;

  reserved: number;

}



interface Attraction {

  id: number;

  name: string;

  tagline: string;

  description: string;

  fullDescription: string;

  price: number | null;

  duration: string;



  currentVisitors: number;

  maxCapacity: number;



  timeSlots: TimeSlot[];



  img: string;

  badge: string;

  type: "paid" | "free";

  highlights: string[];

}



const attractions: Attraction[] = [

  // =====================================================

  // PAID ATTRACTIONS

  // =====================================================



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



    currentVisitors: 12,

    maxCapacity: 20,



    timeSlots: [

      { time: "08:00", label: "8:00 AM", reserved: 8 },

      { time: "10:00", label: "10:00 AM", reserved: 14 },

      { time: "12:00", label: "12:00 PM", reserved: 19 },

      { time: "14:00", label: "2:00 PM", reserved: 15 },

      { time: "16:00", label: "4:00 PM", reserved: 20 },

    ],



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



    currentVisitors: 32,

    maxCapacity: 50,



    timeSlots: [

      { time: "08:00", label: "8:00 AM", reserved: 22 },

      { time: "10:00", label: "10:00 AM", reserved: 31 },

      { time: "12:00", label: "12:00 PM", reserved: 40 },

      { time: "14:00", label: "2:00 PM", reserved: 35 },

      { time: "16:00", label: "4:00 PM", reserved: 48 },

    ],



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



    currentVisitors: 11,

    maxCapacity: 15,



    timeSlots: [

      { time: "08:00", label: "8:00 AM", reserved: 5 },

      { time: "10:00", label: "10:00 AM", reserved: 9 },

      { time: "12:00", label: "12:00 PM", reserved: 12 },

      { time: "14:00", label: "2:00 PM", reserved: 14 },

      { time: "16:00", label: "4:00 PM", reserved: 15 },

    ],



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



    currentVisitors: 8,

    maxCapacity: 25,



    timeSlots: [

      { time: "08:00", label: "8:00 AM", reserved: 7 },

      { time: "10:00", label: "10:00 AM", reserved: 12 },

      { time: "12:00", label: "12:00 PM", reserved: 18 },

      { time: "14:00", label: "2:00 PM", reserved: 16 },

      { time: "16:00", label: "4:00 PM", reserved: 21 },

    ],



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



  // =====================================================

  // FREE ATTRACTIONS

  // =====================================================



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



    currentVisitors: 27,

    maxCapacity: 60,



    timeSlots: [],



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



    currentVisitors: 18,

    maxCapacity: 40,



    timeSlots: [],



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



    currentVisitors: 21,

    maxCapacity: 80,



    timeSlots: [],



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



    currentVisitors: 46,

    maxCapacity: 70,



    timeSlots: [],



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

  const [selectedAttraction, setSelectedAttraction] =

    useState<Attraction | null>(null);



  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<"gcash" | "maya" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [bookingDate, setBookingDate] = useState("");

  const [bookingTime, setBookingTime] = useState("");

  const [numPeople, setNumPeople] = useState(1);

  const [generatedCode, setGeneratedCode] =

    useState<string | null>(null);



  const [filter, setFilter] =

    useState<"all" | "paid" | "free">("all");



  // =====================================================

  // HELPERS

  // =====================================================



  const generateAccessCode = () => {

    return `MM-${Math.random()

      .toString(36)

      .substring(2, 8)

      .toUpperCase()}-${Date.now().toString().slice(-4)}`;

  };



  const getAvailableNow = (attraction: Attraction) => {

    return Math.max(

      attraction.maxCapacity - attraction.currentVisitors,

      0

    );

  };



  const getOccupancyPercentage = (attraction: Attraction) => {

    if (attraction.maxCapacity === 0) {

      return 0;

    }



    return Math.min(

      Math.round(

        (attraction.currentVisitors / attraction.maxCapacity) * 100

      ),

      100

    );

  };



  const getCrowdStatus = (attraction: Attraction) => {

    const percentage = getOccupancyPercentage(attraction);



    if (attraction.currentVisitors >= attraction.maxCapacity) {

      return "Full";

    }



    if (percentage >= 80) {

      return "Almost Full";

    }



    return "Available";

  };



  const selectedSlot =

    selectedAttraction && bookingTime

      ? selectedAttraction.timeSlots.find(

          (slot) => slot.time === bookingTime

        ) ?? null

      : null;



  const remainingReservationSlots =

    selectedAttraction && selectedSlot

      ? Math.max(

          selectedAttraction.maxCapacity - selectedSlot.reserved,

          0

        )

      : 0;



  // =====================================================

  // ACTIONS

  // =====================================================



  const handleViewDetails = (attraction: Attraction) => {

    setSelectedAttraction(attraction);

    setGeneratedCode(null);

    setBookingDate("");

    setBookingTime("");

    setNumPeople(1);

  };



  const handleCloseDetails = () => {

    setSelectedAttraction(null);

    setGeneratedCode(null);

    setShowBookingModal(false);

    setBookingDate("");

    setBookingTime("");

    setNumPeople(1);

  };



  const handleGenerateCode = () => {

    setGeneratedCode(generateAccessCode());

  };



  const handleBookNow = () => {

    setBookingDate("");

    setBookingTime("");

    setNumPeople(1);

    setShowBookingModal(true);

  };



  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAttraction) return;

    if (!bookingDate || !selectedSlot) {
      alert("Please select a date and time.");
      return;
    }

    if (numPeople < 1 || numPeople > remainingReservationSlots) {
      alert(
        `Only ${remainingReservationSlots} reservation slot(s) are available for ${selectedSlot.label}.`
      );
      return;
    }

    setSelectedPaymentMethod(null);
    setPaymentSuccess(false);
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedAttraction || !selectedSlot || !selectedPaymentMethod) return;

    const code = generateAccessCode();
    setGeneratedCode(code);
    setPaymentSuccess(true);
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
    setPaymentSuccess(false);
  };

  const filteredAttractions = attractions.filter(

    (attraction) => {

      if (filter === "all") {

        return true;

      }



      return attraction.type === filter;

    }

  );



  return (

    <>

      <DashboardNav />



      {/* =====================================================

          MAIN DASHBOARD

      ====================================================== */}



      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">

        <div className="max-w-7xl mx-auto">



          {/* Header */}

          <div className="mb-8">

            <h1

              className="text-4xl font-bold text-gray-900 mb-3"

              style={{

                fontFamily: "'Playfair Display', serif",

              }}

            >

              Monte Maria{" "}

              <span className="text-brand-red italic">

                Attractions

              </span>

            </h1>



            <p

              className="text-gray-600 text-lg"

              style={{

                fontFamily: "'Lato', sans-serif",

              }}

            >

              Explore our sacred sites and unforgettable experiences

            </p>

          </div>



          {/* Filters */}

          <div className="flex flex-wrap gap-3 mb-8">

            <button

              type="button"

              onClick={() => setFilter("all")}

              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${

                filter === "all"

                  ? "bg-gray-800 text-white"

                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"

              }`}

            >

              All Attractions

            </button>



            <button

              type="button"

              onClick={() => setFilter("paid")}

              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${

                filter === "paid"

                  ? "bg-gray-800 text-white"

                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"

              }`}

            >

              Paid Attractions

            </button>



            <button

              type="button"

              onClick={() => setFilter("free")}

              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${

                filter === "free"

                  ? "bg-gray-800 text-white"

                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"

              }`}

            >

              Free Attractions

            </button>

          </div>



          {/* =====================================================

              ATTRACTION CARDS

          ====================================================== */}



          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredAttractions.map((attraction) => {

              const percentage =

                getOccupancyPercentage(attraction);



              const available =

                getAvailableNow(attraction);



              return (

                <article

                  key={attraction.id}

                  onClick={() =>

                    handleViewDetails(attraction)

                  }

                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"

                >

                  {/* Image */}

                  <div className="relative h-48 overflow-hidden">

                    <img

                      src={attraction.img}

                      alt={attraction.name}

                      className="block w-full h-full object-cover transition-transform duration-500 hover:scale-105"

                    />



                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />



                    <span className="absolute top-3 left-3 bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full font-medium">

                      {attraction.badge}

                    </span>



                    <span

                      className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-medium ${

                        attraction.type === "paid"

                          ? "bg-orange-500"

                          : "bg-green-600"

                      }`}

                    >

                      {attraction.type === "paid"

                        ? `₱${attraction.price}`

                        : "FREE"}

                    </span>

                  </div>



                  {/* Content */}

                  <div className="p-5">

                    <h3

                      className="text-lg font-bold text-gray-900 mb-2"

                      style={{

                        fontFamily:

                          "'Playfair Display', serif",

                      }}

                    >

                      {attraction.name}

                    </h3>



                    <p

                      className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4"

                      style={{

                        fontFamily: "'Lato', sans-serif",

                      }}

                    >

                      {attraction.description}

                    </p>



                    {/* Live count */}

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-xs text-gray-500">

                        Currently Inside

                      </span>



                      <span

                        className={`text-xs font-bold ${

                          attraction.currentVisitors >=

                          attraction.maxCapacity

                            ? "text-red-600"

                            : "text-gray-700"

                        }`}

                      >

                        {attraction.currentVisitors} /{" "}

                        {attraction.maxCapacity}

                      </span>

                    </div>



                    {/* Small occupancy bar */}

                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">

                      <div

                        className={`h-full rounded-full ${

                          percentage >= 100

                            ? "bg-red-600"

                            : percentage >= 80

                            ? "bg-orange-500"

                            : "bg-green-600"

                        }`}

                        style={{

                          width: `${percentage}%`,

                        }}

                      />

                    </div>



                    <div className="flex items-center justify-between text-xs text-gray-500">

                      <span>

                        ⏱ {attraction.duration}

                      </span>



                      <span>

                        {available > 0

                          ? `${available} available`

                          : "Full"}

                      </span>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        </div>

      </main>



      {/* =====================================================

          ATTRACTION DETAILS MODAL

      ====================================================== */}



      {selectedAttraction && !showBookingModal && (

        <div

          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-hidden"

          onClick={handleCloseDetails}

        >

          <div

            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto"

            onClick={(e) => e.stopPropagation()}

          >

            {/* =================================================

                FULL-WIDTH HERO

            ================================================== */}



            <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden">

              <img

                src={selectedAttraction.img}

                alt={selectedAttraction.name}

                className="absolute inset-0 block w-full h-full object-cover"

              />



              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />



              {/* Close */}

              <button

                type="button"

                onClick={handleCloseDetails}

                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white shadow-lg text-gray-500 hover:text-gray-900 hover:scale-105 flex items-center justify-center transition-all"

                aria-label="Close attraction details"

              >

                <span className="text-2xl leading-none">

                  ×

                </span>

              </button>



              {/* Hero Content */}

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

                <div className="flex items-center gap-2 mb-3">

                  <span className="bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full">

                    {selectedAttraction.badge}

                  </span>



                  <span

                    className={`text-white text-xs px-3 py-1.5 rounded-full ${

                      selectedAttraction.type === "paid"

                        ? "bg-orange-500"

                        : "bg-green-600"

                    }`}

                  >

                    {selectedAttraction.type === "paid"

                      ? `₱${selectedAttraction.price}`

                      : "FREE"}

                  </span>

                </div>



                <h2

                  className="text-3xl md:text-4xl font-bold text-white"

                  style={{

                    fontFamily:

                      "'Playfair Display', serif",

                  }}

                >

                  {selectedAttraction.name}

                </h2>



                <p

                  className="text-white/85 text-sm mt-2"

                  style={{

                    fontFamily: "'Lato', sans-serif",

                  }}

                >

                  {selectedAttraction.tagline}

                </p>

              </div>

            </div>



            {/* =================================================

                MODAL CONTENT

            ================================================== */}



            <div className="p-6 md:p-8">



              {/* About */}

              <section className="mb-7">

                <h3

                  className="text-xl font-bold text-gray-900 mb-3"

                  style={{

                    fontFamily:

                      "'Playfair Display', serif",

                  }}

                >

                  About This Attraction

                </h3>



                <p

                  className="text-gray-600 text-sm leading-7"

                  style={{

                    fontFamily: "'Lato', sans-serif",

                  }}

                >

                  {selectedAttraction.fullDescription}

                </p>

              </section>



              {/* Highlights */}

              <section className="mb-8">

                <h3

                  className="text-xl font-bold text-gray-900 mb-4"

                  style={{

                    fontFamily:

                      "'Playfair Display', serif",

                  }}

                >

                  Highlights

                </h3>



                <div className="grid sm:grid-cols-2 gap-3">

                  {selectedAttraction.highlights.map(

                    (highlight, index) => (

                      <div

                        key={index}

                        className="flex items-center gap-3 text-sm text-gray-700"

                      >

                        <span className="w-2 h-2 rounded-full bg-gray-700 flex-shrink-0" />



                        <span>{highlight}</span>

                      </div>

                    )

                  )}

                </div>

              </section>



              {/* =================================================

                  CROWD STATUS

              ================================================== */}



              <section className="mb-8">

                <div className="flex items-center justify-between gap-4 mb-4">

                  <div>

                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">

                      Crowd Status

                    </p>



                    <h3

                      className="text-xl font-bold text-gray-900"

                      style={{

                        fontFamily:

                          "'Playfair Display', serif",

                      }}

                    >

                      Live Attraction Occupancy

                    </h3>

                  </div>



                  <span

                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${

                      getCrowdStatus(

                        selectedAttraction

                      ) === "Full"

                        ? "bg-red-100 text-red-700"

                        : getCrowdStatus(

                            selectedAttraction

                          ) === "Almost Full"

                        ? "bg-orange-100 text-orange-700"

                        : "bg-green-100 text-green-700"

                    }`}

                  >

                    {getCrowdStatus(

                      selectedAttraction

                    )}

                  </span>

                </div>



                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">

                  {/* Max Capacity */}

                  <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">

                    <span className="text-sm text-gray-500">

                      Maximum Capacity

                    </span>



                    <span className="font-bold text-gray-900">

                      {

                        selectedAttraction.maxCapacity

                      }

                    </span>

                  </div>



                  {/* Currently Inside */}

                  <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">

                    <span className="text-sm text-gray-500">

                      Currently Inside

                    </span>



                    <span className="font-bold text-gray-900">

                      {

                        selectedAttraction.currentVisitors

                      }

                    </span>

                  </div>



                  {/* Available */}

                  <div className="flex justify-between items-center px-5 py-4">

                    <span className="text-sm text-gray-500">

                      Available Right Now

                    </span>



                    <span

                      className={`font-bold ${

                        getAvailableNow(

                          selectedAttraction

                        ) === 0

                          ? "text-red-600"

                          : "text-green-600"

                      }`}

                    >

                      {getAvailableNow(

                        selectedAttraction

                      )}

                    </span>

                  </div>

                </div>



                {/* Occupancy Progress */}

                <div className="mt-4">

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-xs text-gray-500">

                      Current occupancy

                    </span>



                    <span className="text-xs font-semibold text-gray-700">

                      {getOccupancyPercentage(

                        selectedAttraction

                      )}

                      %

                    </span>

                  </div>



                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">

                    <div

                      className={`h-full rounded-full transition-all duration-500 ${

                        getOccupancyPercentage(

                          selectedAttraction

                        ) >= 100

                          ? "bg-red-600"

                          : getOccupancyPercentage(

                              selectedAttraction

                            ) >= 80

                          ? "bg-orange-500"

                          : "bg-green-600"

                      }`}

                      style={{

                        width: `${getOccupancyPercentage(

                          selectedAttraction

                        )}%`,

                      }}

                    />

                  </div>

                </div>



                {/* Duration */}

                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">

                  <span className="text-sm text-gray-500">

                    Estimated Duration

                  </span>



                  <span className="text-sm font-semibold text-gray-900 text-right">

                    {

                      selectedAttraction.duration

                    }

                  </span>

                </div>

              </section>



              {/* Access Code */}

              {generatedCode && (

                <section className="bg-green-50 border border-green-300 rounded-2xl p-6 mb-6">

                  <h3

                    className="text-lg font-bold text-green-900 mb-2"

                    style={{

                      fontFamily:

                        "'Playfair Display', serif",

                    }}

                  >

                    ✓ Your Access Code

                  </h3>



                  <p className="text-green-700 text-sm mb-3">

                    Use this code for entrance and

                    exit:

                  </p>



                  <div className="bg-white rounded-xl p-4 border border-green-200">

                    <p

                      className="text-2xl md:text-3xl font-bold text-center text-gray-700 tracking-wider"

                      style={{

                        fontFamily:

                          "'Courier New', monospace",

                      }}

                    >

                      {generatedCode}

                    </p>

                  </div>



                  <p className="text-xs text-green-600 mt-3 text-center">

                    Screenshot or write down this

                    code. Valid for today's visit.

                  </p>

                </section>

              )}



              {/* Main Action */}

              {!generatedCode && (

                <>

                  {selectedAttraction.currentVisitors >=

                  selectedAttraction.maxCapacity ? (

                    <button

                      type="button"

                      disabled

                      className="w-full py-4 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed"

                    >

                      Attraction Currently Full

                    </button>

                  ) : selectedAttraction.type ===

                    "free" ? (

                    <button

                      type="button"

                      onClick={handleGenerateCode}

                      className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"

                    >

                      Generate Access Code

                    </button>

                  ) : (

                    <button

                      type="button"

                      onClick={handleBookNow}

                      className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"

                    >

                      Book Now • ₱

                      {selectedAttraction.price}

                    </button>

                  )}

                </>

              )}

            </div>

          </div>

        </div>

      )}



      {/* =====================================================

          BOOKING MODAL

      ====================================================== */}



      {showBookingModal && selectedAttraction && (

        <div

          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"

          onClick={() =>

            setShowBookingModal(false)

          }

        >

          <div

            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Close */}

            <button

              type="button"

              onClick={() =>

                setShowBookingModal(false)

              }

              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"

              aria-label="Close booking"

            >

              <span className="text-2xl leading-none">

                ×

              </span>

            </button>



            <div className="p-6 md:p-8">

              {/* Header */}

              <div className="pr-10 mb-6">

                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">

                  Attraction Booking

                </p>



                <h2

                  className="text-2xl font-bold text-gray-900 mb-2"

                  style={{

                    fontFamily:

                      "'Playfair Display', serif",

                  }}

                >

                  Book {selectedAttraction.name}

                </h2>



                <p className="text-gray-500 text-sm">

                  Select your preferred date,

                  available time, and number of

                  visitors.

                </p>

              </div>



              {/* Current Crowd Summary */}

              <div className="grid grid-cols-3 gap-2 mb-6">

                <div className="bg-gray-50 rounded-xl p-3 text-center">

                  <p className="text-[11px] text-gray-500 mb-1">

                    Capacity

                  </p>



                  <p className="font-bold text-gray-900">

                    {

                      selectedAttraction.maxCapacity

                    }

                  </p>

                </div>



                <div className="bg-gray-50 rounded-xl p-3 text-center">

                  <p className="text-[11px] text-gray-500 mb-1">

                    Inside Now

                  </p>



                  <p className="font-bold text-gray-900">

                    {

                      selectedAttraction.currentVisitors

                    }

                  </p>

                </div>



                <div className="bg-gray-50 rounded-xl p-3 text-center">

                  <p className="text-[11px] text-gray-500 mb-1">

                    Available

                  </p>



                  <p className="font-bold text-green-600">

                    {getAvailableNow(

                      selectedAttraction

                    )}

                  </p>

                </div>

              </div>



              <form

                onSubmit={handleSubmitBooking}

                className="space-y-5"

              >

                {/* Date */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Date

                  </label>



                  <input

                    type="date"

                    value={bookingDate}

                    onChange={(e) =>

                      setBookingDate(

                        e.target.value

                      )

                    }

                    required

                    min={

                      new Date()

                        .toISOString()

                        .split("T")[0]

                    }

                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"

                  />

                </div>



                {/* =============================================

                    TIME SLOT AVAILABILITY

                ============================================== */}



                <div>

                  <div className="flex items-center justify-between mb-3">

                    <label className="block text-sm font-medium text-gray-700">

                      Select Time

                    </label>



                    <span className="text-xs text-gray-400">

                      Reservations

                    </span>

                  </div>



                  <div className="space-y-2">

                    {selectedAttraction.timeSlots.map(

                      (slot) => {

                        const remaining =

                          Math.max(

                            selectedAttraction.maxCapacity -

                              slot.reserved,

                            0

                          );



                        const full =

                          remaining === 0;



                        const almostFull =

                          !full &&

                          slot.reserved /

                            selectedAttraction.maxCapacity >=

                            0.8;



                        const selected =

                          bookingTime ===

                          slot.time;



                        return (

                          <button

                            key={slot.time}

                            type="button"

                            disabled={full}

                            onClick={() => {

                              setBookingTime(

                                slot.time

                              );

                              setNumPeople(1);

                            }}

                            className={`w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-4 text-left transition-all ${

                              full

                                ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"

                                : selected

                                ? "bg-gray-800 border-gray-800 text-white"

                                : "bg-white border-gray-200 hover:border-gray-500"

                            }`}

                          >

                            <div>

                              <p className="font-semibold text-sm">

                                {slot.label}

                              </p>



                              <p

                                className={`text-[11px] mt-0.5 ${

                                  selected

                                    ? "text-white/70"

                                    : "text-gray-400"

                                }`}

                              >

                                {full

                                  ? "No slots available"

                                  : `${remaining} ${

                                      remaining ===

                                      1

                                        ? "slot"

                                        : "slots"

                                    } left`}

                              </p>

                            </div>



                            <div className="text-right">

                              <p

                                className={`text-sm font-bold ${

                                  full

                                    ? "text-red-600"

                                    : selected

                                    ? "text-white"

                                    : almostFull

                                    ? "text-orange-600"

                                    : "text-gray-700"

                                }`}

                              >

                                {

                                  slot.reserved

                                }{" "}

                                /{" "}

                                {

                                  selectedAttraction.maxCapacity

                                }

                              </p>



                              <p

                                className={`text-[10px] uppercase tracking-wide ${

                                  full

                                    ? "text-red-500"

                                    : selected

                                    ? "text-white/60"

                                    : almostFull

                                    ? "text-orange-500"

                                    : "text-green-600"

                                }`}

                              >

                                {full

                                  ? "Full"

                                  : almostFull

                                  ? "Almost Full"

                                  : "Available"}

                              </p>

                            </div>

                          </button>

                        );

                      }

                    )}

                  </div>

                </div>



                {/* Number of People */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Number of People

                  </label>



                  <input

                    type="number"

                    value={numPeople}

                    onChange={(e) => {

                      const value = Number(

                        e.target.value

                      );



                      if (

                        !Number.isNaN(value)

                      ) {

                        setNumPeople(value);

                      }

                    }}

                    required

                    min={1}

                    max={

                      selectedSlot

                        ? remainingReservationSlots

                        : 1

                    }

                    disabled={!selectedSlot}

                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"

                  />



                  {!selectedSlot ? (

                    <p className="text-xs text-gray-400 mt-2">

                      Select an available time

                      first.

                    </p>

                  ) : (

                    <p className="text-xs text-gray-500 mt-2">

                      {

                        remainingReservationSlots

                      }{" "}

                      reservation{" "}

                      {remainingReservationSlots ===

                      1

                        ? "slot"

                        : "slots"}{" "}

                      available for{" "}

                      {selectedSlot.label}.

                    </p>

                  )}

                </div>



                {/* =============================================

                    BOOKING SUMMARY

                ============================================== */}



                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">

                  {selectedSlot && (

                    <>

                      <div className="flex justify-between items-center mb-3">

                        <span className="text-gray-600 text-sm">

                          Selected Time

                        </span>



                        <span className="text-gray-900 font-medium">

                          {

                            selectedSlot.label

                          }

                        </span>

                      </div>



                      <div className="flex justify-between items-center mb-3">

                        <span className="text-gray-600 text-sm">

                          Reservations

                        </span>



                        <span className="text-gray-900 font-medium">

                          {

                            selectedSlot.reserved

                          }{" "}

                          /{" "}

                          {

                            selectedAttraction.maxCapacity

                          }

                        </span>

                      </div>

                    </>

                  )}



                  <div className="flex justify-between items-center mb-3">

                    <span className="text-gray-600 text-sm">

                      Price per person

                    </span>



                    <span className="text-gray-700 font-medium">

                      ₱

                      {

                        selectedAttraction.price

                      }

                    </span>

                  </div>



                  <div className="flex justify-between items-center mb-3">

                    <span className="text-gray-600 text-sm">

                      Number of visitors

                    </span>



                    <span className="text-gray-700 font-medium">

                      {numPeople}

                    </span>

                  </div>



                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">

                    <span className="text-gray-900 font-bold">

                      Total

                    </span>



                    <span className="text-gray-900 text-xl font-bold">

                      ₱

                      {selectedAttraction.price

                        ? selectedAttraction.price *

                          numPeople

                        : 0}

                    </span>

                  </div>

                </div>



                {/* Submit */}

                <button

                  type="submit"

                  disabled={

                    !bookingDate ||

                    !selectedSlot ||

                    remainingReservationSlots ===

                      0 ||

                    numPeople < 1 ||

                    numPeople >

                      remainingReservationSlots

                  }

                  className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"

                >

                  Proceed to Payment

                </button>

              </form>

            </div>

          </div>

        </div>

      )}

    
      {/* =====================================================
          PAYMENT MODAL
      ====================================================== */}

      {showPaymentModal && selectedAttraction && selectedSlot && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          onClick={handleClosePayment}
        >
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClosePayment}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
              aria-label="Close payment"
            >
              <span className="text-2xl leading-none">×</span>
            </button>

            {!paymentSuccess ? (
              <div className="p-6 md:p-8">
                <div className="pr-10 mb-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                    Secure Checkout
                  </p>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Complete Your Payment
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Review your booking and choose your preferred payment method.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Booking
                    </p>
                    <h3 className="font-bold text-gray-900">
                      {selectedAttraction.name}
                    </h3>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium text-gray-900">{bookingDate}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium text-gray-900">{selectedSlot.label}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500">Visitors</span>
                      <span className="font-medium text-gray-900">{numPeople}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("gcash")}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        selectedPaymentMethod === "gcash"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                        G
                      </div>
                      <p className="font-bold text-gray-900">GCash</p>
                      <p className="text-xs text-gray-500 mt-1">Pay using your GCash wallet</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("maya")}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        selectedPaymentMethod === "maya"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold mb-3">
                        M
                      </div>
                      <p className="font-bold text-gray-900">Maya</p>
                      <p className="text-xs text-gray-500 mt-1">Pay using your Maya wallet</p>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>

                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500">
                      ₱{selectedAttraction.price} × {numPeople}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₱{selectedAttraction.price ? selectedAttraction.price * numPeople : 0}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₱{selectedAttraction.price ? selectedAttraction.price * numPeople : 0}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!selectedPaymentMethod}
                  onClick={handleConfirmPayment}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {selectedPaymentMethod
                    ? `Pay ₱${selectedAttraction.price ? selectedAttraction.price * numPeople : 0} & Confirm Booking`
                    : "Select a Payment Method"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Demo payment interface for the capstone system.
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <span className="text-4xl text-green-600">✓</span>
                </div>

                <p className="text-xs uppercase tracking-[0.18em] text-green-600 mb-2">
                  Payment Successful
                </p>

                <h2
                  className="text-3xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Booking Confirmed
                </h2>

                <p className="text-gray-500 text-sm leading-6 mb-6">
                  Your payment for {selectedAttraction.name} has been recorded.
                  Keep your access code for entry.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Access Code
                  </p>
                  <p
                    className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wider"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    {generatedCode}
                  </p>
                </div>

                <div className="text-left border border-gray-200 rounded-2xl p-5 mb-6 space-y-3">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">Attraction</span>
                    <span className="font-medium text-gray-900 text-right">
                      {selectedAttraction.name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">Schedule</span>
                    <span className="font-medium text-gray-900 text-right">
                      {bookingDate} • {selectedSlot.label}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="font-medium text-gray-900 uppercase">
                      {selectedPaymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-gray-900">
                      ₱{selectedAttraction.price ? selectedAttraction.price * numPeople : 0}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                    setSelectedPaymentMethod(null);
                    setBookingDate("");
                    setBookingTime("");
                    setNumPeople(1);
                  }}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

</>

  );

}