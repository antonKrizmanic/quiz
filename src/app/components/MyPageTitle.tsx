import { FC, FormEventHandler } from 'react';
interface IProps {

}
const MyPageTitle: FC<IProps> = ({ children }) => {
    return (
        <h1 className="text-3xl text-center font-bold px-2">
            {children}
        </h1>
    );

};

export default MyPageTitle;