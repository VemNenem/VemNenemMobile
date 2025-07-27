import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import Cabecalho from '@/src/components/headertools';

const windowHeight = Dimensions.get("window").height;

// Configuração do locale para Português Brasileiro
LocaleConfig.locales['ptBR'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'ptBR';

interface Evento {
  titulo: string;
  descricao: string;
  data: string;
}

type EventosPorData = {
  [data: string]: Evento[];
};

const eventosExemplo: EventosPorData = {
  "2024-02-12": [
    {
      titulo: "Consulta Médica",
      descricao: "Consulta de rotina com cardiologista",
      data: "12/02",
    },
  ],
  "2024-02-19": [
    {
      titulo: "Exame de Sangue",
      descricao: "Jejum de 8 horas antes do exame",
      data: "19/02",
    },
  ],
  "2024-02-25": [
    {
      titulo: "Consulta Pré-natal",
      descricao: "Acompanhamento de gravidez",
      data: "25/02",
    },
  ],
};

export default function TelaAgenda() {
  const hoje = new Date().toISOString().split("T")[0];
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  const marcarDatas = () => {
    const marcacoes: any = {};

    Object.keys(eventosExemplo).forEach((data) => {
      marcacoes[data] = {
        marked: true,
        selected: data === dataSelecionada,
        selectedColor: "#42cfe0",
        customStyles: {
          container: {
            backgroundColor: "#42cfe0",
            borderRadius: 20,
          },
          text: {
            color: "white",
            fontWeight: "bold",
          },
        },
      };
    });

    marcacoes[hoje] = {
      ...(marcacoes[hoje] || {}),
      selected: hoje === dataSelecionada,
      selectedColor: "transparent",
      customStyles: {
        container: {
          borderWidth: 2,
          borderColor: "#42cfe0",
          borderRadius: 20,
          backgroundColor: hoje in eventosExemplo ? "#42cfe0" : "transparent",
        },
        text: {
          color: hoje in eventosExemplo ? "white" : "#42cfe0",
          fontWeight: "bold",
        },
      },
    };

    if (!(dataSelecionada in marcacoes)) {
      marcacoes[dataSelecionada] = {
        selected: true,
        selectedColor: "transparent",
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: "#42cfe0",
            borderRadius: 20,
          },
          text: {
            color: "#42cfe0",
            fontWeight: "bold",
          },
        },
      };
    }

    return marcacoes;
  };

  const eventosDoDia = eventosExemplo[dataSelecionada] || [];

  // Função para formatar a data no formato DD/MM
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho title="Agenda" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.calendarioContainer}>
          <Calendar
            onDayPress={(day: DateData) => setDataSelecionada(day.dateString)}
            markingType={"custom"}
            markedDates={marcarDatas()}
            monthFormat={'MMMM yyyy'}
            firstDay={1}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#000",
              selectedDayBackgroundColor: "#42cfe0",
              selectedDayTextColor: "#fff",
              todayTextColor: "#42cfe0",
              dayTextColor: "#000",
              textDisabledColor: "#d9e1e8",
              dotColor: "#42cfe0",
              selectedDotColor: "#fff",
              arrowColor: "#42cfe0",
              monthTextColor: "#000",
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        <LinearGradient
          colors={["#42cfe0", "#bbeaf0"]}
          style={styles.eventosContainer}
        >
          <Text style={styles.tituloEventos}>
            {dataSelecionada === hoje ? "Hoje" : formatarData(dataSelecionada)}
          </Text>
          <Text style={styles.dataEventos}>
            {eventosDoDia.length} {eventosDoDia.length === 1 ? "evento" : "eventos"}
          </Text>

          {eventosDoDia.length === 0 ? (
            <View style={styles.semEventoContainer}>
              <Text style={styles.semEventoTexto}>
                Ainda não possui evento!
              </Text>
            </View>
          ) : (
            <FlatList
              data={eventosDoDia}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartaoEvento}>
                  <Text style={styles.tituloEvento}>{item.titulo}</Text>
                  <Text style={styles.descricaoEvento}>{item.descricao}</Text>
                  <Text style={styles.dataEvento}>{item.data}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              scrollEnabled={false}
            />
          )}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#42cfe0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#004d40",
  },
  calendarioContainer: {
    padding: 15,
  },
  eventosContainer: {
    flex: 1,
    minHeight: 200,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
  },
  tituloEventos: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
    textAlign: "center",
  },
  dataEventos: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  semEventoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  semEventoTexto: {
    fontSize: 16,
    color: "white",
  },
  cartaoEvento: {
    backgroundColor: "#42cfe0",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tituloEvento: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004d40",
    marginBottom: 8,
  },
  descricaoEvento: {
    fontSize: 14,
    color: "#004d40",
    marginBottom: 12,
  },
  dataEvento: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#004d40",
    textAlign: "right",
  },
});