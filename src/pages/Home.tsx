import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');

  const handleSearch = () => {
    if (!country) {
      alert('Please select a country!');
      return;
    }
    console.log(`Searching for hotels in ${country} on ${date} for ${people} people.`);
    const params = new URLSearchParams({
      country: country,
      date: date,
      people: people || '1', // Default to 1 if not specified
    });
    navigate(`/agoda?${params.toString()}`);
  };

  const handleButtonClick = (path: string, buttonName: string) => {
    console.log(`${buttonName} button clicked, navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative min-h-[85vh]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Center Content */}
        <div className="relative text-center max-w-5xl mx-auto z-10 py-20 sm:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg">
            Let's Plan Your Perfect{' '}
            <span className="text-blue-300">Journey</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-10 sm:mb-12 leading-relaxed px-4 drop-shadow-md">
            "Great journeys begin with great company—connect, plan, and experience unforgettable trips together."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <button
              onClick={() => handleButtonClick('/agoda', 'Book Hotels')}
              className="bg-blue-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-lg sm:text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[180px]"
            >
              Book Hotels
            </button>
            <button
              onClick={() => handleButtonClick('/companion', 'Discover Now')}
              className="bg-white text-blue-600 border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-lg sm:text-xl font-semibold hover:bg-gray-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[180px]"
            >
              Discover Now
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Country */}
              <div className="w-full sm:flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Country</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="China">China</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
              </div>
              {/* Date */}
              <div className="w-full sm:flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              {/* People */}
              <div className="w-full sm:flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">People</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    min="1"
                    placeholder="0"
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-black text-white p-3 sm:p-4 rounded-full hover:bg-gray-800 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-0"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
