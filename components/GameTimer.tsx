import { Text } from "react-native";
import { useEffect } from "react";

import useGameStore from "@/hooks/useGameStore";

function getGameTimeFromSeconds(time: number) {
    let hours = Math.floor(time / 3600)
    let minutes = Math.floor((time % 3600) / 60)
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
    const gameTimerRunning = useGameStore((state) => state.gameTimerRunning)

    useEffect(() => {
        if (!gameTimerRunning) {
            return
        }

        const intervalId = setInterval(() => {
            setGameTime(gameTime + 1)
        }, 1000)

        return () => clearInterval(intervalId);
    }, [gameTime, gameTimerRunning])

    return <Text className='my-0 mx-auto p-10 text-white text-xl lg:text-lg lg:p-8'>{getGameTimeFromSeconds(gameTime)}</Text>
}