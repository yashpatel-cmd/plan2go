import React, { FC } from "react";

const About: FC = () => {
  const styles = {
    heroSection: {
      backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      padding: "60px 0",
      color: "white",
      textAlign: "center" as "center",
      imageRendering: "high-quality"
    },
    heroTitle: {
      fontSize: "clamp(24px, 5vw, 48px)",
      fontWeight: "bold",
    },
    highlightText: {
      color: "#007BFF",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "clamp(10px, 3vw, 20px)",
      flexWrap: "wrap" as "wrap",
      marginTop: "30px",
      padding: "clamp(10px, 3vw, 20px)",
    },
    card: {
      backgroundColor: "white",
      padding: "clamp(15px, 4vw, 20px)",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      width: "clamp(280px, 90vw, 300px)",
      textAlign: "center" as "center",
      maxWidth: "100%",
    },
    footer: {
      backgroundColor: "#F8F9FA",
      padding: "clamp(15px, 4vw, 30px)",
      marginTop: "30px",
      textAlign: "center" as "center",
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          ABOUT <span style={styles.highlightText}>US</span>
        </h1>
      </div>

      {/* Information Cards Section */}
      <div style={styles.cardContainer}>
        {/* Tour Card */}
        <div style={styles.card}>
          <h2 style={{ fontWeight: "bold" }}>TOUR</h2>
          <p>
            Embark on unforgettable journeys to breathtaking destinations.
            Discover new cultures, explore hidden gems, and create memories
            that last a lifetime with our expertly crafted tours.
          </p>
        </div>

        {/* Companion Card */}
        <div style={styles.card}>
          <h2 style={{ fontWeight: "bold" }}>COMPANION</h2>
          <p>
            Find like-minded travelers to share your journey with and create
            lasting memories together.
          </p>
        </div>

        {/* Support Card */}
        <div style={styles.card}>
          <h2 style={{ fontWeight: "bold" }}>SUPPORT</h2>
          <p>
            24/7 customer support to ensure your travel experience is smooth and
            worry-free.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div style={styles.footer}>
        <p>© 2025 Plan2Go LLC | Terms & Privacy Policy</p>
      </div>
    </div>
  );
};

export default About;
