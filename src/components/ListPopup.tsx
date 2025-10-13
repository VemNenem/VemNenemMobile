import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';

interface ListPopupProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (nome: string) => Promise<void>;
    title: string;
    placeholder: string;
    confirmText: string;
}

export default function ListPopup({
    visible,
    onClose,
    onConfirm,
    title,
    placeholder,
    confirmText,
}: ListPopupProps) {
    const [nome, setNome] = useState('');

    const handleConfirm = async () => {
        if (nome.trim()) {
            await onConfirm(nome);
            setNome('');
        }
    };

    const handleClose = () => {
        setNome('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.title}>{title}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={nome}
                        onChangeText={setNome}
                        autoFocus
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
    cancelText: {
        color: '#666',
        fontWeight: '500',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '500',
    },
});
