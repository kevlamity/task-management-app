import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('TaskBoard')}>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 83,
  },
  navText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
});



export default Navbar;
