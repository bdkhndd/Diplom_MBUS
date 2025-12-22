import { useColorScheme } from './useColorScheme'; // Адил хавтас доторх hook-ийг импортлов.
import { Colors } from '@/constants/Colors'; // Colors constant-ийг импортлов.

export function useThemeColor(
  props: { light?: string; dark?: string },
  // 🛑 colorName нь зөвхөн theme доторх өнгөнүүд байх ёстой.
  colorName: keyof typeof Colors.light // ✅ ЭНД Colors.light-ийн түлхүүрүүдийг авна.
) {
  const theme = useColorScheme(); 
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Colors[theme] нь одоо Colors.light эсвэл Colors.dark гэсэн Object байх нь баталгаатай.
    return Colors[theme][colorName]; // ✅ Энэ мөр одоо ажиллах ёстой.
  }
}