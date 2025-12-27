import { Text as RNText, TextProps } from "react-native";

export default function AppText(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[
        { fontFamily: "Poppins_400Regular" },
        props.style,
      ]}
    />
  );
}
