import { redirect } from 'next/navigation';

function SignUpPage() {
    redirect('/login?tab=signup');
}

export default SignUpPage;

