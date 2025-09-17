import React from 'react';

interface IconProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ src, alt, size = 20, className }) => {
    return <img src={src} alt={alt} width={size} height={size} className={className} />;
};

export default Icon;
