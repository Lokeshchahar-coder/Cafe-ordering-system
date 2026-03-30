
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const foodItems = [
  {
    id: 1,
    name: "Onion Pizza",
    price: 150,
    rating: 4.5,
    tag: "Pizza",
    description: "A delicious pizza topped with fresh onions for a delightful flavor.",
    img: "https://content.jdmagicbox.com/comp/def_content/pizza_outlets/default-pizza-outlets-13.jpg",
  },
  {
    id: 2,
    name: "Sushi Platter",
    price: 650,
    rating: 4.8,
    tag: "Sushi",
    description: "A fresh and authentic sushi platter.",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754",
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    price: 300,
    rating: 4.2,
    tag: "Pasta",
    description: "Creamy and cheesy pasta carbonara.",
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
  },
  {
    id: 4,
    name: "Caesar Salad",
    price: 180,
    rating: 4.1,
    tag: "Salad",
    description: "A fresh and healthy Caesar salad.",
    img: "https://images.unsplash.com/photo-1582515073490-399813c962d2",
  },
];

function FoodCarousel({ cartItems = [], setCartItems = () => {} }) {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-500 text-white py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">🍕 Featured Food Items</h1>
          <p className="text-green-100 mt-2">Swipe to explore our delicious menu</p>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="container mx-auto px-4 py-12 bg-gray-50">
        <Slider {...settings}>
          {foodItems.map((item) => (
            <div key={item.id} className="px-2">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden relative h-full">
                {/* Tag */}
                <span className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded z-10">
                  {item.tag}
                </span>
                {/* Rating */}
                <span className="absolute top-2 right-2 bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded z-10">
                  ⭐ {item.rating}
                </span>
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-green-500 font-bold text-lg">₹{item.price}</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default FoodCarousel;