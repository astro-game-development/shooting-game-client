import { Tile } from '../helpers';

const TileView = ({ tile }: { tile: Tile }) => {
  // 1. title
  // 2. tile#
  // 3. position_#_#
  // 4. row_from_#_to_#
  // 5. col_from_#_to_#
  // 6. ismoving
  // 7. new
  // 8. merge
  var classArray = ['tile'];
  classArray.push('tile' + tile.value);
  if (!tile.mergedInto) {
    classArray.push('position_' + tile.row + '_' + tile.column);
  }
  if (tile.mergedInto) {
    classArray.push('merged');
  }
  if (tile.isNew()) {
    classArray.push('new');
  }
  if (tile.hasMoved()) {
    classArray.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow());
    classArray.push(
      'column_from_' + tile.fromColumn() + '_to_' + tile.toColumn()
    );
    classArray.push('isMoving');
  }
  var classes = classArray.join(' ');
  // classArray.push(`tile${tile.value}`);
  return <span className={classes}></span>;
};

export default TileView;
