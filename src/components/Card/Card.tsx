import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section className={`${styles.card} ${className || ''}`}>
      {children}
    </section>
  );
}

type CardTitleProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

function CardTitle({ children, as: Component = 'h2' }: CardTitleProps) {
  return <Component className={styles.cardTitle}>{children}</Component>;
}

Card.Title = CardTitle;
