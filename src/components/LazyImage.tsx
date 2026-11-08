import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  id: number;
};

const LazyImage = ({ src, alt, className, id }: LazyImageProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { // destructing, lấy phần tử đầu tiên
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.7,
      }
    );

    if (frameRef.current) {
      observer.observe(frameRef.current);
    }

    return () => {
      if (frameRef.current) {
        observer.unobserve(frameRef.current);
      }
    };
  }, []);

  return (
    <div ref={frameRef} className={className}>
      {isVisible ? (
        <>
          <div className="h-48">
            <img src={src} alt={alt} loading="lazy" />
          </div>
          <Link to={`/dashboards/${id}`}>
            <Button variant="outlined" style={{ marginTop: 8 }}>
              View Details
            </Button>
          </Link>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};


export default LazyImage;