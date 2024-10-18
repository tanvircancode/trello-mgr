import { useState } from "react";
import "./droparea.scss";

const DropArea = ({ index, activeCard , onDrop}) => {
    const [showDrop, setShowDrop] = useState(false);

    const xxx = () => {
        setShowDrop(true);
        console.log(showDrop)
    }
    const yyy = () => {
        setShowDrop(false);
        console.log(showDrop);
    }

    return (
        <section
            onDragEnter={xxx}
            onDragLeave={yyy}
            onDrop={() => {
                onDrop();
                setShowDrop(false);
            }}
            onDragOver={e => e.preventDefault()}
            className={ showDrop ? "drop_area" : "hide_drop"}
        >
            Drop here
        </section>
    );
};

export default DropArea;
