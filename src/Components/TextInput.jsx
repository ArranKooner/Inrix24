import { useState } from "react"

function TextInput (){
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter some text"
            />
        </div>
        );
    }
    
export default TextInput;