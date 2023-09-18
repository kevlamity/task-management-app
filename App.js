import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import AppNavigator from './src/navigators/AppNavigator';



export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  return <AppNavigator />;
}
