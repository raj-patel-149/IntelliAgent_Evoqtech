const mongoose = require("mongoose");
const TeamServiceTemplate = require("./models/TeamServiceTemplate"); // Adjust if needed

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://kahodaraj123:raj16192003@cluster0.8v2fh.mongodb.net/crud",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Sample services (10 team-based service templates)
const teamServiceTemplates = [
  {
    service_name: "Solar Panel Installation",
    completion_time: "6 hours",
    description: "Installation of solar panels on rooftops.",
    requirements: [
      { department: "electrical", count: 3 },
      { department: "technical", count: 2 },
      { department: "cleaning", count: 2 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Drill", "Safety Harness", "Multimeter"],
    skills_tags: ["solar", "installation", "wiring"],
  },
  {
    service_name: "Home Automation Setup",
    completion_time: "5 hours",
    description: "Installing smart devices across the home.",
    requirements: [
      { department: "electrical", count: 2 },
      { department: "technical", count: 3 },
      { department: "cleaning", count: 1 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Smart Hub", "Wiring Kit", "Testing Equipment"],
    skills_tags: ["automation", "smart", "wiring"],
  },
  {
    service_name: "Full House Plumbing Overhaul",
    completion_time: "7 hours",
    description: "Rework of all plumbing lines and fixtures.",
    requirements: [
      { department: "plumbing", count: 4 },
      { department: "technical", count: 2 },
      { department: "cleaning", count: 2 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Pipe Cutter", "Wrench", "Sealant"],
    skills_tags: ["plumbing", "pipes", "leak"],
  },
  {
    service_name: "Car Garage Remodeling",
    completion_time: "8 hours",
    description: "Upgrade garage with equipment and aesthetics.",
    requirements: [
      { department: "garage", count: 3 },
      { department: "repairing", count: 2 },
      { department: "cleaning", count: 2 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Paint Gun", "Drill", "Jack Stand"],
    skills_tags: ["garage", "repair", "tools"],
  },
  {
    service_name: "Salon Interior Setup",
    completion_time: "6 hours",
    description: "Install stations, lighting and electricals.",
    requirements: [
      { department: "saloon", count: 3 },
      { department: "electrical", count: 2 },
      { department: "carpentry", count: 2 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Mirror", "Chair Setup", "Power Tools"],
    skills_tags: ["salon", "setup", "interior"],
  },
  {
    service_name: "Apartment Electrical Inspection",
    completion_time: "4 hours",
    description: "Complete check of home electrical system.",
    requirements: [
      { department: "electrical", count: 4 },
      { department: "technical", count: 1 },
      { department: "cleaning", count: 1 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Multimeter", "Voltage Tester", "Safety Kit"],
    skills_tags: ["electrical", "inspection"],
  },
  {
    service_name: "Full Office Cleaning and Maintenance",
    completion_time: "5 hours",
    description: "Deep cleaning and minor technical repair.",
    requirements: [
      { department: "cleaning", count: 4 },
      { department: "technical", count: 2 },
      { department: "repairing", count: 1 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Vacuum", "Mop", "Repair Kit"],
    skills_tags: ["cleaning", "office", "maintenance"],
  },
  {
    service_name: "Restaurant Setup and Wiring",
    completion_time: "7 hours",
    description: "Install kitchen and dining area fixtures.",
    requirements: [
      { department: "carpentry", count: 3 },
      { department: "electrical", count: 2 },
      { department: "technical", count: 2 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Drill", "Lights", "Cabling Tools"],
    skills_tags: ["restaurant", "setup", "wiring"],
  },
  {
    service_name: "Luxury Villa Painting and Design",
    completion_time: "6 hours",
    description: "Paint and decorate villa interior/exterior.",
    requirements: [
      { department: "painting", count: 4 },
      { department: "cleaning", count: 2 },
      { department: "carpentry", count: 1 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Brushes", "Scaffold", "Protective Gear"],
    skills_tags: ["painting", "villa", "design"],
  },
  {
    service_name: "Advanced CCTV Setup",
    completion_time: "5 hours",
    description: "Multi-camera setup with monitoring system.",
    requirements: [
      { department: "technical", count: 3 },
      { department: "electrical", count: 2 },
      { department: "cleaning", count: 1 },
      { department: "inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["CCTV Kit", "Ladders", "Cabling Tools"],
    skills_tags: ["cctv", "security", "installation"],
  },
  {
    service_name: "Office Renovation",
    completion_time: "6 days",
    description:
      "Complete office interior renovation including wiring, painting, and carpentry.",
    requirements: [
      { department: "Electrical", count: 2 },
      { department: "Painting", count: 2 },
      { department: "Carpentry", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Paint Sprayer", "Power Drill", "Wire Cutter"],
    skills_tags: ["interior", "remodel", "commercial"],
  },
  {
    service_name: "Hotel Deep Cleaning",
    completion_time: "3 days",
    description: "Full-scale hotel room and lobby cleaning service.",
    requirements: [
      { department: "Cleaning", count: 5 },
      { department: "Plumbing", count: 1 },
      { department: "Electrical", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Vacuum Cleaner", "Pressure Washer"],
    skills_tags: ["cleaning", "hospitality"],
  },

  {
    service_name: "Bathroom Remodeling",
    completion_time: "4 days",
    description: "Bathroom repair, plumbing and tile work.",
    requirements: [
      { department: "Plumbing", count: 2 },
      { department: "Cleaning", count: 1 },
      { department: "Carpentry", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: false,
    tools_needed: ["Tile Cutter", "Pipe Wrench"],
    skills_tags: ["bathroom", "remodel"],
  },
  {
    service_name: "Luxury Car Customization",
    completion_time: "5 days",
    description: "Car interior and lighting custom upgrades.",
    requirements: [
      { department: "Garage", count: 2 },
      { department: "Electrical", count: 2 },
      { department: "Cleaning", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Wiring Kit", "LED Kit"],
    skills_tags: ["automobile", "custom"],
  },
  {
    service_name: "Waterproofing Service",
    completion_time: "2 days",
    description: "Basement waterproofing and insulation fix.",
    requirements: [
      { department: "Repairing", count: 2 },
      { department: "Plumbing", count: 1 },
      { department: "Cleaning", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: false,
    tools_needed: ["Sealant", "Scraper"],
    skills_tags: ["waterproof", "basement"],
  },
  {
    service_name: "Restaurant Setup",
    completion_time: "7 days",
    description: "From plumbing to electrical setup for a new restaurant.",
    requirements: [
      { department: "Electrical", count: 3 },
      { department: "Plumbing", count: 2 },
      { department: "Painting", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Wire Stripper", "Pipe Bender"],
    skills_tags: ["restaurant", "setup"],
  },
  {
    service_name: "Solar Panel Maintenance",
    completion_time: "1 day",
    description: "Routine cleaning and repair of solar panel systems.",
    requirements: [
      { department: "Electrical", count: 2 },
      { department: "Cleaning", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: false,
    tools_needed: ["Cleaning Brush", "Multimeter"],
    skills_tags: ["solar", "maintenance"],
  },
  {
    service_name: "Security Camera Installation",
    completion_time: "1 day",
    description: "Install and configure surveillance system.",
    requirements: [
      { department: "Technical", count: 2 },
      { department: "Electrical", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Drill", "Cable Crimper"],
    skills_tags: ["security", "camera"],
  },
  {
    service_name: "High-Rise Glass Cleaning",
    completion_time: "2 days",
    description: "External facade glass cleaning of high-rise buildings.",
    requirements: [
      { department: "Cleaning", count: 4 },
      { department: "Technical", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Rope Access", "Cleaning Kit"],
    skills_tags: ["glass", "cleaning", "high-rise"],
  },
  {
    service_name: "Swimming Pool Setup",
    completion_time: "4 days",
    description:
      "Plumbing, tiling, lighting, and cleaning for pool construction.",
    requirements: [
      { department: "Plumbing", count: 2 },
      { department: "Electrical", count: 2 },
      { department: "Cleaning", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Pool Pump", "Sealant"],
    skills_tags: ["swimming", "pool"],
  },
  {
    service_name: "Roof Leak Repair",
    completion_time: "2 days",
    description: "Sealing, repair and plumbing of roof leak.",
    requirements: [
      { department: "Repairing", count: 2 },
      { department: "Plumbing", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: false,
    tools_needed: ["Sealant Gun", "Roofing Hammer"],
    skills_tags: ["roof", "repair"],
  },
  {
    service_name: "Electrical System Upgrade",
    completion_time: "2 days",
    description: "Upgrade complete wiring and panel for residential property.",
    requirements: [
      { department: "Electrical", count: 4 },
      { department: "Technical", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Tester", "Voltage Meter"],
    skills_tags: ["electrical", "upgrade"],
  },
  {
    service_name: "Basement Finishing",
    completion_time: "6 days",
    description: "Add flooring, lights, painting and electrical fittings.",
    requirements: [
      { department: "Carpentry", count: 2 },
      { department: "Painting", count: 2 },
      { department: "Electrical", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Sander", "Paint Tools"],
    skills_tags: ["basement", "finish"],
  },
  {
    service_name: "Showroom Setup",
    completion_time: "5 days",
    description: "End-to-end setup of a retail showroom.",
    requirements: [
      { department: "Painting", count: 2 },
      { department: "Carpentry", count: 2 },
      { department: "Electrical", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Paint Gun", "Hammer"],
    skills_tags: ["showroom", "retail"],
  },
  {
    service_name: "Warehouse Electrical Installation",
    completion_time: "3 days",
    description: "Install wiring and lighting for warehouse.",
    requirements: [
      { department: "Electrical", count: 3 },
      { department: "Technical", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Conduit Bender", "Drill"],
    skills_tags: ["warehouse", "electrical"],
  },
  {
    service_name: "Garden Landscaping",
    completion_time: "2 days",
    description: "Rebuild and organize garden with lighting.",
    requirements: [
      { department: "Cleaning", count: 2 },
      { department: "Electrical", count: 1 },
      { department: "Carpentry", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: false,
    tools_needed: ["Shovel", "Pruner"],
    skills_tags: ["landscape", "garden"],
  },
  {
    service_name: "Clinic Setup",
    completion_time: "5 days",
    description: "Interior and utility setup for clinics and labs.",
    requirements: [
      { department: "Electrical", count: 2 },
      { department: "Painting", count: 2 },
      { department: "Plumbing", count: 2 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Wire Cutter", "Paint Roller"],
    skills_tags: ["clinic", "setup"],
  },
  {
    service_name: "EV Charging Station Setup",
    completion_time: "3 days",
    description:
      "Install EV chargers with electrical and inspection requirements.",
    requirements: [
      { department: "Electrical", count: 3 },
      { department: "Technical", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Cable Tester", "EV Kit"],
    skills_tags: ["ev", "charging"],
  },
  {
    service_name: "Restaurant Cleaning + Sanitization",
    completion_time: "2 days",
    description: "Deep cleaning and sanitization for food areas.",
    requirements: [
      { department: "Cleaning", count: 3 },
      { department: "Plumbing", count: 1 },
      { department: "Inspection", count: 1 },
    ],
    leader_required: true,
    tools_needed: ["Sanitizer Spray", "Scrubber"],
    skills_tags: ["restaurant", "sanitization"],
  },
];

// Seed function
async function seedTeamServiceTemplates() {
  try {
    const result = await TeamServiceTemplate.insertMany(teamServiceTemplates);
    console.log(`✅ Inserted ${result.length} team service templates.`);
  } catch (err) {
    console.error("❌ Error inserting templates:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedTeamServiceTemplates();
