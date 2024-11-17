import React from 'react'
import '../Components/pagetwo.css'

export function PageTwo() {
return (
    <>
        <div class="typing">Meet The Team!</div>

        <div className="team-container">
        <div className="team-member">
            <img src="/arran2.png" alt="Arran Kooner" className="image-style" />
            <p>Arran Kooner</p>
        </div>
        <div className="team-member">
            <img src="/david.png" alt="David Nguyen" className="image-style" />
            <p>David Nguyen</p>
        </div>
        <div className="team-member">
            <img src="/Eden.png" alt="Eden Steinbeck" className="image-style" />
            <p>Eden Steinbeck</p>
        </div>
        <div className="team-member">
            <img src="/samhita2.png" alt="Samhita Rachapudi" className="image-style" />
            <p>Samhita Rachapudi</p>
        </div>
        <div className="team-member">
            <img src="/arran2.png" alt="Shreya" className="image-style" />
            <p>Shreya Pothineni</p>
        </div>
        <div className="team-member">
            <img src="/gwyn3.png" alt="Gwyn Anawalt" className="image-style" />
            <p>Gwyn Anawalt</p>
        </div>
        </div>
    </>
    );
}
export default PageTwo