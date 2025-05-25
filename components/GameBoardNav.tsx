import { Text, View } from "react-native"
import Svg, {Path} from 'react-native-svg';
import { Link } from "expo-router"

import GameTimer from "./GameTimer"

export default function GameBoardNav() {
    return (
        <View className="flex flex-row w-full">
            <Link className="flex justify-center items-center text-white text-2xl" href="/"> 
                <Svg width="36px" height="36px" viewBox="0 0 24 24" fill="none">
                    <Path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
            </Link>
            <GameTimer />
            <Text className="w-9">&nbsp;</Text>
        </View>
    )
}