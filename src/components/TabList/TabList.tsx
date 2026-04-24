import styles from './TabList.module.css';

type TabListProps = {
  children: React.ReactNode;
};

export function TabList({ children }: TabListProps) {
  return (
    <div role="tablist" className={styles.tabList}>
      {children}
    </div>
  );
}

type TabProps = {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect: () => void;
  controls: string;
};

TabList.Tab = function Tab({
  children,
  isActive,
  onSelect,
  controls,
}: TabProps) {
  return (
    <button
      role="tab"
      type="button"
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
      aria-selected={isActive}
      aria-controls={controls}
    >
      {children}
    </button>
  );
};
