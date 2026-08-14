import Logo from '../assets/logo-2.png'
import Profile from '../assets/profile-test.png'
const Header = () => {
    return (
        <div className='flex items-center justify-between p-[5px] bg-theme text-white'>
            <div className='flex items-center'>
                <img src={Logo}
                    className='w-[50px]'
                />
                <div className="text-2xl opacity-100 font-bold  mb-[-10px] ml-[-3px]">arag Clinic</div>
            </div>

            <div>
                <div>
                    <img src={Profile}
                        className='w-[45px] aspect-square object-cover rounded-full border-[2px]'
                    />
                </div>
            </div>
        </div>
    )
}

export default Header