import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className='min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10'>
            <h1 className='text-3xl font-bold mb-6'>Home Screen</h1>
            <p className='text-gray-400 mb-6 text-center'> This the initial screen of the test website. From here you can access the prototype final website and the testing website.</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4'>
                <motion.div
                key="website"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0}}
                >
                    <Link to="/hidden/website" className='block bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition'>
                        <h2 className='text-xl font-semibold'>Prototype Final Website 1</h2>
                    </Link>
                </motion.div>
                <motion.div
                key="website"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0}}
                >
                    <Link to="/hidden/website/v2" className='block bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition'>
                        <h2 className='text-xl font-semibold'>Prototype Final Website 2</h2>
                    </Link>
                </motion.div>
                <motion.div
                key="testing"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1}}
                >
                    <Link to="/testing" className='block bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition'>
                        <h2 className='text-xl font-semibold'>Testing Website</h2>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;