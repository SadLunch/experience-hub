import { Link } from 'react-router-dom';
import image from '../../assets/logo.png';
import BackButton from '../../components/BackButton';

const FirstScreen = () => {

    return (
        <div className="min-h-screen w-screen bg-black flex flex-col items-center justify-center py-10">
            <h1 className="text-3xl text-[#E6E518] font-bold mb-12 font-fontTitle">J-U-S-T-I-Ç-A À CHIADO</h1>
            <img src={image} alt='Title image' className='mb-6' />
            <h3 className='text-sm text-[#5690CC] font-bold mb-6 font-fontBtnMenus'>Are you ready?</h3>
            <div className='grid grid-cols-2 gap-[4rem] px-4'>
                <Link to={'/hidden/website/home'} className='block'>
                    <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>YES</h2>
                </Link>
                <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>NO</h2>
            </div>
            <BackButton to='/' />
        </div>
    )
}

export default FirstScreen;