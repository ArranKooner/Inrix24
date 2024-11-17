import { useState } from "react"

export function Textbox() {
    const [text, setText]=useState ("")

    return (
        <>
            <input onChange={(e) => setText (e.target.value)}></input>
            <p></p>
        </>
    )
}