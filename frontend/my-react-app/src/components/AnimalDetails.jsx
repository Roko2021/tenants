import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const AnimalDetails = () => {
    const { id } = useParams(); // استخراج الـ id من عنوان URL
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnimalDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/animal/animals/${id}/`);
                setAnimal(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching animal details:", error);
                setError("Failed to load animal details.");
                setLoading(false);
            }
        };

        fetchAnimalDetails();
    }, [id]);

    if (loading) {
        return <p>Loading animal details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!animal) {
        return <p>Animal not found.</p>;
    }

    return (
        <div>
            <h2>{animal.title}</h2>
            <div className='add-to-cart'>
                {animal.imageFile && <img src={`${animal.imageFile}`} alt={animal.title} style={{ maxWidth: '400px' }} />}
                <div style={{ display: 'inline-block', padding: '5px' }}> {/* إضافة مربع حول الزر */}
                    <a href="" className="btn btn-primary">Add to cart</a> {/* استخدام كلاس btn-primary */}
                </div>             
            </div>
            <p>Description: {animal.description}</p>
            <p>Price: {animal.price} $</p>
            <p>Category: {animal.category.categoryName}</p>
            {/* يمكنك عرض المزيد من التفاصيل هنا */}
        </div>
    );
};

export default AnimalDetails;