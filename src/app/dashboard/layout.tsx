import { ReactNode } from "react";
import { Navbar } from "./_components/Navbar";

export default function Dashboard({children}:{children:ReactNode}){
    return (
        <div className="bg-accent/5 min-h-screen">
            <Navbar/>
            <div className="py-6">
                {children}
            </div>
        </div>
    )
}