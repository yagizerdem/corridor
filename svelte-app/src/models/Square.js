export class Square {
  constructor({
    item,
    row,
    col,
    isLeftBlocked,
    isRightBlocked,
    isTopBlocked,
    isBottomBlocked,
  }) {
    this.item = item; // piece or null
    this.row = row;
    this.col = col;
    this.isLeftBlocked = isLeftBlocked;
    this.isRightBlocked = isRightBlocked;
    this.isTopBlocked = isTopBlocked;
    this.isBottomBlocked = isBottomBlocked;
  }
}
