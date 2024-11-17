
export function Button(props){
    return (
        <button style={{backgroundColor: props.color}}> 
            <p>{props.text}</p>
        </button>
    )
}