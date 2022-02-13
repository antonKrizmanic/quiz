import { FC } from 'react';
import { Link } from 'react-router-dom';
interface IProps {
    href: string
}
const RedButton: FC<IProps> = ({ href, children }) => {
    return (
        <Link to={href}
            className="border border-red-500 text-red-500 text-center rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-red-600 focus:outline-none focus:shadow-outline">
            {children}
        </Link >
    );

};

export default RedButton;