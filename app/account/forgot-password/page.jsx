import PasswordResetRequest from '../../../components/PasswordResetRequest';
export const metadata={title:'Reset Password',robots:{index:false,follow:false}};
export default function Page(){return <><section className="simpleHero"><small>Account Recovery</small><h1>Reset your password.</h1><p>Enter the email connected to your Untenanted Heart account. We will send a secure recovery link.</p></section><section className="section"><div className="accountWrap"><div className="memberAuth"><PasswordResetRequest/></div></div></section></>}
