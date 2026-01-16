import { CreativeCommons, Home, HomeIcon, List, ShareIcon } from "lucide-react";
import IconNavbar from "./IconNavbar";

export default function Asside() {
    return (
        <aside className="w-96 bg-zinc-950 p-6">
            <nav className="space-y-5 mt-10">
                <IconNavbar text={"home"}>
                    <Home />
                </IconNavbar>
                <IconNavbar text={"Buscar"}>
                    <ShareIcon />
                </IconNavbar>

                <IconNavbar text={"Criar"}>
                    <CreativeCommons />
                </IconNavbar>
                <IconNavbar text={"list"}>
                    <List />
                </IconNavbar>
            </nav>
            <div>
                sovbre o site
            </div>


        </aside>
    )
}