import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const db = new Database("properties.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      price TEXT,
      location TEXT,
      description TEXT,
      image_url TEXT,
      category TEXT,
      amenities TEXT,
      landmarks TEXT,
      status TEXT,
      virtual_tour_url TEXT,
      floor_plan_url TEXT,
      images TEXT,
      specifications TEXT,
      builder_name TEXT,
      possession_date TEXT,
      total_units INTEGER,
      rera_id TEXT,
      coordinates TEXT,
      survey_number TEXT,
      village_name TEXT,
      sqft_rate REAL,
      vastu_score INTEGER,
      flood_risk TEXT,
      smart_city_score INTEGER,
      khata_type TEXT,
      maintenance_index TEXT,
      white_coat_score INTEGER,
      yield_estimate TEXT,
      matterport_url TEXT,
      building_age INTEGER,
      is_shoreline INTEGER,
      monsoon_index INTEGER,
      crz_status TEXT
    )
  `);

  // Seed some initial data if empty
  const rowCount = db.prepare("SELECT count(*) as count FROM properties").get() as { count: number };
  if (rowCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO properties (
        title, type, price, location, description, image_url, category, 
        amenities, landmarks, status, virtual_tour_url, floor_plan_url, images,
        specifications, builder_name, possession_date, total_units,
        rera_id, coordinates, survey_number, village_name, sqft_rate,
        vastu_score, flood_risk, smart_city_score, khata_type,
        maintenance_index, white_coat_score, yield_estimate,
        matterport_url, building_age, is_shoreline, monsoon_index, crz_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Land Trades Pristine
    insert.run(
      "Land Trades Pristine", "Apartment", "₹1.2 Crores onwards", "Chilimbi, Mangalore", 
      "A 37-floor landmark skyscraper offering ultra-luxury living with panoramic sea views.", 
      "https://picsum.photos/seed/pristine/1200/800", "apartment", 
      "Infinity Pool, Sky Lounge, Private Theatre, Automated Parking, 24/7 Concierge", 
      "Near Ladyhill, 2km from City Centre, 500m from Urwa Market", 
      "Under Construction", "https://example.com/tour/pristine", "https://example.com/plan/pristine",
      JSON.stringify([
        "https://picsum.photos/seed/pristine/1200/800",
        "https://picsum.photos/seed/pristine1/1200/800"
      ]),
      "Marine-Grade Exterior Paint, Smart Home Automation, Italian Marble, VRF AC",
      "Land Trades Builders & Developers", "December 2026", 150,
      "PRM/KA/RERA/1257/334/PR/290423/005898", JSON.stringify({ lat: 12.895, lng: 74.835 }),
      "456/2", "Urwa", 7500, 10, "Low", 98, "A-Khata", "Marine-Grade", 95, "5.5%",
      "https://my.matterport.com/show/?m=example", 0, 1, 5, "CRZ-II Compliant"
    );

    // Land Trades Altura
    insert.run(
      "Altura by Land Trades", "Apartment", "₹95 Lakhs onwards", "Bendoorwell, Mangalore", 
      "Premium 3BHK & 4BHK apartments with breathtaking views of the city skyline.", 
      "https://picsum.photos/seed/altura/1200/800", "apartment", 
      "Infinity Pool, Gym, Rooftop Garden, 24/7 Security, Clubhouse, Children's Play Area", 
      "Near St. Agnes College, 2km from KMC Hospital, 1km from City Centre Mall", 
      "Ready to Occupy", "https://example.com/tour/altura", "https://example.com/plan/altura",
      JSON.stringify([
        "https://picsum.photos/seed/altura/1200/800",
        "https://picsum.photos/seed/altura1/1200/800",
        "https://picsum.photos/seed/altura2/1200/800"
      ]),
      "RCC Framed Structure, Vitrified Tile Flooring, Teak Wood Main Door, Premium Sanitary Fittings",
      "Land Trades Builders & Developers", "Immediate", 120,
      "PRM/KA/RERA/1257/334/PR/180516/001701", JSON.stringify({ lat: 12.875, lng: 74.855 }),
      "123/4B", "Bendoor", 6500, 9, "Low", 85, "A-Khata", "Standard", 80, "4.5%",
      null, 2, 0, 4, "Non-CRZ"
    );

    insert.run(
      "Solitaire by Land Trades", "Apartment", "₹1.5 Crores onwards", "Hat Hill, Mangalore", 
      "Luxury skyscraper with panoramic sea views and world-class amenities.", 
      "https://picsum.photos/seed/solitaire/1200/800", "apartment", 
      "Clubhouse, Swimming Pool, Indoor Games, High-speed Elevators, Helipad, Mini Theatre", 
      "Near Ladyhill Circle, 3km from Mangalore Central, 500m from Urwa Market", 
      "Ready to Occupy", "https://example.com/tour/solitaire", "https://example.com/plan/solitaire",
      JSON.stringify([
        "https://picsum.photos/seed/solitaire/1200/800",
        "https://picsum.photos/seed/solitaire1/1200/800",
        "https://picsum.photos/seed/solitaire2/1200/800"
      ]),
      "High-strength Concrete, Italian Marble in Foyer, Smart Home Automation, VRF Air Conditioning",
      "Land Trades Builders & Developers", "Immediate", 80,
      "PRM/KA/RERA/1257/334/PR/171031/000923", JSON.stringify({ lat: 12.885, lng: 74.845 }),
      "45/2A", "Urwa", 8000, 8, "Low", 90, "A-Khata", "Premium", 75, "4.2%",
      null, 1, 1, 5, "CRZ-II Compliant"
    );

    // Rohan Corporation
    insert.run(
      "Rohan City by Rohan Corp", "Apartment", "₹45 Lakhs onwards", "Bejai Main Road, Mangalore", 
      "Massive residential & commercial hub designed for the modern urban lifestyle.", 
      "https://picsum.photos/seed/rohancity/1200/800", "apartment", 
      "Shopping Mall, Multiplex, Food Court, Large Parking, Landscaped Gardens, Gym", 
      "Opposite KSRTC Bus Stand, Near Bharath Mall, 1.5km from AJ Hospital", 
      "Under Construction", "https://example.com/tour/rohancity", "https://example.com/plan/rohancity",
      JSON.stringify([
        "https://picsum.photos/seed/rohancity/1200/800",
        "https://picsum.photos/seed/rohan1/1200/800",
        "https://picsum.photos/seed/rohan2/1200/800"
      ]),
      "Seismic Zone III Compliant, UPVC Windows, Modular Kitchen Provisions, Fire Safety Systems",
      "Rohan Corporation", "December 2027", 500,
      "PRM/KA/RERA/1257/334/PR/210302/003964", JSON.stringify({ lat: 12.881, lng: 74.851 }),
      "88/1", "Bejai", 5500, 7, "Low", 95, "A-Khata", "Standard", 90, "5.0%",
      null, 0, 0, 4, "Non-CRZ"
    );

    // Allegro Builders
    insert.run(
      "Allegro Aventus", "Apartment", "₹75 Lakhs onwards", "Kudroli, Mangalore", 
      "Modern residential project with excellent connectivity and urban amenities.", 
      "https://picsum.photos/seed/aventus/1200/800", "apartment", 
      "Gym, Party Hall, Indoor Games, 24/7 Power Backup, CCTV Security", 
      "Near Kudroli Temple, 2km from Central Market, 1.5km from Lady Goschen Hospital", 
      "Under Construction", "https://example.com/tour/aventus", "https://example.com/plan/aventus",
      JSON.stringify([
        "https://picsum.photos/seed/aventus/1200/800",
        "https://picsum.photos/seed/aventus1/1200/800"
      ]),
      "RCC Structure, Vitrified Tiles, Granite Kitchen, Branded Fittings",
      "Allegro Builders", "June 2026", 84,
      "PRM/KA/RERA/1257/334/PR/200113/003155", JSON.stringify({ lat: 12.872, lng: 74.838 }),
      "212/5", "Kudroli", 5200, 8, "Medium", 70, "A-Khata", "Standard", 65, "4.8%",
      null, 0, 0, 3, "Non-CRZ"
    );

    // Udbhav Builders
    insert.run(
      "Udbhav Chinmaya", "Apartment", "₹85 Lakhs onwards", "Kadri, Mangalore", 
      "Luxury living in the heart of Kadri with premium finishes and serene surroundings.", 
      "https://picsum.photos/seed/chinmaya/1200/800", "apartment", 
      "Rooftop Infinity Pool, Fitness Center, Landscaped Garden, Multi-purpose Hall", 
      "Near Kadri Park, 500m from AJ Hospital, 1km from Kadri Temple", 
      "Under Construction", "https://example.com/tour/chinmaya", "https://example.com/plan/chinmaya",
      JSON.stringify([
        "https://picsum.photos/seed/chinmaya/1200/800",
        "https://picsum.photos/seed/chinmaya1/1200/800"
      ]),
      "Seismic Resistant Design, Italian Marble Flooring, Smart Home Features, VRV AC",
      "Udbhav Builders", "December 2026", 45,
      "PRM/KA/RERA/1257/334/PR/190823/002811", JSON.stringify({ lat: 12.888, lng: 74.862 }),
      "56/3", "Kadri", 7200, 10, "Low", 80, "A-Khata", "Premium", 85, "5.2%",
      null, 0, 0, 4, "Non-CRZ"
    );

    // Inland Builders
    insert.run(
      "Inland Sunlight Moonlight", "Apartment", "₹55 Lakhs", "Kulshekar, Mangalore", 
      "Twin tower project offering a blend of comfort and convenience.", 
      "https://picsum.photos/seed/inland/1200/800", "apartment", 
      "Children's Play Area, Power Backup, Intercom, Rainwater Harvesting, Sewage Treatment Plant", 
      "Near Kulshekar Church, 5km from City Center, 2km from Mangala Jyothi School", 
      "Ready to Occupy", "https://example.com/tour/inland", "https://example.com/plan/inland",
      JSON.stringify([
        "https://picsum.photos/seed/inland/1200/800",
        "https://picsum.photos/seed/inland1/1200/800"
      ]),
      "Laterite Stone Masonry, Granite Kitchen Platform, Branded CP Fittings, Plastic Emulsion Paint",
      "Inland Builders", "Immediate", 150,
      null, null, null, null, 4500, 6, "Low", 60, "A-Khata", "Standard", 50, "4.0%",
      null, 5, 0, 5, "Non-CRZ"
    );

    // Aarnava Builders
    insert.run(
      "Aarnava Heights", "Apartment", "₹65 Lakhs", "Shakthinagar, Mangalore", 
      "Modern living in a quiet neighborhood with excellent connectivity.", 
      "https://picsum.photos/seed/aarnava/1200/800", "apartment", 
      "Gym, Party Hall, Jogging Track, Solar Water Heating, Covered Car Parking", 
      "Near Shakthinagar Cross, 4km from KPT, 3km from Kadri Park", 
      "Under Construction", "https://example.com/tour/aarnava", "https://example.com/plan/aarnava",
      JSON.stringify([
        "https://picsum.photos/seed/aarnava/1200/800",
        "https://picsum.photos/seed/aarnava1/1200/800"
      ]),
      "Solid Block Masonry, Anti-skid Tiles in Bathrooms, Concealed Copper Wiring, Powder Coated Aluminum Windows",
      "Aarnava Builders", "June 2026", 60,
      null, null, null, null, 4800, 7, "Low", 65, "A-Khata", "Standard", 55, "4.2%",
      null, 1, 0, 4, "Non-CRZ"
    );

    // Commercial Property
    insert.run(
      "Coastline Business Hub", "Commercial", "₹15 Crores", "Falnir, Mangalore", 
      "A premium A-grade commercial complex in the heart of Mangalore's business district. Ideal for luxury clinics, corporate offices, and premium retail.", 
      "https://picsum.photos/seed/hub/1200/800", "commercial", 
      "High-speed Elevators, 100% Power Backup, Centralized AC, Ample Parking, 24/7 Security", 
      "Near Falnir Health Centre, 1km from Hampankatta, 2km from Mangalore Central", 
      "Ready to Occupy", "https://example.com/tour/hub", "https://example.com/plan/hub",
      JSON.stringify([
        "https://picsum.photos/seed/hub/1200/800",
        "https://picsum.photos/seed/hub1/1200/800"
      ]),
      "Glass Curtain Wall, Double Height Lobby, Fire Suppression System, Fiber Optic Connectivity",
      "Coastline Developers", "Immediate", 25,
      "PRM/KA/RERA/1257/334/PR/220512/004892", JSON.stringify({ lat: 12.865, lng: 74.842 }),
      "789/1A", "Falnir", 12000, 9, "Low", 92, "A-Khata", "Premium", 98, "8.2%",
      "https://my.matterport.com/show/?m=example-hub", 1, 0, 5, "Non-CRZ"
    );

    // Pranaam Builders
    insert.run(
      "Pranaam Pearl", "Apartment", "₹70 Lakhs", "Kadri, Mangalore", 
      "Elegant apartments located in one of Mangalore's most prestigious areas.", 
      "https://picsum.photos/seed/pranaam/1200/800", "apartment", 
      "CCTV, Fire Fighting System, Rainwater Harvesting, Lift, Generator Backup", 
      "Near Kadri Park, 1km from AJ Hospital, 500m from Kadri Temple", 
      "Ready to Occupy", "https://example.com/tour/pranaam", "https://example.com/plan/pranaam",
      JSON.stringify([
        "https://picsum.photos/seed/pranaam/1200/800",
        "https://picsum.photos/seed/pranaam1/1200/800"
      ]),
      "Reinforced Concrete Structure, Ceramic Tile Dadoing, Flush Doors with Laminate, Branded Electrical Switches",
      "Pranaam Builders", "Immediate", 40,
      null, null, null, null, 7000, 9, "Low", 80, "A-Khata", "Standard", 70, "4.5%",
      null, 3, 0, 4, "Non-CRZ"
    );
  }

  app.use(express.json());

  // API Routes
  app.get("/api/properties", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties").all().map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [p.image_url],
      coordinates: p.coordinates ? JSON.parse(p.coordinates) : null
    }));
    res.json(properties);
  });

  app.get("/api/properties/search", (req, res) => {
    const { q } = req.query;
    const properties = db.prepare("SELECT * FROM properties WHERE title LIKE ? OR location LIKE ?").all(`%${q}%`, `%${q}%`).map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [p.image_url],
      coordinates: p.coordinates ? JSON.parse(p.coordinates) : null
    }));
    res.json(properties);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
