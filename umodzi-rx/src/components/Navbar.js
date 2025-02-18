export function Navbar() {
    return (
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">UmodziRx</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/prescriptions" className="hover:underline">Prescriptions</a></li>
            <li><a href="/verify" className="hover:underline">Verify</a></li>
            <li><a href="/auth" className="hover:underline">Login</a></li>
          </ul>
        </div>
      </nav>
    );
  }
  