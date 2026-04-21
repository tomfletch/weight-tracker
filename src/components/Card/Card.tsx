import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>;
}

type CardTitleProps = {
  children: React.ReactNode;
};

function CardTitle({ children }: CardTitleProps) {
  return <div className={styles.cardTitle}>{children}</div>;
}

Card.Title = CardTitle;
