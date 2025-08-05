import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Main = () => {
  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [errorAnimals, setErrorAnimals] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoadingAnimals(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/animal/main/");
        // ترتيب العناصر من الأحدث إلى الأقدم (افترض أن كل عنصر له id)
        const sortedAnimals = response.data.sort((a, b) => b.id - a.id);
        setAnimals(sortedAnimals);
        setLoadingAnimals(false);
      } catch (error) {
        console.error("Error fetching animals:", error);
        setErrorAnimals("Failed to load animals.");
        setLoadingAnimals(false);
      }
    };

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/animal/categories/");
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories("Failed to load categories.");
        setLoadingCategories(false);
      }
    };

    fetchAnimals();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredAnimals(animals);
    } else {
      const filtered = animals.filter(animal => animal.category.id.toString() === selectedCategory);
      setFilteredAnimals(filtered);
    }
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير التصنيف
  }, [animals, selectedCategory]);

  // حساب العناصر المعروضة في الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnimals.slice(indexOfFirstItem, indexOfLastItem);

  // تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loadingAnimals || loadingCategories) {
    return <p>Loading data...</p>;
  }

  if (errorAnimals || errorCategories) {
    return <p>{errorAnimals || errorCategories}</p>;
  }

  return (
    <div>
      <h2>List of Animals</h2>

      <div>
        <label htmlFor="categoryFilter">Filter by Category: </label>
        <select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.categoryName}</option>
          ))}
        </select>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', gap: '20px' }}>
        {currentItems.map(animal => (
          <div key={animal.id} className="card" style={{ width: "20%" }}>
            {animal.imageFile && <img className="card-img-top" src={`${animal.imageFile}`} alt={animal.title} style={{ Width: '200px' }} />}
            <div className="card-body">
              <h4 className="card-title">{animal.title}</h4>
              <p className="card-text">
                {animal.description.length > 50 ? `${animal.description.substring(0, 150)}...` : animal.description}
              </p>
              <p>Price: {animal.price} $</p>
              <p>Category: {animal.category.categoryName}</p>
              <Link to={`/animal/${animal.id}`} className="btn btn-primary stretched-link">See Details</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        {Array.from({ length: Math.ceil(filteredAnimals.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: currentPage === index + 1 ? '#007bff' : '#f8f9fa',
              color: currentPage === index + 1 ? 'white' : 'black',
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Main;