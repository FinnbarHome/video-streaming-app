import React from 'react';
import styles from './InlineAlert.module.css';

type Props = {
  title?: string;
  message: string;
  variant?: 'default' | 'danger';
};

const InlineAlert: React.FC<Props> = ({
  title,
  message,
  variant = 'default',
}) => {
  const className = `${styles.alert} ${variant === 'danger' ? styles.danger : ''}`;

  return (
    <div className={className} role="status">
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default InlineAlert;
