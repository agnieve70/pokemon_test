import Navbar from "@/components/navbar";


export default function Layout(props) {

    const {children} = props;

    return (
        <div className={'h-screen w-full bg-slate-900'}>
            <Navbar/>
            <div className="bg-slate-900">
                {children}
            </div>
            <footer className={'h-20 bg-slate-800 flex items-center justify-center text-white'}>
                © {new Date().getFullYear()}, Built with
                {` Next JS By AG Nieve`}
            </footer>
        </div>

    )
}