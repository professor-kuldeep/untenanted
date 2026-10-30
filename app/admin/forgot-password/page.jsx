import PasswordResetRequest from '../../../components/PasswordResetRequest';
export const metadata={title:'Reset CMS Password',robots:{index:false,follow:false}};
export default function Page(){return <div className="adminLogin"><div className="loginCard"><div className="loginBrand">UNTENANTED HEART<small>CMS</small></div><h1>Reset Password</h1><p className="loginIntro">Enter your CMS email and we will send a secure recovery link.</p><PasswordResetRequest variant="admin" redirectPath="/admin/reset-password" backHref="/admin/login" backLabel="Back to admin login"/></div></div>}
