import { useEffect, useState } from "react";
import { clsx } from "clsx";
import styles from "./StarField.module.scss";

type StarFieldProps = {};

const StarField = ({}: StarFieldProps) => {
    const randomPosition = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const [stars, setStars] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const sizes = [2, 2, 1, 1, 1, 1, 1];
        const newStars = [];
        for (let i = 0; i < 300; i++) {
            const top = randomPosition(0, 100);
            const left = randomPosition(0, 100);
            const random = Math.floor(Math.random() * sizes.length);
            const randomSize = sizes[random];
            let className = "";

            if (i <= 30) {
                className = styles.star1;
            } else if (i <= 60) {
                className = styles.star2;
            } else if (i <= 90) {
                className = styles.star3;
            } else if (i <= 120) {
                className = styles.star4;
            } else if (i <= 150) {
                className = styles.star5;
            }

            newStars.push(
                <div
                    key={i}
                    className={clsx(className, styles.star)}
                    style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        height: `${randomSize}px`,
                        width: `${randomSize}px`,
                    }}
                />
            );
        }
        setStars(newStars);
    }, []);

    return <div className={styles.stars}>{stars}</div>;
};

export default StarField; 