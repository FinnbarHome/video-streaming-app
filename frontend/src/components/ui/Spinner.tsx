import React from 'react';
import styles from './Spinner.module.css';

type Props = {
  label?: string;
};

const Spinner: React.FC<Props> = ({ label }) => {
  return (
    <div className={styles.wrap} aria-label={label ?? 'Loading'}>
      <div className={styles.spinner} />
    </div>
  );
};

export default Spinner;
