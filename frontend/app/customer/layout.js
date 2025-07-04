"use client"
import { useGetUserByIdQuery } from '@/features/userApiSlice';
import { useParams } from "next/navigation";
import CustomerNav from '../Components/CustomerNav';
import WomenSallonCard from '../Components/WomenSallonCard';


export default function Home({ children }) {
    const params = useParams();
    const id = params?.userId;
    const { data } = useGetUserByIdQuery(id);
    const user = data?.user;
    const name = user?.name;

    console.log(user);

    return (
        <div>
            <CustomerNav user={user} />
            {/* Main Content */}
            <div
                className={`flex-grow  transition-all duration-300 ? "ml-73" : "ml-23"
        }`}
            >
                {children}
            </div>

            <WomenSallonCard user={user} />
        </div>

    );
}