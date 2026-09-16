import AdminNav from "../tourismdashboard/AdminNav"; // Using standard alias paths
import Map from "../tourismdashboard/components/map"; // Capitalized Map component

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. Render the top navigation */}
      <AdminNav />
      
      {/* 2. Render your map contents with appropriate top padding so it doesn't hide behind the navbar */}
      <div className="pt-24">
        <Map />
      </div>
    </main>
  );
}