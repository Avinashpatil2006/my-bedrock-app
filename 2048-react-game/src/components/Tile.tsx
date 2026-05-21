import type { FC } from 'react';

interface TileProps {
  value: number;
}

/**
 * Individual tile component displaying a number
 */
export const Tile: FC<TileProps> = ({ value }) => {
  const getTileColor = (val: number): string => {
    const colors: Record<number, string> = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[val] || '#3c3a32';
  };

  const getTextColor = (val: number): string => {
    return val <= 4 ? '#776e65' : '#f9f6f2';
  };

  const getFontSize = (val: number): string => {
    if (val < 100) return '3.5rem';
    if (val < 1000) return '3rem';
    if (val < 10000) return '2.5rem';
    return '2rem';
  };

  if (value === 0) {
    return <div className="tile tile-empty" />;
  }

  return (
    <div
      className="tile"
      style={{
        backgroundColor: getTileColor(value),
        color: getTextColor(value),
        fontSize: getFontSize(value),
      }}
    >
      {value}
    </div>
  );
};
