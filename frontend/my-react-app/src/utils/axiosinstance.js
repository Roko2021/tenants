
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";


// const token = localStorage.getItem('access') ? JSON.parse(localStorage.getItme('access')) : "";
// const refresh_token = localStorage.getItem('refresh') ? JSON.parse(localStorage.getItme('refresh')) : "";

// const baseUrl = "http://localhost:8000/api/v1";

// const axiosInstance = axios.create({
//     baseURL: baseUrl,
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: localStorage.getItem('access') ? `Bearer ${localStorage.getItem('access')}` : null,
//     },
// });



// export default axiosInstance;





import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const baseUrl = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('access') ? `Bearer ${localStorage.getItem('access')}` : null,
    },
});

axiosInstance.interceptors.request.use(async (req) => {
    const token = localStorage.getItem('access');
    const refresh_token = localStorage.getItem('refresh');

    let user = null;

    try {
        if (token && token.split('.').length === 3) {
            user = jwtDecode(token);
        }
    } catch (err) {
        console.error("Invalid token:", err);
    }

    if (user) {
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
            req.headers.Authorization = `Bearer ${token}`;
            return req;
        }

        try {
            const res = await axios.post(`${baseUrl}/auth/token/refresh/`, {
                refresh: refresh_token,
            });

            if (res.status === 200) {
                localStorage.setItem('access', res.data.access);
                req.headers.Authorization = `Bearer ${res.data.access}`;
                return req;
            }
        } catch (err) {
            console.error("Refresh token failed:", err);
            try {
                await axios.post(`${baseUrl}/auth/logout`, { refresh_token });
            } catch (logoutErr) {
                console.error("Logout failed:", logoutErr);
            }

            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
        }
    }

    return req;
});

export default axiosInstance;
