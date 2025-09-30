import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import Cabecalho from '@/src/components/headertools';
import ModalAdicionarEvento from '@/src/components/modalevento';
import ModalEditarEvento from '@/src/components/editarevento';

const windowHeight = Dimensions.get("window").height;

// Configuração do locale para Português Brasileiro
LocaleConfig.locales['ptBR'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
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

const hoje = (() => {
  const agora = new Date();
  const brasilTime = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const ano = brasilTime.getFullYear();
  const mes = String(brasilTime.getMonth() + 1).padStart(2, '0');
  const dia = String(brasilTime.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
})();

const eventosExemplo: EventosPorData = {
  [hoje]: [
    {
      titulo: "Título",
      descricao: "Lorem ipsum dolor sit amet, con sectetur adipiscin ipsum dolor.\nLorem ipsum dolor sit amet, con sectetur adipiscin ipsum dolor.\nLorem ipsum dolor sit amet, con sectetur adipiscin ipsum dolor.\nLorem ipsum dolor sit amet, con sectetur adipiscin ipsum dolor.\nLorem ipsum dolor sit amet, con sectetur adipiscin ipsum dolor.",
      data: hoje.split("-").reverse().join("/").substring(0, 5),
    },
  ],
};

export default function TelaAgenda() {
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [eventos, setEventos] = useState(eventosExemplo);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAdicionarVisivel, setModalAdicionarVisivel] = useState(false);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);

  const marcarDatas = () => {
    const marcacoes: any = {};

    Object.keys(eventos).forEach((data) => {
      const isSelected = data === dataSelecionada;
      const isToday = data === hoje;

      marcacoes[data] = {
        marked: true,
        selected: isSelected,
        customStyles: {
          container: {
            backgroundColor: isSelected ? "#42cfe0" : "transparent",
            borderRadius: 50,
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: isToday && !isSelected ? 2 : 0,
            borderColor: "#42cfe0",
          },
          text: {
            color: isSelected ? "white" : isToday ? "#42cfe0" : "#333",
            fontWeight: isSelected || isToday ? "bold" : "400",
          },
        },
      };
    });

    if (!marcacoes[hoje]) {
      marcacoes[hoje] = {
        selected: hoje === dataSelecionada,
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: "#42cfe0",
            borderRadius: 50,
            width: 32,
            height: 32,
            backgroundColor: hoje === dataSelecionada ? "#42cfe0" : "transparent",
          },
          text: {
            color: hoje === dataSelecionada ? "white" : "#42cfe0",
            fontWeight: "bold",
          },
        },
      };
    }

    return marcacoes;
  };

  const eventosDoDia = eventos[dataSelecionada] || [];

  const abrirEvento = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEventoSelecionado(null);
  };

  const editarEvento = () => {
    setModalVisivel(false);
    setModalEditarVisivel(true);
  };

  const salvarEdicao = (novoTitulo: string, novaDescricao: string) => {
    if (!eventoSelecionado) return;

    const eventosAtualizados = { ...eventos };
    
    // Encontra e atualiza o evento
    if (eventosAtualizados[dataSelecionada]) {
      const index = eventosAtualizados[dataSelecionada].findIndex(
        e => e.titulo === eventoSelecionado.titulo && 
             e.descricao === eventoSelecionado.descricao
      );
      
      if (index !== -1) {
        eventosAtualizados[dataSelecionada][index] = {
          ...eventosAtualizados[dataSelecionada][index],
          titulo: novoTitulo,
          descricao: novaDescricao,
        };
      }
    }

    setEventos(eventosAtualizados);
    setModalEditarVisivel(false);
    setEventoSelecionado(null);
  };

  const deletarEvento = () => {
    if (!eventoSelecionado) return;

    const eventosAtualizados = { ...eventos };
    
    if (eventosAtualizados[dataSelecionada]) {
      eventosAtualizados[dataSelecionada] = eventosAtualizados[dataSelecionada].filter(
        e => !(e.titulo === eventoSelecionado.titulo && e.descricao === eventoSelecionado.descricao)
      );
      
      // Remove a data se não houver mais eventos
      if (eventosAtualizados[dataSelecionada].length === 0) {
        delete eventosAtualizados[dataSelecionada];
      }
    }

    setEventos(eventosAtualizados);
    fecharModal();
  };

  const abrirModalAdicionar = () => {
    setModalAdicionarVisivel(true);
  };

  const salvarNovoEvento = (titulo: string, descricao: string) => {
    const novoEvento: Evento = {
      titulo,
      descricao,
      data: dataSelecionada.split("-").reverse().join("/").substring(0, 5),
    };

    const eventosAtualizados = { ...eventos };

    if (eventosAtualizados[dataSelecionada]) {
      eventosAtualizados[dataSelecionada].push(novoEvento);
    } else {
      eventosAtualizados[dataSelecionada] = [novoEvento];
    }

    setEventos(eventosAtualizados);
    setModalAdicionarVisivel(false);
  };

  const formatarDataExibicao = (dataString: string) => {
    const [ano, mes, dia] = dataString.split("-");
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
            firstDay={0}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#666",
              selectedDayBackgroundColor: "#42cfe0",
              selectedDayTextColor: "#fff",
              todayTextColor: "#42cfe0",
              dayTextColor: "#333",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#333",
              monthTextColor: "#333",
              textDayFontWeight: "400",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "400",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendario}
          />
        </View>

        <View style={styles.eventosContainer}>
          <View style={styles.eventosHeader}>
            <View>
              <Text style={styles.tituloEventos}>
                {dataSelecionada === hoje ? "Hoje" : formatarDataExibicao(dataSelecionada)}
              </Text>
              <Text style={styles.quantidadeEventos}>
                {eventosDoDia.length} {eventosDoDia.length === 1 ? "evento" : "eventos"}
              </Text>
            </View>
            <TouchableOpacity style={styles.botaoEvento} onPress={abrirModalAdicionar}>
              <Ionicons name="add-circle" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {eventosDoDia.length === 0 ? (
            <View style={styles.semEventoContainer}>
              <Text style={styles.semEventoTexto}>
                Ainda não possui evento!
              </Text>
            </View>
          ) : (
            <View style={styles.listaEventos}>
              {eventosDoDia.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cartaoEvento}
                  onPress={() => abrirEvento(item)}
                >
                  <View style={styles.barraLateral} />
                  <View style={styles.conteudoEvento}>
                    <View style={styles.headerEvento}>
                      <Text style={styles.tituloEvento}>{item.titulo}</Text>
                      <Text style={styles.dataEvento}>{item.data}</Text>
                    </View>

                    <Text style={styles.labelDescricao}>Descrição:</Text>
                    <Text
                      style={styles.descricaoEvento}
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>

                    <View style={styles.botaoExpandir}>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="#666"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* MODAL DE ADICIONAR EVENTO */}
      <ModalAdicionarEvento
        visivel={modalAdicionarVisivel}
        onFechar={() => setModalAdicionarVisivel(false)}
        onSalvar={salvarNovoEvento}
        dataEscolhida={dataSelecionada}
      />

      {/* MODAL DE EDITAR EVENTO */}
      <ModalEditarEvento
        visivel={modalEditarVisivel}
        onFechar={() => {
          setModalEditarVisivel(false);
          setEventoSelecionado(null);
        }}
        onSalvar={salvarEdicao}
        tituloInicial={eventoSelecionado?.titulo || ""}
        descricaoInicial={eventoSelecionado?.descricao || ""}
      />

      {/* MODAL DE VISUALIZAR EVENTO */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>
                {eventoSelecionado?.data}
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalQuantidade}>1 evento</Text>

              <View style={styles.modalCard}>
                <View style={styles.modalCardBarra} />
                <View style={styles.modalCardConteudo}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitulo}>
                      {eventoSelecionado?.titulo}
                    </Text>
                    <Text style={styles.modalCardData}>
                      {eventoSelecionado?.data}
                    </Text>
                  </View>

                  <ScrollView style={styles.modalCardDescricaoContainer}>
                    <Text style={styles.modalCardDescricao}>
                      {eventoSelecionado?.descricao}
                    </Text>
                  </ScrollView>

                  <View style={styles.modalBotoes}>
                    <TouchableOpacity
                      style={styles.botaoEditar}
                      onPress={editarEvento}
                    >
                      <Text style={styles.textoBotaoEditar}>EDITAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botaoDeletar}
                      onPress={deletarEvento}
                    >
                      <Text style={styles.textoBotaoDeletar}>DELETAR EVENTO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  calendarioContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  calendario: {
    borderRadius: 10,
  },
  eventosContainer: {
    flex: 1,
    backgroundColor: "#5dd4e3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -10,
  },
  eventosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tituloEventos: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  quantidadeEventos: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
  },
  botaoEvento: {
    backgroundColor: "transparent",
  },
  semEventoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  semEventoTexto: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  listaEventos: {
    marginBottom: 20,
  },
  cartaoEvento: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  barraLateral: {
    width: 6,
    backgroundColor: "#4a90e2",
  },
  conteudoEvento: {
    flex: 1,
    padding: 16,
  },
  headerEvento: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dataEvento: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  labelDescricao: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  descricaoEvento: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  botaoExpandir: {
    alignItems: "center",
    marginTop: 8,
  },
  botaoAdicionar: {
    backgroundColor: "#4dd4e3",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // ESTILOS DO MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#5dd4e3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSpacer: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalQuantidade: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 15,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    overflow: "hidden",
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  modalCardBarra: {
    width: 6,
    backgroundColor: "#4a90e2",
  },
  modalCardConteudo: {
    flex: 1,
    padding: 20,
  },
  modalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalCardTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalCardData: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  modalCardDescricaoContainer: {
    flex: 1,
    marginBottom: 20,
  },
  modalCardDescricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  modalBotoes: {
    gap: 12,
  },
  botaoEditar: {
    backgroundColor: "#5dd4e3",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotaoEditar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoDeletar: {
    backgroundColor: "#ff7b7b",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotaoDeletar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});