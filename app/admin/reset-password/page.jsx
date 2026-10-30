import PasswordResetForm from '../../../components/PasswordResetForm';
export const metadata={title:'Choose New CMS Password',robots:{index:false,follow:false}};
export default function Page(){return <div className="adminLogin"><div className="loginCard"><div className="loginBrand">UNTENANTED HEART<small>CMS</small></div><h1>Choose New Password</h1><p className="loginIntro">Use the recovery link from your email to set a new CMS password.</p><PasswordResetForm variant="admin" successHref="/admin/login" successLabel="Return to admin login" requestHref="/admin/forgot-password"/></div></div>}
