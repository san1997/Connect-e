import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${BASE_URL}/logincheck`, {
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.isAuthenticated) {
                    navigate("/home", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.log("Authentication check failed", error);
                navigate("/", { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);
};

export default useAuthCheck;
