import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to learner login by default
  redirect('/login');
}

