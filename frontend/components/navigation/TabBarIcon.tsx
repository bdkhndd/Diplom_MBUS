import React from 'react';
import { type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
// import { useThemeColor } from '@/hooks/useThemeColor'; // Хэрэв танд useThemeColor hook байхгүй бол доорх Simple хувилбарыг ашиглана.

// 🛑 Хэрэв таны төсөлд '@/hooks/useThemeColor' байхгүй бол, энэ кодыг useThemeColor-гүйгээр ашиглах Simple хувилбарыг доор харна уу.

export function TabBarIcon({ style, color, ...rest }: ComponentProps<typeof Ionicons>) {
  // Tabs-ын өнгийг шууд props-оос (color) авч ашиглана.
  return <Ionicons size={24} style={[{ marginBottom: -3 }, style]} color={color} {...rest} />;
}