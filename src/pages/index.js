import Head from 'next/head'
import Image from "next/image";
import {useEffect, useState} from "react";
import {login} from "@/helpers/api_calls/login";
import {useAtom} from "jotai";
import {user} from "../atoms/user";
import {useRouter} from "next/router";
import Link from "next/link";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [atomUser, setAtomUser] = useAtom(user);

    const router = useRouter();

    useEffect(() => {
        const myCreds = localStorage.getItem('user');
        if (myCreds) {
            setAtomUser(JSON.parse(myCreds));
            router.push('/favorites');
        }
    }, []);

    async function loginHandler(e) {
        e.preventDefault();

        const result = await login({email, password});

        if(!result){
            setError("Login Failed!");
            return;
        }else{
            localStorage.setItem("user", JSON.stringify(result));
            setAtomUser(result);
            await router.push('/favorites');
        }

    }

    return (
        <>
            <Head>
                <title>Pokemon Test</title>
                <meta name="description" content="Pokemon Test - Login"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <main className={'min-h-[39rem] flex items-center pt-[3rem] px-3 h-screen flex-col'}>
                <h1 className={'text-4xl text-white mb-5'}>Welcome to</h1>
                <Image src={'/header-01.png'} width={500} height={250} alt={'Header'}/>
                <div className={'lg:w-1/4 w-full bg-white rounded-2xl px-5 py-10 '}>
                    {
                        error ? <p className={'p-3 rounded-lg mb-3 text-white bg-red-400'}>{error}</p> : null
                    }
                    <form className={'flex flex-col'} onSubmit={loginHandler}>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                               className={'w-full rounded-lg px-3 border-slate-700 border-2 h-10 mb-3'} id={'email'}
                               type={'email'} placeholder={'Email: '}/>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                               className={'w-full rounded-lg px-3 border-slate-700 border-2 h-10 mb-3'} id={'password'}
                               type={'password'} placeholder={'Password: '}/>
                        <button type={'submit'} className={'text-white px-5 py-2 rounded-lg bg-slate-900'}>
                            Login
                        </button>
                        <span>If you are new please <Link className={'text-slate-900 text-center mt-3 font-bold'} href={'/register'}>Create Account</Link></span>
                    </form>
                </div>
            </main>
        </>
    )
}
