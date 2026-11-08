
import type { Attraction } from "./AttractionCard";

export const attractions: Attraction[] = [
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
