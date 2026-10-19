'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import NewsletterSignup from './NewsletterSignup';

export default function Footer({navItems=[],tagline='Words for the feelings you could not name.',instagram='https://www.instagram.com/untenanted_heart/'}){
 const path=usePathname();if(path?.startsWith('/admin'))return null;
 return <footer className="footer siteFooter">
   <div className="footerNewsletter"><NewsletterSignup compact/></div>
   <div className="footerGrid">
     <div className="footerBrandCol"><div className="footerLogo">UNTENANTED HEART</div><p>{tagline}</p><span>Read slowly. Stay as long as you need.</span></div>
     <div><b>Explore</b><Link href="/stories">Stories</Link><Link href="/letters">Letters Never Sent</Link><Link href="/community">Community</Link><Link href="/collections">Collections</Link></div>
     <div><b>For You</b><Link href="/daily">Daily Reflection</Link><Link href="/for-you">Personalised Reading</Link><Link href="/saved">Saved Reflections</Link><Link href="/search">Search</Link></div>
     <div><b>Take Part</b><Link href="/submit-message">Leave a Message</Link><Link href="/submit-story">Submit Your Story</Link><Link href="/account">My Heart</Link><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></div>
   </div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Untenanted Heart</span><span>A digital sanctuary for unspoken stories.</span></div>
 </footer>
}
