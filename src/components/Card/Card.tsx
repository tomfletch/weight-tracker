import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <section className={clsx(styles.card, className)}>{children}</section>;
}

type CardTitleProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
};

function CardTitle({
  children,
  as: Component = 'h2',
  className,
}: CardTitleProps) {
  return (
    <Component className={clsx(styles.cardTitle, className)}>
      {children}
    </Component>
  );
}

Card.Title = CardTitle;
