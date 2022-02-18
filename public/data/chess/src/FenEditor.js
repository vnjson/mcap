

import {Component} from "../lib/cm-web-modules/app/Component.js"
import {Chessboard, COLOR, INPUT_EVENT_TYPE, PIECE, BORDER_TYPE, MARKER_TYPE, SQUARE_SELECT_TYPE} from "../lib/cm-chessboard/Chessboard.js"
import {MOVE_CANCELED_REASON} from "../lib/cm-chessboard/ChessboardMoveInput.js"
import {Chess} from "../lib/cm-chess/Chess.js"
import {Cookie} from "../lib/cm-web-modules/cookie/Cookie.js"
import {Bind} from "../lib/bind.mjs/Bind.js";


window.theme = 'default'
var chessStyle = localStorage.getItem('style3')

if(chessStyle){
   window.theme = chessStyle

}


export const EDIT_MODE = {
    move: "move",
    erase: "erase",
    wk: "wk", wq: "wq", wr: "wr", wb: "wb", wn: "wn", wp: "wp",
    bk: "bk", bq: "bq", br: "br", bb: "bb", bn: "bn", bp: "bp",
    markers: 'markers'
}

export class FenEditor extends Component {
    constructor(context, props) {
        props = Object.assign({
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            spriteUrl: "./assets/images/chessboard-sprite-staunty.svg",
            onChange: undefined,
            cookieName: null//"cb-min" // set to null, if you don't want to persist the position
        }, props)
        super(undefined, context, props)
        this.state = Bind({
            mode: EDIT_MODE.move,
            fen: props.fen,
            fenValid: true,
            colorToPlay: COLOR.white,
            castling: ["k", "K", "q", "Q"]
        }, {
            mode: {
                callback: () => {
                    setTimeout(() => {
                        for (const button of this.elements.modeButtons) {
                            if (this.state.mode === button.dataset.mode) {
                                button.classList.add("active")
                            } else {
                                button.classList.remove("active")
                            }
                        }
                        this.switchMode(this.state.mode)
                    })
                }
            },
            fen: {
                dom: ".fen-input-output",
                transform: (value) => {
                    setTimeout(() => {
                        const fenParts = value.split(" ")
                        this.state.colorToPlay = fenParts[1]
                        this.state.castling = fenParts[2].split("")
                        this.chessboard.setPosition(value, false).then(() => {
                            this.checkAllowedCastlings()
                        })
                        if (this.props.onChange) {
                            clearTimeout(this.onChangeDebounce)
                            this.onChangeDebounce = setTimeout(() => {
                                if (this.lastChangedValue !== value) {
                                    this.props.onChange(value, this.state.fenValid)
                                    this.lastChangedValue = value
                                }
                            }, 100)
                        }
                    })
                    return value
                },
                parse: (value) => {
                    try {
                        new Chess(value)
                        this.elements.fenInputOutput.classList.remove("is-invalid")
                        this.elements.fenInputOutput.classList.remove("text-danger")
                        this.state.fenValid = true
                        return value
                    } catch (e) {
                        this.elements.fenInputOutput.classList.add("is-invalid")
                        this.elements.fenInputOutput.classList.add("text-danger")
                        this.state.fenValid = false
                        return value
                    }
                }
            },
            colorToPlay: {
                dom: "#colorToPlay",
                parse: (value) => {
                    this.updateFen()
                    return value
                }
            },
            castling: {
                dom: "input[name='castling']",
                callback: (value) => {
                    setTimeout(() => {
                        this.updateFen()
                        return value
                    })
                }
            }
        })

        this.actions = {
            switchMode: (event) => {
                this.state.mode = event.target.dataset.mode
            }
        }
        this.elements = {
            chessboard: context.querySelector(".chessboard"),
            fenInputOutput: context.querySelector("#fenInputOutput"),
            modeButtons: context.querySelectorAll("button[data-mode]")
        }

        const fenFromURL = new URLSearchParams(window.location.search).get("fen")
        if (fenFromURL) {
            this.state.fen = fenFromURL
        } else if (this.props.cookieName) {
            /*
            const fromCookie = Cookie.read(this.props.cookieName)
            if (fromCookie) {
                this.state.fen = fromCookie
            } else {
                this.state.fen = this.props.fen
            }*/
            this.state.fen = this.props.fen
        } else {
            this.state.fen = this.props.fen
        }

        this.chessboard = new Chessboard(this.elements.chessboard, {
            position: this.props.fen,
            responsive: true,
            sprite: {
                url: this.props.spriteUrl
            },
            style: {
                aspectRatio: 0.94,
                borderType: BORDER_TYPE.frame,
                cssClass: window.theme
            }
        })
        this.addDataEventListeners()

    }

    switchMode(toMode) {
        this.chessboard.disableMoveInput()
        this.chessboard.disableSquareSelect()
        switch (toMode) {
            case EDIT_MODE.move:
                this.chessboard.enableMoveInput((event) => {
                    if (event.type === INPUT_EVENT_TYPE.moveStart) {
                        this.moveStartEvent = event
                        this.moveStartEvent.piece = this.chessboard.getPiece(event.square)
                    } else if (event.type === INPUT_EVENT_TYPE.moveCanceled && event.reason === MOVE_CANCELED_REASON.movedOutOfBoard) {
                        this.chessboard.setPiece(this.moveStartEvent.square, undefined)
                    }
                    this.updateFen()
                    return true
                })
                break
            case EDIT_MODE.erase:
                this.chessboard.enableMoveInput((event) => {
                    if (event.type === INPUT_EVENT_TYPE.moveStart) {
                        this.chessboard.setPiece(event.square, undefined)
                        this.updateFen()
                    }
                    return false
                })
                break
            case EDIT_MODE.markers:
                this.chessboard.enableSquareSelect((event) => {

                    let markerType =  MARKER_TYPE.circle
                    let markersOnSquare = this.chessboard.getMarkers(event.square, markerType)

                        if (markersOnSquare.length > 0) {
                            this.chessboard.removeMarkers(event.square, markerType);
                        } 
                        else {
                             this.chessboard.addMarker(event.square, markerType);
                        }
 

                })

                break
            default: // the pieces buttons
                this.chessboard.enableSquareSelect((event) => {
                    this.chessboard.setPiece(event.square, this.state.mode)
                    this.updateFen()
                })
                break
        }
    }

    checkAllowedCastlings() {
        let castleWk = true
        let castleWq = true
        let castleBk = true
        let castleBq = true
        if (this.chessboard.getPiece("e1") !== PIECE.wk) {
            castleWk = false
            castleWq = false
        }
        if (this.chessboard.getPiece("h1") !== PIECE.wr) {
            castleWk = false
        }
        if (this.chessboard.getPiece("a1") !== PIECE.wr) {
            castleWq = false
        }
        if (this.chessboard.getPiece("e8") !== PIECE.bk) {
            castleBk = false
            castleBq = false
        }
        if (this.chessboard.getPiece("h8") !== PIECE.br) {
            castleBk = false
        }
        if (this.chessboard.getPiece("a8") !== PIECE.br) {
            castleBq = false
        }
        if (!castleWk) {
            const index = this.state.castling.indexOf("K")
            if (index !== -1) {
                this.state.castling.splice(index, 1)
            }
        }
        if (!castleWq) {
            const index = this.state.castling.indexOf("Q")
            if (index !== -1) {
                this.state.castling.splice(index, 1)
            }
        }
        if (!castleBk) {
            const index = this.state.castling.indexOf("k")
            if (index !== -1) {
                this.state.castling.splice(index, 1)
            }
        }
        if (!castleBq) {
            const index = this.state.castling.indexOf("q")
            if (index !== -1) {
                this.state.castling.splice(index, 1)
            }
        }
    }

    updateFen() {
        clearTimeout(this.debounceFen)
        this.debounceFen = setTimeout(() => {
            if (this.state.fenValid) {
                const newFen = this.chessboard.getPosition() + " " +
                    this.state.colorToPlay + " " +
                    (this.state.castling.length > 0 ? this.state.castling.join("") : "-") + " - 0 1"
                if (newFen !== this.state.fen) {
                    this.state.fen = newFen
                }
                if (this.props.cookieName) {
                    Cookie.write(this.props.cookieName, this.state.fen)
                }
            }
        })
    }
}