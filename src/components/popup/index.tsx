import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable
} from 'react-native';

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  onChangeText: (text: string) => void;
}

export default function Popup({
  visible,
  onClose,
  onSubmit,
  value,
  onChangeText
}: PopupProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.popupContainer}>
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui..."
            value={value}
            onChangeText={onChangeText}
          />
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOutline} onPress={onClose}>
            <Text style={styles.buttonOutlineText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 10
  },
  label: {
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#42cfe0', 
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonOutline: {
    borderColor: '#5dd4e3', 
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8
  },
  buttonOutlineText: {
    color: '#5dd4e3', 
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
