import Login from "@/dashboardComponents/login/Login";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home(){
    const session = await getServerSession(options);

    if(session){
        redirect("/dashboard")
    }
    return(
        <main>
            <Login />
        </main>
    )
}