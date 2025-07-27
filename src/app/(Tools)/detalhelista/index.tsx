import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetalheLista() {
  const { categoria } = useLocalSearchParams();
  const categoriaObj = categoria ? JSON.parse(decodeURIComponent(categoria as string)) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhe da Lista</Text>
      {categoriaObj && (
        <>
          <Text style={styles.item}>Nome: {categoriaObj.nome}</Text>
          <Text style={styles.item}>Quantidade: {categoriaObj.quantidade}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 16, marginVertical: 4 },
});
