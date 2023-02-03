
import Head from 'next/head'
import Image from "next/image";
import {useEffect, useState} from "react";
import {register} from "../helpers/api_calls/register";
import {useAtom} from "jotai";
import {user} from "../atoms/user";
import {useRouter} from "next/router";
import Link from "next/link";

export default function RegisterPage() {

    const [atomUser, setAtomUser] = useAtom(user);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const myCreds = localStorage.getItem('user');
            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
                await router.push('/favorites');
            }
        })();
    }, []);

    async function registerHandler(e) {
        e.preventDefault();

        const result = await register({name, email, password});

        if(!result){
            setError("Registration Failed");
            return;
        }else{
            setSuccess(true);
        }

    }

    return (
        <>
            <Head>
                <title>Pokemon Test</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <main className={'flex items-center pt-[3rem] px-3 h-screen flex-col'}>
                <h1 className={'text-4xl text-white mb-5'}>Welcome to</h1>
                <Image src={'/header-01.png'} width={500} height={250} alt={'Header'}/>
                <div className={'lg:w-1/4 w-full bg-white rounded-2xl px-5 py-10 '}>
                    {
                        error ? <p className={'p-3 rounded-lg mb-3 text-white bg-red-400'}>{error}</p> : null
                    }
                    {
                        success? <p className={'p-3 rounded-lg mb-3 text-white bg-green-400'}>You have successfully Create an Account!</p> :null
                    }
                    <form className={'flex flex-col'} onSubmit={registerHandler}>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                               className={'w-full rounded-lg px-3 border-slate-700 border-2 h-10 mb-3'} id={'name'}
                               type={'name'} placeholder={'Your Name: '}/>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                               className={'w-full rounded-lg px-3 border-slate-700 border-2 h-10 mb-3'} id={'email'}
                               type={'email'} placeholder={'Email: '}/>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                               className={'w-full rounded-lg px-3 border-slate-700 border-2 h-10 mb-3'} id={'password'}
                               type={'password'} placeholder={'Password: '}/>
                        <button type={'submit'} className={'text-white px-5 py-2 rounded-lg bg-slate-900'}>
                            Register
                        </button>
                        <span>If you already have account <Link className={'text-slate-900 text-center mt-3 font-bold'} href={'/'}>Login</Link></span>
                    </form>
                </div>
            </main>
        </>
    )
}
