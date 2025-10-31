
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left side */}
        <p className="text-sm">
          © {new Date().getFullYear()} AutoService. All rights reserved.
        </p>

        {/* Right side */}
        <div className="flex space-x-6 mt-3 md:mt-0">
          <button onClick={() => {}} className="hover:text-white">Privacy Policy</button>
          <button onClick={() => {}} className="hover:text-white">Terms of Service</button>
          <button onClick={() => {}} className="hover:text-white">Contact Us</button>
        </div>
      </div>
    </footer>
  );
}
