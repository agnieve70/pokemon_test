import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {user} from "@/atoms/user";
import Head from "next/head";
import Image from "next/image";
import {FolderPlusIcon, XMarkIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {addTeam, deleteTeam, myTeams} from "@/helpers/api_calls/teams/myTeam";
import {teams} from "@/atoms/teams";

export default function TeamsPage(props) {

    const [atomUser, setAtomUser] = useAtom(user);
    const [atomTeams, setAtomTeams] = useAtom(teams);
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [addedTeam, setAddedTeam] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {

        (async () => {
            const myCreds = localStorage.getItem('user');

            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
            } else {
                await router.push('/');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const result = await myTeams();
            setAtomTeams(result);
            setIsLoading(false);
        })();
    }, [addedTeam]);

    async function addTeamHandler() {
        const result = await addTeam({
            name: name
        });
        setAddedTeam(result);

        setModalOpen(false);
    }

    async function removeTeamHandler(id) {
        const result = await deleteTeam(id);
        setAddedTeam(result);
    }

    return (
        <>
            <Head>
                <title>Pokemon Test - Teams</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <div className={'flex items-center justify-center flex-col'}>
                <div className={''}>
                    <Image className={'h-auto w-auto mb-3'} alt={'header2'} src={'/header4-01.png'} width={500}
                           height={150}/>
                </div>
                <div className={'min-h-[39rem] w-3/4 relative'}>

                    <div
                        className={`w-1/4 absolute transform translate-x-1/2 left-1/4  bg-white z-20 rounded-2xl p-5 shadow-2xl ${!modalOpen ? 'hidden' : ''}`}>
                        <div className="flex justify-between items-center">
                            <h1 className={'text-2xl'}>Add Team</h1>
                            <button onClick={() => setModalOpen(false)}>
                                <XMarkIcon
                                    className={`m-2 h-6 w-6 text-slate-900`}/>
                            </button>
                        </div>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={'Team Name'}
                               className={'w-full border-2 border-slate-900 rounded-lg h-10 px-3'}/>
                        <button onClick={addTeamHandler}
                                className={'bg-slate-900 text-white rounded-lg px-3 py-2 mt-3'}>Add Team
                        </button>
                    </div>

                    <div className="lg:w-3/4 w-full flex">
                        <button onClick={() => setModalOpen(true)}
                                className={'m-2 lg:w-1/5 w-full bg-slate-800 rounded-lg py-10 flex items-center justify-center hover:shadow-lg hover:border-2 border-slate-700'}>
                            <FolderPlusIcon
                                className={`m-2 h-20 w-20 text-white`}/>
                        </button>
                        {
                            isLoading ?
                                <div className="flex items-center justify-center">
                                    <Image className={'animate-bounce-slow h-auto lg:w-auto w-full mt-5'}
                                           alt={'loading'}
                                           src={'/loading-01.png'}
                                           width={150} height={100}/>
                                </div>
                                :
                                atomTeams && atomTeams.length > 0 ? atomTeams?.map((team, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={'relative m-2 lg:w-1/5 w-full bg-slate-800 rounded-lg hover:shadow-lg hover:border-2 border-slate-700'}>
                                            <button onClick={removeTeamHandler.bind(this, team._id)}>
                                                <XMarkIcon
                                                    className={`m-2 h-6 w-6 text-slate-900 absolute top-0 right-0`}/>
                                            </button>
                                            <Link href={`/teams/${team._id}?name=${team.name}`}
                                                  className={'py-10 flex items-start justify-center w-full h-full'}>
                                                <h1 className={'text-2xl text-white'}>{team.name}</h1>
                                            </Link>
                                        </div>
                                    );
                                }) : <div className={''}>
                                    <p className={'text-white m-20'}>No Pokemon available</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}