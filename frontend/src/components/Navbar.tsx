
import { NavLink } from 'react-router'
import { Button } from './ui/button'

function Navbar() {
    return (
        <nav className="py-5 dark:border-b border-gray-700 md:py-0 flex md:flex-row gap-4 md:gap-0 flex-col md:h-14 justify-around items-center ">

            <div className="font-semibold items-center flex gap-2">
                <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40">
                    {"SD"}
                </span>
                <span className="text-base tracking-tight"> Auth App</span>
            </div>

            <div className="flex gap-4 items-center-safe">

                <NavLink to="/home">
                    <Button size={"sm"} className="cursor-pointer" variant={"outline"}>Home</Button>
                </NavLink>
                <a href="#!"></a>
                <NavLink to="/login">
                    <Button size={"sm"} className="cursor-pointer" variant={"outline"}>Login</Button>
                </NavLink>
                <NavLink to="/signup">
                    <Button size={"sm"} className="cursor-pointer" variant={"outline"}>Signup</Button>
                </NavLink>

            </div>
        </nav>
    )
}

export default Navbar
