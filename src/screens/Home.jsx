import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  // Load food items and categories from API
  const loadFoodItems = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      response = await response.json();
      console.log('Fetched data:', response); // Debug statement
      setFoodItems(response[0] || []);
      setFoodCat(response[1] || []);
    } catch (error) {
      console.error('Error fetching food data:', error); // Handle errors
    }
  };

  // Run on component mount
  useEffect(() => {
    loadFoodItems();
  }, []);

  // Debug: Check if data is populated properly
  useEffect(() => {
    console.log('foodCat:', foodCat);
    console.log('foodItems:', foodItems);
  }, [foodCat, foodItems]);

  return (
    <div>
      <Navbar />
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption" style={{ zIndex: '9' }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2 w-75 bg-white text-dark"
                type="search"
                placeholder="Search in here..."
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn text-white bg-danger" onClick={() => setSearch('')}>
                X
              </button>
            </div>
          </div>
          <div className="carousel-item active">
            <img src="/burger.jpg" className="d-block w-100" style={{ filter: 'brightness(50%)' }} alt="Burger" />
          </div>
          <div className="carousel-item">
            <img src="/pizza.jpg" className="d-block w-100" style={{ filter: 'brightness(50%)' }} alt="Pizza" />
          </div>
          <div className="carousel-item">
            <img src="/pasta.jpg" className="d-block w-100" style={{ filter: 'brightness(50%)' }} alt="Pasta" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container">
        {foodCat.length > 0 ? (
          foodCat.map((data, index) => {
            console.log(`Rendering category: ${data.CategoryName}`);  // Debug statement
            return (
              <div key={index} className="row mb-3">
                <div className="fs-3 m-3">{data.CategoryName}</div>
                <hr
                  id="hr-success"
                  style={{ height: '4px', backgroundImage: '-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))' }}
                />
                {foodItems.length > 0 ? (
                  foodItems
                    .filter((items) => {
                      const match = items.CategoryName.trim().toLowerCase() === data.CategoryName.trim().toLowerCase();
                      console.log(
                        `Checking item: ${items.name} | Category: ${items.CategoryName} | Matches: ${match}`
                      );  // Debug statement
                      return match && items.name.toLowerCase().includes(search.toLowerCase());
                    })
                    .map((filterItems, idx) => (
                      <div key={filterItems._id || idx} className="col-12 col-md-6 col-lg-3">
                        <Card
                          foodName={filterItems.name}
                          item={filterItems}
                          options={filterItems.options[0]}
                          ImgSrc={filterItems.img}
                        />
                      </div>
                    ))
                ) : (
                  <div>No Items Found</div>
                )}
              </div>
            );
          })
        ) : (
          <div>No Categories Available</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
