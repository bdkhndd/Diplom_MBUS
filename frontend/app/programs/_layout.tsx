import { Stack } from 'expo-router';
const PRIMARY_COLOR = '#3b5998'; 

export default function RootProgramLayout() {
  // ene stack programs/[id] screenii headeriig udirdah zoriulttai
  return (
    <Stack>
      
      {/* programs/[id].tsx  mergejil details*/}
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: true, 
          title: '', 
          headerStyle: { backgroundColor: PRIMARY_COLOR },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack>
  );
}