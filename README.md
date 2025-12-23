# Flood Warning System

A Geographic Information System (GIS) based web application for real-time flood monitoring and early warning. This system provides interactive map visualization of water level sensors and flood-prone zones to help communities stay informed and prepared.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)

## About

Flood Warning System is a comprehensive flood monitoring solution that combines real-time sensor data with geographic visualization. The application enables authorities and communities to:

- **Monitor Water Levels**: Track real-time water level readings from distributed sensors
- **Visualize Flood Zones**: View flood-prone areas with risk level classifications (Low, Medium, High)
- **Receive Early Warnings**: Get instant status updates when water levels reach warning or danger thresholds
- **Manage Sensor Network**: Add, edit, and monitor water level sensors across different locations
- **Interactive Mapping**: Explore the map with multiple tile layers (Street, Satellite, Terrain)

### Key Features

- **Interactive Map** - Powered by Leaflet with multiple base layers
- **Sensor Markers** - Color-coded markers indicating sensor status (Safe/Warning/Danger)
- **Flood Zone Polygons** - Visual representation of flood-prone areas with risk levels
- **Responsive Design** - Mobile-friendly interface with collapsible sidebar
- **Search & Filter** - Find sensors and zones quickly with advanced filtering
- **Geolocation** - Locate your current position on the map
- **Modern UI** - Clean interface built with Radix UI components

## Technologies Used

### Backend

| Technology | Version | Description                           |
| ---------- | ------- | ------------------------------------- |
| PHP        | 8.2+    | Server-side programming language      |
| Laravel    | 12.x    | PHP web application framework         |
| MySQL      | 8.0+    | Relational database management system |
| Inertia.js | 2.x     | Modern monolith architecture          |

### Frontend

| Technology   | Version | Description                                     |
| ------------ | ------- | ----------------------------------------------- |
| React        | 19.x    | JavaScript library for building user interfaces |
| TypeScript   | 5.7+    | Typed superset of JavaScript                    |
| Tailwind CSS | 4.x     | Utility-first CSS framework                     |
| Vite         | 7.x     | Next-generation frontend build tool             |

### Mapping & UI

| Technology    | Version | Description                             |
| ------------- | ------- | --------------------------------------- |
| Leaflet       | 1.9.x   | Open-source JavaScript library for maps |
| React-Leaflet | 5.x     | React components for Leaflet maps       |
| Radix UI      | Latest  | Unstyled, accessible UI components      |
| Lucide React  | Latest  | Beautiful & consistent icon set         |
| Sonner        | Latest  | Toast notification library              |

## Development Setup

Follow these steps to set up the project for local development:

### Prerequisites

Make sure you have the following installed on your system:

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 20.x
- **npm** >= 10.x (or yarn/pnpm)
- **MySQL** >= 8.0 (or MariaDB)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/maymiquy/flood-warning.git
cd flood-warning
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Install Node.js Dependencies

```bash
npm install
```

### Step 4: Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flood_warning
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

### Step 6: Create Database

Create a new MySQL database:

```sql
CREATE DATABASE flood_warning;
```

### Step 7: Run Migrations & Seeders

```bash
php artisan migrate --seed
```

This will create all necessary tables and populate them with sample data.

### Step 8: Start Development Servers

Open two terminal windows/tabs:

**Terminal 1 - Laravel & Vite Development Server:**

```bash
composer dev
```

### Step 9: Access the Application

Open your browser and navigate to:

```
http://localhost:8000
```

### Additional Commands

```bash
# Run tests
php artisan test

# Fresh migration with seeders
php artisan migrate:fresh --seed

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
flood-warning/
├── app/
│   ├── Http/Controllers/    # API & Web Controllers
│   ├── Models/              # Eloquent Models
│   └── Services/            # Business Logic Layer
├── database/
│   ├── factories/           # Model Factories
│   ├── migrations/          # Database Migrations
│   └── seeders/             # Database Seeders
├── resources/
│   ├── js/
│   │   ├── components/      # React Components
│   │   ├── layouts/         # Layout Components
│   │   ├── pages/           # Inertia Pages
│   │   ├── config/          # Configuration Files
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── lib/             # Utility Functions
│   │   └── types/           # TypeScript Types
│   ├── css/                 # Stylesheets
│   └── views/               # Blade Templates
├── routes/
│   └── web.php              # Web Routes
└── public/                  # Public Assets
```

## Contributors

This project was developed by:

| Name               | Role      |
| ------------------ | --------- |
| **Anggoro Seto**   | Developer |
| **Miqdam Hambali** | Developer |
| **Shilma Puspita** | Developer |

## License

This project is open-sourced software licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [React](https://react.dev) - A JavaScript library for building user interfaces
- [Leaflet](https://leafletjs.com) - An open-source JavaScript library for interactive maps
- [OpenStreetMap](https://www.openstreetmap.org) - Free wiki world map
- [Radix UI](https://www.radix-ui.com) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
