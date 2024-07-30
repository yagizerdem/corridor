<script>
import {Square} from './models/Square';
import {Piece} from './models/Piece';
import {notifications} from './notification'
import Toast from './Toast.svelte'

let board = []


for(let i = 0 ; i < 9 ;i++){
    const row = []
    for(let j = 0 ; j < 9 ; j++){
        row.push(new Square({item:null , row:i ,col:j , isTopBlocked :false ,  isRightBlocked:false,isBottomBlocked :false , isLeftBlocked :false}))
    }
    board.push(row)
}
const blackPiece = new Piece(Piece.colorBlack , 0 , 4)
const whitePiece = new Piece(Piece.colorWhite , 8 ,4)
board[blackPiece.row][blackPiece.col].item = blackPiece
board[whitePiece.row][whitePiece.col].item = whitePiece

let selectedPiece = null
let turn = Piece.colorWhite


function onSquareClick(rowindex , colindex){
	const targetSquare = board[rowindex][colindex]
	if(targetSquare.item) return
	if(!selectedPiece){
		notifications.warning('Selecte Piece ...', 1000)
		return
	}


	const diffRow = rowindex - selectedPiece.row
	const diffCol = colindex - selectedPiece.col
	const diff = Math.hypot(diffRow , diffCol )
	if(diff != 1) {
		notifications.warning('invalid move', 1000)
		return
	}

	const pieceSquare = board[selectedPiece.row][selectedPiece.col]

	// validation
	if(diffRow == -1  && pieceSquare.isTopBlocked){
			notifications.warning('invalid move', 1000)
			return
		}
	else if(diffRow == 1  && pieceSquare.isBottomBlocked){
			notifications.warning('invalid move', 1000)
			return
		}
	else if(diffCol == -1 && pieceSquare.isRightBlocked){
		notifications.warning('invalid move', 1000)
		return
	} 
	else if(diffCol == 1 && pieceSquare.isLeftBlocked){
		notifications.warning('invalid move', 1000)
		return
	} 

	// remvoe from old positon
	board[selectedPiece.row][selectedPiece.col].item = null

	// move
	board[rowindex][colindex].item = selectedPiece
	selectedPiece.row = rowindex
	selectedPiece.col = colindex
	selectedPiece = null
	turn = !turn

	

	for(var i = 0 ; i < board[0].length ; i++){
		if(board[0][i].item instanceof Piece && board[0][i].item.color == Piece.colorWhite ){
			notifications.success('white wins', 5000)
		}
		if(board[8][i].item instanceof Piece && board[8][i].item.color == Piece.colorBlack ){
			notifications.success('black wins', 5000)
		}
	}


}
function onSelectPiece(piece){
	if(turn != piece.color){
		notifications.warning('Cant select wrong color ...', 1000)
		return
	}
	selectedPiece = piece
}


function addWallHorizontal(rowindex , colindex){

	if(colindex == board[0].length -1){
		notifications.danger("invalid wall palcement" ,1000)
		return
	}
	const deepCopyBoard = JSON.parse(JSON.stringify(board))
	
	const targetSquare1 = deepCopyBoard[rowindex][colindex]
	const targetSquare2 = deepCopyBoard[rowindex][colindex+1]

	if(targetSquare1.isBottomBlocked || targetSquare2.isBottomBlocked){
		notifications.danger("invalid wall palcement" ,1000)
		return
	}

	const targetSquare3 = deepCopyBoard[rowindex+1][colindex]
	const targetSquare4 = deepCopyBoard[rowindex+1][colindex+1]


	targetSquare1.isBottomBlocked = true
	targetSquare2.isBottomBlocked = true
	targetSquare3.isTopBlocked = true
	targetSquare4.isTopBlocked = true


	deepCopyBoard[blackPiece.row][blackPiece.col].item = blackPiece
	deepCopyBoard[whitePiece.row][whitePiece.col].item = whitePiece

	board = deepCopyBoard

	
	turn = !turn

}
function addWallVertical(rowindex , colindex){
	if(rowindex == board.length -1){
		notifications.danger("invalid wall palcement" ,1000)
		return
	}
	const deepCopyBoard = JSON.parse(JSON.stringify(board))
	
	const targetSquare1 = deepCopyBoard[rowindex][colindex]
	const targetSquare2 = deepCopyBoard[rowindex+1][colindex]

	if(targetSquare1.isBottomBlocked || targetSquare2.isBottomBlocked){
		notifications.danger("invalid wall palcement" ,1000)
		return
	}

	const targetSquare3 = deepCopyBoard[rowindex][colindex+1]
	const targetSquare4 = deepCopyBoard[rowindex+1][colindex+1]


	targetSquare1.isLeftBlocked = true
	targetSquare2.isLeftBlocked = true
	targetSquare3.isRightBlocked = true
	targetSquare4.isRightBlocked = true


	deepCopyBoard[blackPiece.row][blackPiece.col].item = blackPiece
	deepCopyBoard[whitePiece.row][whitePiece.col].item = whitePiece
	board = deepCopyBoard

		


	turn = !turn	
}

</script>

<Toast />
<div class="wrapper">
	<div class="board">
		{#each  board as row , rowindex (rowindex)}
			{#each  row as col , colindex (colindex)}
				<div class="block-wrapper">
					<div class="square-wrapper">
						<div class="square" on:click|preventDefault="{()=>onSquareClick(rowindex,colindex)}">
							{#if board[rowindex][colindex].item instanceof Piece}
							<div class="pawn {board[rowindex][colindex].item.color === Piece.colorBlack ? 'black-pawn' : 'white-pawn'}" on:click={()=>onSelectPiece(board[rowindex][colindex].item)}></div>
						  {/if}
						  
						</div>
						{#if colindex != board[0].length -1}
							<div class="block-left" class:isBlocked={board[rowindex][colindex].isLeftBlocked}  on:click={()=>addWallVertical(rowindex , colindex)}></div>
						{/if}
					</div>
					{#if rowindex != board.length -1}
						<div class="block-bottom"  class:isBlocked={board[rowindex][colindex].isBottomBlocked} on:click={()=>addWallHorizontal(rowindex , colindex)}></div>
					{/if}
				</div>
			{/each}
		{/each}
	</div>	
</div>

<style>

.wrapper{
	box-sizing: border-box;
	height: fit-content;
	width: fit-content;
	position: absolute;
	top:50%;
	left:50%;
	transform: translate(-50%,-50%);
}
.board{
	width: 680px;
	height: fit-content;
	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-wrap: wrap;
}
.square{
	width: 50px;
	height: 50px;
	border: 1px solid black;
	margin-right: 4px ;
	display: flex;
	align-items: center;
	cursor: pointer;
	justify-content: center;
}
.block-left{
	width: 10px;
	height: 50px;
	border: 1px solid black;
	cursor: pointer;
}
.block-bottom{
	width: 50px;
	height: 10px;
	border: 1px solid black;
	cursor: pointer;
}
.square-wrapper{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 4px;
	margin-top: 4px;
	margin-right: 4px;
}
.block-wrapper{
	display: flex;
	flex-direction: column;
	width: fit-content;
	align-items: flex-start;
	justify-content: left;
}
.pawn{
	width: 40px;
	height: 40px;
	border-radius: 50%;
	cursor: pointer;
	position: relative;
}
.black-pawn{
	background:black;
}
.black-pawn::after{
	content: '';
	width: 30px;
	height: 30px;
	border:1px solid white;
	position: absolute;
	border-radius: 50%;
	top:50%;
	left:50%;
	transform: translate(-50% , -50%);
}
.black-pawn::before{
	content: '';
	width: 20px;
	height: 20px;
	border:1px solid white;
	position: absolute;
	border-radius: 50%;
	top:50%;
	left:50%;
	transform: translate(-50% , -50%);
}
.white-pawn{
	box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}
.white-pawn::after{
	content: '';
	width: 30px;
	height: 30px;
	border:1px solid black;
	position: absolute;
	border-radius: 50%;
	top:50%;
	left:50%;
	transform: translate(-50% , -50%);
}
.white-pawn::before{
	content: '';
	width: 20px;
	height: 20px;
	border:1px solid black;
	position: absolute;
	border-radius: 50%;
	top:50%;
	left:50%;
	transform: translate(-50% , -50%);
}
.isBlocked {
    background-color: gray !important; /* Example blocked state styling */
	border-color: red !important;
  }
</style>
