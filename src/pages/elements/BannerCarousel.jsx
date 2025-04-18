import React, { useState } from "react";
import banner from "../../assets/images/banner.png";

const banners = [banner];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      <div className="carousel-banner">
        <img src={banners[currentIndex]} alt={`Banner ${currentIndex + 1}`} />
      </div>
      <button className="carousel-button prev" onClick={handlePrev}>
        &#8249;
      </button>
      <button className="carousel-button next" onClick={handleNext}>
        &#8250;
      </button>
      <div className="carousel-indicators">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
