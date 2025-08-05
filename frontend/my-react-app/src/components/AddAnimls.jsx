import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AddAnimals = () => {
  const jwt_access = localStorage.getItem('access')

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
    price: "",
    category: "",
  });

  const fileInputRef = useRef(null); // إنشاء مرجع لحقل الملف

  useEffect(() => {
    if (!jwt_access) return;

    setLoading(true);
    axios.get("http://localhost:8000/animal/categories/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt_access}`
      }
    })
    .then(response => {
      setCategories(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching categories:", error);
      toast.error("Field to load Category");
      setLoading(false);
    });
  }, [jwt_access]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imageFile: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageFile) {
      toast.error("You must to choose Image");
      return;
    }
    if (!formData.category) {
      toast.error("You must select a category");
      return;
    }

    setLoading(true); // تعيين حالة التحميل عند الإرسال

    try {
      const animalFormData = new FormData();
      animalFormData.append('title', formData.title);
      animalFormData.append('description', formData.description);
      animalFormData.append('imageFile', formData.imageFile);
      animalFormData.append('price', formData.price);
      animalFormData.append('category', parseInt(formData.category));
      // animalFormData.append('category', formData.category);

      const res = await axios.post(
        "http://localhost:8000/animal/addadnimals/",
        animalFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jwt_access}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success("The animal has been add success");
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          imageFile: null
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // تفريغ حقل الملف
        }
        setLoading(false); // إعادة تعيين حالة التحميل بعد النجاح
      }
    } catch (error) {

      console.error("Error details:", {
        request: error.config.data,
        response: error.response?.data
      });

      toast.error(error.response?.data?.category?.[0] || "Error adding animal");
      
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "there error when you send");
      setLoading(false); // إعادة تعيين حالة التحميل حتى في حالة الخطأ
    }
  };

  return (
    <div className="form-container">
      <div className="wrapper" style={{ width: "100%" }}>
        <h1>Add New Animal</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="imageFile" // تأكد من أن الاسم هنا هو 'imageFile' كما في حالة formData
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
              required
              ref={fileInputRef} // ربط المرجع بحقل الملف
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">-- Choose category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {loading && <small>Loading your category</small>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Proccesing" : "Add Animal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnimals;