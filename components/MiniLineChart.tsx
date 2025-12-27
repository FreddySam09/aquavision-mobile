// components/MiniLineChart.tsx
// import { View } from "react-native";

// interface Props {
//   data: number[];
//   color?: string;
// }

// export default function MiniLineChart({
//   data,
//   color = "#22c55e",
// }: Props) {
//   if (!data || data.length < 2) return null;

//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const range = max - min || 1;

//   return (
//     <View className="flex-row items-end h-12 mt-2">
//       {data.map((value, index) => {
//         const height = ((value - min) / range) * 40 + 4;

//         return (
//           <View
//             key={index}
//             className="flex-1 mx-[1px] rounded-sm"
//             style={{
//               height,
//               backgroundColor: color,
//               opacity: index === data.length - 1 ? 1 : 0.4,
//             }}
//           />
//         );
//       })}
//     </View>
//   );
// }


import Svg, { Polyline } from "react-native-svg";
import { View } from "react-native";

interface Props {
  data: number[];
  color?: string;
}

export default function MiniLineChart({
  data,
  color = "#22c55e",
}: Props) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 40 - ((v - min) / (max - min || 1)) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View className="mt-2">
      <Svg width="100%" height="40" viewBox="0 0 100 40">
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}