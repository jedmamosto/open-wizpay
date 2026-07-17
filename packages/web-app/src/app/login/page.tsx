import Login from './login';

export const dynamic = 'force-dynamic';

function LoginPage() {
    const isDefaultCredentials = !process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD;

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#00180c] bg-[radial-gradient(circle_at_center,_#112f21_0%,_#00180c_70%)] p-4 overflow-hidden">
            <Login isDefaultCredentials={isDefaultCredentials} />
        </div>
    );
}

export default LoginPage;
