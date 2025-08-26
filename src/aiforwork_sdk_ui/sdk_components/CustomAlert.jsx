import React, { useState } from "react";
import {
  View,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const CustomAlert = ({ visible, children, onClose }) => {
 
  
  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.alertBox}>
          {children }
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default CustomAlert;
const styles = StyleSheet.create({
 
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
