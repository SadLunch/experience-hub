import { Link } from 'react-router-dom';

const HomeScreen = () => {

    return (
        <div className="min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0">
            <h1 className="text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontTitle">J-U-S-T-I-Ç-A À CHIADO</h1>
            <div className='grid grid-cols-1 gap-8 px-4 min-w-[90vw]'>
                <Link to={'/hidden/website/experiences'} className='block border border-[#5690CC] rounded-xl active:bg-[#5690CC] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>Introdução</h2>
                </Link>
                <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>TBD</h2>
                </Link>
                <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>TBD</h2>
                </Link>
                <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>Sobre Nós</h2>
                </Link>
            </div>
        </div>
    )
}

export default HomeScreen;