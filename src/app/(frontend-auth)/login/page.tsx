import { getServerSession } from 'next-auth';
import Form from './Form';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return <Form />;
}
