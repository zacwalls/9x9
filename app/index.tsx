import { Text, View, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className='bg-black h-full flex flex-col justify-center items-center gap-10'>
      <Text className='text-white text-5xl'>9x9</Text>
      <Link
        className='border border-white text-white text-2xl p-5'
        href={{ pathname: '/game' }}
       >
        New Game
      </Link>
    </View>
  );
}
