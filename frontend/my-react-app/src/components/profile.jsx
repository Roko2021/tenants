import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // استيراد axios
import { toast } from 'react-toastify'; // استيراد toast


export default function Profile() {
    const navigate = useNavigate();
    
    const jwt_access = localStorage.getItem('access');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    // حالة لتخزين بيانات المستخدم المسترجعة من الـ API
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (!jwt_access) {
            navigate("/login");
            return;
        }
    
        fetch("http://localhost:8000/api/v1/auth/profile/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt_access
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP Error " + res.status);
            }
            return res.json();
        })
        .then(data => {
            // تخزين البيانات في الـ state
            setProfileData(data);
        })
        .catch(err => console.error(err));
    }, [jwt_access, navigate]);


    
    
    
    
    const handleLogout = async () => {
        const access_token = localStorage.getItem('access');
        const refresh_token = localStorage.getItem('refresh');
    
        if (!refresh_token) {
            toast.error("No refresh token found. Please login again.");
            navigate('/login');
            return;
        }
    
        try {
            // محاولة تسجيل الخروج مباشرة
            const response = await axios.post(
                'http://localhost:8000/api/v1/auth/logout/',
                { 'refresh': refresh_token },
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 204) {
                clearUserData();
                toast.success("Logged out successfully.");
                navigate('/login');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // إذا فشل تسجيل الخروج بسبب توكن غير صالح، قم بتنظيف البيانات وأعد التوجيه
                clearUserData();
                toast.success("Logged out succefully")
                // toast.error("Session expired. Please login again.");
                navigate('/login');
            } else {
                console.error("Logout error:", error);
                toast.error("Logout failed. Please try again.");
            }
        }
    };
    
    const clearUserData = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
    };

    

    
    
    

    return (
        <div className="text-center mt-12">
            <h2 className="text-xl font-bold">Hi {user?.names}</h2>
            <p className="text-gray-600">{user?.email}</p>
            {/* عرض الـ id إذا كانت بيانات المستخدم موجودة */}
            <p className="text-gray-600">{profileData?.id}</p>
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
            {/* <img src={user?.picture} alt="profile" className="w-24 h-24 rounded-full mx-auto mt-4" /> */}
        </div>
    );
}
