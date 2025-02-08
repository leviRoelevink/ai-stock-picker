import Image from 'next/image';
import loaderCircle from '../../../public/loader-circle.svg';

export default function LoadingIcon({ className }) {
    return (
        <Image
            src={loaderCircle}
            alt="Loading..."
            className={`animate-spin ${className || ''}`}
            width={24}
            height={24}
        />
    );
}