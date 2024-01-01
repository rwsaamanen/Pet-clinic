import { Link } from "react-router-dom"
import { Logo } from "../logo"

const Navbar = () => {
    const user = true;

    return (
        <div className="border-b border-neutral-200">
            <div className="wrapperNav z-50 bg-secondary sticky top-0 flex items-center w-full p-6">
                <Logo />
                <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <button className="rounded-md text-sm font-semibold p-1 px-2 text-neutral-900 transition-all hover:bg-neutral-200">
                                    Enter to PetVet
                                </button>
                            </Link>
                            <Link to="/">
                                <button className="rounded-md text-sm font-semibold p-1 px-2 transition-all text-white bg-black hover:bg-neutral-700">
                                    Sign Out
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="rounded-md text-sm font-semibold p-1 px-2 text-neutral-900 transition-all hover:bg-neutral-200">
                                    Login
                                </button>
                            </Link>
                            <Link to="/sign-up">
                                <button className="rounded-md text-sm font-semibold p-1 px-2 transition-all text-white bg-black hover:bg-neutral-700">
                                    Sign Up
                                </button>
                            </Link></>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar