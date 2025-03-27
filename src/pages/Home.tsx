import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import GlobeImage from '../assets/plan2go-logo.png'; // Ensure the path is correct

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      backgroundColor: '#EAF6FF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '10px' 
    }}>
      
      {/* Main Content */}
      <div style={{ 
        maxWidth: '1500px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '-50px' // Reducing gap
      }}>
        
        {/* Left Side - Text Content */}
        <div style={{ maxWidth: '50%' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '30x', lineHeight: '1.3' }}>
            Let's Plan Your Perfect <span style={{ color: '#007bff' }}>Journey</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#444', marginBottom: '30px' }}>
            "Great journeys begin with great company—connect, plan, and experience unforgettable trips together."
          </p>
          <button
            onClick={() => navigate('/destination')}
            style={{ 
              backgroundColor: 'black', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: '30px', 
              fontSize: '16px', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Discover Now
          </button>
        </div>

        {/* Right Side - Globe Image */}
        <div>
          <img 
            src={GlobeImage} 
            alt="Globe with Travel Icons" 
            style={{ width: '500px', height: 'auto', marginTop: '-20px' }} // Reduced top margin
          />
        </div>
      </div>

      {/* Search Box Positioned Below */}
      <div style={{ 
        marginTop: '60px', // Pulling up the search box
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <SearchBox />
      </div>

    </div>
  );
};

export default Home;
