import Link from "next/link";
import {useAtom} from "jotai";
import {user} from "../atoms/user";
import {useRouter} from "next/router";

export default function Navbar() {

    const [atomUser, setAtomUser] = useAtom(user);

    const router = useRouter();

    async function logoutHandler() {
        localStorage.removeItem("user");
        setAtomUser({});
        await router.push('/');

    }

    return (
        <div className={'bg-slate-800'}>
            <ul className={`h-20 flex items-center justify-between lg:px-14 px-5 space-x-5`}>
                {
                    atomUser && Object.keys(atomUser).length > 0 ?
                        <>
                           <div  className={'flex space-x-5'}>
                               <li className={'text-white lg:text-lg '}>
                                   <Link href={'/pokemon'}>
                                       Home
                                   </Link>
                               </li>
                               <li className={'text-white text-lg'}>
                                   <Link href={'/favorites'}>
                                       Favorites
                                   </Link>
                               </li>
                               <li className={'text-white text-lg'}>
                                   <Link href={'/teams'}>
                                       Teams
                                   </Link>
                               </li>
                           </div>
                            <li className={'text-white text-lg'}>
                                <button onClick={logoutHandler} className={'text-white lg:text-lg'}>Logout
                                </button>
                            </li>
                        </> : <>
                            <li className={'text-white lg:text-lg '}>
                                <Link href={'/pokemon'}>
                                    Home
                                </Link>
                            </li>
                            <li className={'text-white lg:text-lg '}>
                                <Link href={'/'}>
                                    Login
                                </Link>
                            </li>
                        </>
                }
            </ul>
        </div>
    );
}