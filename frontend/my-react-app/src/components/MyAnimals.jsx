import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // استيراد الـ context الخاص بالمصادقة
import { Link } from 'react-router-dom';

const MyAnimals = () => {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const [animals, setAnimals] = useState([]);
    const [loadingAnimals, setLoadingAnimals] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated || loading) return;

        const fetchMyAnimals = async () => {
            setLoadingAnimals(true);
            try {
                const token = localStorage.getItem('access');
                const response = await axios.get('http://localhost:8000/animal/my-animals/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAnimals(response.data);
                setLoadingAnimals(false);
            } catch (err) {
                console.error('Error fetching user animals:', err);
                setError('Failed to load your animals.');
                setLoadingAnimals(false);
            }
        };

        fetchMyAnimals();
    }, [isAuthenticated, loading]);

    const handleDelete = async (animalId) => {
        const token = localStorage.getItem('access');
        try {
            await axios.post(`http://localhost:8000/animal/${animalId}/delete/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // تحديث حالة الواجهة الأمامية لإزالة الحيوان المحذوف
            setAnimals(prevAnimals => prevAnimals.filter(animal => animal.id !== animalId));
        } catch (err) {
            console.error('Error deleting animal:', err);
            setError('Failed to delete the animal.');
        }
    };

    if (!isAuthenticated) {
        return <p>Please login to see your animals.</p>;
    }

    if (loadingAnimals) {
        return <p>Loading your animals...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (animals.length === 0) {
        return <p>You have no animals listed.</p>;
    }

    return (
        <div>
            <h2>My Animals</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {animals.map(animal => (
                    <li key={animal.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Link to={`/animal/${animal.id}`} style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>
                                {animal.title}
                            </Link>
                            {animal.imageFile && (
                                <div>
                                    <img src={animal.imageFile} alt={animal.title} style={{ maxWidth: '200px', marginTop: '5px' }} />
                                </div>
                            )}
                            <p>{animal.description}</p>
                            <p>Price: {animal.price}</p>
                            <p>Category: {animal.category?.categoryName}</p>
                        </div>
                        <button onClick={() => handleDelete(animal.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyAnimals;