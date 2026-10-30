import PasswordResetForm from '../../../components/PasswordResetForm';
export const metadata={title:'Choose New Password',robots:{index:false,follow:false}};
export default function Page(){return <><section className="simpleHero"><small>Account Recovery</small><h1>Choose a new password.</h1><p>This page only accepts a valid password-recovery session from your email link.</p></section><section className="section"><div className="accountWrap"><div className="memberAuth"><PasswordResetForm/></div></div></section></>}
