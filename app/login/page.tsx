import Navbar from './navbar'
import LoginForm from './loginform'
import Footer from '../footer'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col from-gray-100 to-gray-200 text-gray-900 bg-[url('/images/login_bg.jpg')] bg-center bg-no-repeat bg-cover" >
            <Navbar />
            <main className="flex-grow bg-black/40 backdrop-brightness-90 flex justify-center items-center">
                <LoginForm />
            </main>
        </div>
    );
}
