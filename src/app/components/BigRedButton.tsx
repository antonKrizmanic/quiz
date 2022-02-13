import { FC, FormEventHandler } from 'react';
interface IProps {
    href: string
}
const BigRedButton: FC<IProps> = ({ href, children }) => {
    return (
        <a href={href}
            className="border border-red-500 text-red-500 text-center rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-red-600 focus:outline-none focus:shadow-outline" >
            {children}
        </a >
    );

};

export default BigRedButton;