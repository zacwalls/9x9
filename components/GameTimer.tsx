import { Text } from "react-native";
import { useEffect } from "react";

import useGameStore from "@/hooks/useGameStore";

function getGameTimeFromSeconds(time: number) {
    let hours = Math.round(time / 3600)
    let minutes = Math.round(time / 60)
    let seconds = time % 60
    let timeString = ''

    if (hours > 0) {
        timeString += `${hours}h `
    }

    if (minutes > 0) {
        timeString += `${minutes}m `
    }

    timeString += `${seconds}s`
    return timeString
}

export default function GameTimer() {
    const gameTime = useGameStore((state) => state.gameTimeSeconds)
    const setGameTime = useGameStore((state) => state.setGameTimeSeconds)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setGameTime(gameTime + 1)
        }, 1000)

        return () => clearInterval(intervalId);
    }, [gameTime])

    return <Text className='text-white text-xl'>{getGameTimeFromSeconds(gameTime)}</Text>
}