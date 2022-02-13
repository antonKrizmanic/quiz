import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate(-1);
    };

    return (
        <>
            <h1>Stranica nije pronađena!</h1>
            <button
                className="border border-red-500 text-red-500 text-center rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-red-600 focus:outline-none focus:shadow-outline"
                onClick={navigateBack}>Nazad</button>
        </>
    );
};

export default NotFound;